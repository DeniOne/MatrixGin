# Implementation Plan: Module 33 Phase 2 — Backend Services

**Goal:** Implement event-sourcing service, FSM validation, and core domain logic for Personnel-HR-Records.

---

## User Review Required

> [!IMPORTANT]
> **Critical Design Decisions:**
> 1. **HRDomainEventService** — all juridical actions MUST emit events
> 2. **FSM Validation** — canonical transition map prevents invalid status changes
> 3. **Role-Based Authorization** — only authorized roles can emit specific events
> 4. **No Direct DB Access** — all HR mutations go through domain services

---

## Proposed Changes

### Backend Services

#### [NEW] `backend/src/modules/personnel/domain/hr-status-fsm.ts`

**FSM Transition Map (CANONICAL)**

```typescript
import { HRStatus } from '@prisma/client';

// Canonical FSM Transition Map
export const HR_STATUS_TRANSITIONS: Record<HRStatus, HRStatus[]> = {
  ONBOARDING: ['PROBATION', 'EMPLOYED', 'TERMINATED'],
  PROBATION: ['EMPLOYED', 'TERMINATED'],
  EMPLOYED: ['SUSPENDED', 'LEAVE', 'TERMINATED'],
  SUSPENDED: ['EMPLOYED', 'TERMINATED'],
  LEAVE: ['EMPLOYED', 'TERMINATED'],
  TERMINATED: ['ARCHIVED'],
  ARCHIVED: [], // Terminal state - no transitions allowed
};

export class HRStatusFSMError extends Error {
  constructor(from: HRStatus, to: HRStatus) {
    const allowed = HR_STATUS_TRANSITIONS[from];
    super(
      `Invalid HR status transition: ${from} → ${to}. ` +
      `Allowed transitions: ${allowed.length > 0 ? allowed.join(', ') : 'none (terminal state)'}`
    );
    this.name = 'HRStatusFSMError';
  }
}

export function validateHRStatusTransition(
  from: HRStatus,
  to: HRStatus
): void {
  const allowedTransitions = HR_STATUS_TRANSITIONS[from];
  
  if (!allowedTransitions.includes(to)) {
    throw new HRStatusFSMError(from, to);
  }
}

export function isTerminalStatus(status: HRStatus): boolean {
  return HR_STATUS_TRANSITIONS[status].length === 0;
}
```

---

#### [NEW] `backend/src/modules/personnel/domain/hr-event-validator.ts`

**Role-Based Event Authorization (CANONICAL)**

```typescript
import { HREventType } from '@prisma/client';

// Role-based Event Permissions
export const EVENT_ROLE_PERMISSIONS: Record<HREventType, string[]> = {
  EMPLOYEE_HIRED: ['DIRECTOR', 'HR_MANAGER'],
  EMPLOYEE_TRANSFERRED: ['DIRECTOR', 'HR_MANAGER'],
  EMPLOYEE_PROMOTED: ['DIRECTOR', 'HR_MANAGER'],
  EMPLOYEE_DEMOTED: ['DIRECTOR'],
  EMPLOYEE_SUSPENDED: ['DIRECTOR'],
  EMPLOYEE_DISMISSED: ['DIRECTOR'],
  
  DOCUMENT_UPLOADED: ['HR_SPECIALIST', 'HR_MANAGER', 'DIRECTOR'],
  DOCUMENT_VERIFIED: ['HR_MANAGER', 'DIRECTOR'],
  DOCUMENT_EXPIRED: ['SYSTEM'], // Auto-generated
  
  ORDER_CREATED: ['HR_SPECIALIST', 'HR_MANAGER'],
  ORDER_SIGNED: ['DIRECTOR'], // CRITICAL: Only DIRECTOR can sign
  ORDER_CANCELLED: ['DIRECTOR', 'HR_MANAGER'],
  
  CONTRACT_SIGNED: ['DIRECTOR', 'HR_MANAGER'],
  CONTRACT_AMENDED: ['DIRECTOR', 'HR_MANAGER'],
  CONTRACT_TERMINATED: ['DIRECTOR'],
  
  FILE_ARCHIVED: ['HR_MANAGER', 'DIRECTOR'],
};

export class UnauthorizedEventError extends Error {
  constructor(eventType: HREventType, actorRole: string) {
    const allowedRoles = EVENT_ROLE_PERMISSIONS[eventType];
    super(
      `Role '${actorRole}' not authorized for event '${eventType}'. ` +
      `Allowed roles: ${allowedRoles.join(', ')}`
    );
    this.name = 'UnauthorizedEventError';
  }
}

export function validateActorRole(
  eventType: HREventType,
  actorRole: string
): void {
  const allowedRoles = EVENT_ROLE_PERMISSIONS[eventType];
  
  if (!allowedRoles || !allowedRoles.includes(actorRole)) {
    throw new UnauthorizedEventError(eventType, actorRole);
  }
}
```

---

#### [NEW] `backend/src/modules/personnel/services/hr-domain-event.service.ts`

**Event-Sourcing Service**

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { HREventType, HRAggregateType } from '@prisma/client';
import { validateActorRole } from '../domain/hr-event-validator';

interface EmitEventParams {
  eventType: HREventType;
  aggregateType: HRAggregateType;
  aggregateId: string;
  actorId: string;
  actorRole: string;
  payload: any;
  previousState?: any;
  newState?: any;
  legalBasis?: string;
}

@Injectable()
export class HRDomainEventService {
  constructor(private prisma: PrismaService) {}

  /**
   * Emit HR domain event (append-only)
   * CRITICAL: Validates actor role before emission
   */
  async emit(params: EmitEventParams): Promise<void> {
    const {
      eventType,
      aggregateType,
      aggregateId,
      actorId,
      actorRole,
      payload,
      previousState,
      newState,
      legalBasis,
    } = params;

    // CRITICAL: Validate actor role
    validateActorRole(eventType, actorRole);

    // Emit event (INSERT-only, immutable)
    await this.prisma.hRDomainEvent.create({
      data: {
        eventType,
        aggregateType,
        aggregateId,
        actorId,
        actorRole,
        payload,
        previousState,
        newState,
        legalBasis,
      },
    });
  }

  /**
   * Get all events for an aggregate (for audit)
   */
  async getEventsByAggregate(
    aggregateId: string,
    aggregateType?: HRAggregateType
  ) {
    return this.prisma.hRDomainEvent.findMany({
      where: {
        aggregateId,
        ...(aggregateType && { aggregateType }),
      },
      orderBy: { occurredAt: 'asc' },
    });
  }

  /**
   * Replay events to reconstruct aggregate state
   * Used for audit and state verification
   */
  async replayEvents(aggregateId: string): Promise<any[]> {
    const events = await this.getEventsByAggregate(aggregateId);
    
    // Return chronological event log
    return events.map(event => ({
      timestamp: event.occurredAt,
      type: event.eventType,
      actor: event.actorId,
      role: event.actorRole,
      payload: event.payload,
      legalBasis: event.legalBasis,
    }));
  }
}
```

---

#### [NEW] `backend/src/modules/personnel/services/personal-file.service.ts`

**PersonalFile Service with FSM**

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { HRStatus } from '@prisma/client';
import { validateHRStatusTransition } from '../domain/hr-status-fsm';
import { HRDomainEventService } from './hr-domain-event.service';

@Injectable()
export class PersonalFileService {
  constructor(
    private prisma: PrismaService,
    private hrEventService: HRDomainEventService
  ) {}

  /**
   * Create PersonalFile (on employee hiring)
   */
  async create(employeeId: string, actorId: string, actorRole: string) {
    // Generate unique file number
    const fileNumber = await this.generateFileNumber();

    const personalFile = await this.prisma.personalFile.create({
      data: {
        employeeId,
        fileNumber,
        hrStatus: 'ONBOARDING',
      },
    });

    // Emit EMPLOYEE_HIRED event
    await this.hrEventService.emit({
      eventType: 'EMPLOYEE_HIRED',
      aggregateType: 'PERSONAL_FILE',
      aggregateId: personalFile.id,
      actorId,
      actorRole,
      payload: {
        employeeId,
        fileNumber,
      },
      newState: { hrStatus: 'ONBOARDING' },
    });

    return personalFile;
  }

  /**
   * Update HR status with FSM validation
   */
  async updateStatus(
    id: string,
    newStatus: HRStatus,
    actorId: string,
    actorRole: string,
    reason?: string
  ) {
    const personalFile = await this.prisma.personalFile.findUnique({
      where: { id },
    });

    if (!personalFile) {
      throw new NotFoundException(`PersonalFile ${id} not found`);
    }

    // CRITICAL: Validate FSM transition
    validateHRStatusTransition(personalFile.hrStatus, newStatus);

    // Update status
    const updated = await this.prisma.personalFile.update({
      where: { id },
      data: { hrStatus: newStatus },
    });

    // Emit status change event
    const eventTypeMap: Record<HRStatus, any> = {
      PROBATION: 'EMPLOYEE_TRANSFERRED',
      EMPLOYED: 'EMPLOYEE_HIRED',
      SUSPENDED: 'EMPLOYEE_SUSPENDED',
      LEAVE: 'EMPLOYEE_TRANSFERRED',
      TERMINATED: 'EMPLOYEE_DISMISSED',
      ARCHIVED: 'FILE_ARCHIVED',
      ONBOARDING: 'EMPLOYEE_HIRED',
    };

    await this.hrEventService.emit({
      eventType: eventTypeMap[newStatus] || 'EMPLOYEE_TRANSFERRED',
      aggregateType: 'PERSONAL_FILE',
      aggregateId: id,
      actorId,
      actorRole,
      payload: { reason },
      previousState: { hrStatus: personalFile.hrStatus },
      newState: { hrStatus: newStatus },
    });

    return updated;
  }

  private async generateFileNumber(): Promise<string> {
    const count = await this.prisma.personalFile.count();
    const year = new Date().getFullYear();
    return `PF-${year}-${String(count + 1).padStart(5, '0')}`;
  }
}
```

---

## Verification Plan

### Automated Tests

**1. FSM Validation Tests**
```typescript
// backend/src/modules/personnel/__tests__/hr-status-fsm.test.ts
describe('HRStatus FSM Validation', () => {
  it('should allow ONBOARDING → EMPLOYED', () => {
    expect(() => validateHRStatusTransition('ONBOARDING', 'EMPLOYED')).not.toThrow();
  });
  
  it('should prevent EMPLOYED → ONBOARDING', () => {
    expect(() => validateHRStatusTransition('EMPLOYED', 'ONBOARDING'))
      .toThrow(HRStatusFSMError);
  });
  
  it('should prevent transitions from ARCHIVED', () => {
    expect(() => validateHRStatusTransition('ARCHIVED', 'EMPLOYED'))
      .toThrow('terminal state');
  });
});
```

**2. Role Authorization Tests**
```typescript
// backend/src/modules/personnel/__tests__/hr-event-validator.test.ts
describe('Event Role Authorization', () => {
  it('should allow DIRECTOR to sign orders', () => {
    expect(() => validateActorRole('ORDER_SIGNED', 'DIRECTOR')).not.toThrow();
  });
  
  it('should prevent HR_SPECIALIST from signing orders', () => {
    expect(() => validateActorRole('ORDER_SIGNED', 'HR_SPECIALIST'))
      .toThrow(UnauthorizedEventError);
  });
});
```

**3. Event Emission Tests**
```typescript
// backend/src/modules/personnel/__tests__/hr-domain-event.service.test.ts
describe('HRDomainEventService', () => {
  it('should emit event with valid role', async () => {
    await service.emit({
      eventType: 'EMPLOYEE_HIRED',
      aggregateType: 'PERSONAL_FILE',
      aggregateId: 'test-id',
      actorId: 'user-1',
      actorRole: 'DIRECTOR',
      payload: {},
    });
    
    const events = await service.getEventsByAggregate('test-id');
    expect(events).toHaveLength(1);
  });
  
  it('should reject event with invalid role', async () => {
    await expect(
      service.emit({
        eventType: 'ORDER_SIGNED',
        actorRole: 'EMPLOYEE', // Not authorized!
        // ...
      })
    ).rejects.toThrow(UnauthorizedEventError);
  });
});
```

---

## Estimated Effort

- FSM validation: 1 hour
- Role validator: 1 hour
- HRDomainEventService: 2 hours
- PersonalFileService: 2 hours
- Tests: 2 hours
- **Total: ~8 hours**
