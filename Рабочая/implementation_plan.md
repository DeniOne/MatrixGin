# Implementation Plan: Module 33 Sprint 1 — Database Layer

**Goal:** Implement foundational database models for Personnel-HR-Records with event-sourcing layer.

---

## User Review Required

> [!WARNING]
> **Breaking Changes:**
> - New tables will be added to production database
> - `HRDomainEvent` table is **append-only** (NO UPDATE/DELETE constraints)
> - Adds FK constraints to existing `Employee` table

> [!IMPORTANT]
> **Critical Design Decisions:**
> 1. **Event-Sourcing is mandatory** — all juridical actions emit immutable events
> 2. **HRStatus ≠ Employee.status** — separate FSM for HR lifecycle
> 3. **AI access forbidden** — personnel data excluded from AI Core access
> 4. **Human-only actions** — no automatic signing/termination

---

## Proposed Changes

### Database Models (Prisma)

#### [NEW] [backend/prisma/schema.prisma](file:///f:/Matrix_Gin/backend/prisma/schema.prisma) — Module 33 Models

**1. HRDomainEvent (CRITICAL — Event-Sourcing)**
```prisma
model HRDomainEvent {
  id              String   @id @default(uuid())
  eventType       HREventType
  aggregateType   HRAggregateType
  aggregateId     String
  
  actorId         String
  actorRole       String
  
  payload         Json
  previousState   Json?
  newState        Json?
  legalBasis      String?
  
  occurredAt      DateTime @default(now())
  
  @@index([aggregateId, eventType])
  @@index([occurredAt])
  @@map("hr_domain_events")
}

enum HREventType {
  EMPLOYEE_HIRED
  EMPLOYEE_TRANSFERRED
  EMPLOYEE_PROMOTED
  EMPLOYEE_DEMOTED
  EMPLOYEE_SUSPENDED
  EMPLOYEE_DISMISSED
  DOCUMENT_UPLOADED
  DOCUMENT_VERIFIED
  DOCUMENT_EXPIRED
  ORDER_CREATED
  ORDER_SIGNED
  ORDER_CANCELLED
  CONTRACT_SIGNED
  CONTRACT_AMENDED
  CONTRACT_TERMINATED
  FILE_ARCHIVED
}

enum HRAggregateType {
  PERSONAL_FILE
  PERSONNEL_ORDER
  LABOR_CONTRACT
  PERSONNEL_DOCUMENT
}
```

**2. PersonalFile**
```prisma
model PersonalFile {
  id            String   @id @default(uuid())
  employeeId    String   @unique
  employee      Employee @relation(fields: [employeeId], references: [id])
  
  fileNumber    String   @unique
  hrStatus      HRStatus @default(ONBOARDING)
  
  createdAt     DateTime @default(now())
  closedAt      DateTime?
  archivedAt    DateTime?
  archiveId     String?
  
  documents     PersonnelDocument[]
  orders        PersonnelOrder[]
  contracts     LaborContract[]
  
  @@map("personal_files")
}

enum HRStatus {
  ONBOARDING
  PROBATION
  EMPLOYED
  SUSPENDED
  LEAVE
  TERMINATED
  ARCHIVED
}
```

**3. PersonnelDocument**
```prisma
model PersonnelDocument {
  id              String   @id @default(uuid())
  personalFileId  String
  personalFile    PersonalFile @relation(fields: [personalFileId], references: [id])
  
  documentType    PersonnelDocumentType
  title           String
  description     String?
  
  fileId          String
  fileName        String
  fileSize        Int
  mimeType        String
  
  issueDate       DateTime?
  expiryDate      DateTime?
  issuer          String?
  documentNumber  String?
  
  uploadedById    String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  version         Int      @default(1)
  previousVersionId String?
  
  @@map("personnel_documents")
}

enum PersonnelDocumentType {
  PASSPORT
  SNILS
  INN
  EDUCATION_DIPLOMA
  MILITARY_ID
  WORK_BOOK
  PHOTO
  MEDICAL_BOOK
  DRIVING_LICENSE
  CERTIFICATE
  REFERENCE_LETTER
  NDA
  PD_CONSENT
  JOB_DESCRIPTION
  OTHER
}
```

**4. PersonnelOrder**
```prisma
model PersonnelOrder {
  id              String   @id @default(uuid())
  personalFileId  String
  personalFile    PersonalFile @relation(fields: [personalFileId], references: [id])
  
  orderType       PersonnelOrderType
  orderNumber     String   @unique
  orderDate       DateTime
  effectiveDate   DateTime
  
  title           String
  content         String
  basis           String?
  
  fileId          String?
  
  signedById      String?
  signedAt        DateTime?
  
  status          OrderStatus @default(DRAFT)
  
  createdById     String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  retentionYears  Int      @default(75)
  
  @@map("personnel_orders")
}

enum PersonnelOrderType {
  HIRING
  TRANSFER
  VACATION
  VACATION_CANCEL
  BUSINESS_TRIP
  BONUS
  SALARY_CHANGE
  DISCIPLINARY
  DISCIPLINARY_REMOVE
  DISMISSAL
  POSITION_CHANGE
  SCHEDULE_CHANGE
  LEAVE_WITHOUT_PAY
  MATERNITY_LEAVE
  PARENTAL_LEAVE
}

enum OrderStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  SIGNED
  CANCELLED
}
```

**5. LaborContract**
```prisma
model LaborContract {
  id              String   @id @default(uuid())
  personalFileId  String
  personalFile    PersonalFile @relation(fields: [personalFileId], references: [id])
  
  contractNumber  String   @unique
  contractDate    DateTime
  startDate       DateTime
  endDate         DateTime?
  contractType    ContractType
  
  positionId      String
  departmentId    String
  salary          Decimal  @db.Decimal(12, 2)
  salaryType      SalaryType @default(MONTHLY)
  workSchedule    String
  probationDays   Int      @default(0)
  
  fileId          String?
  
  status          ContractStatus @default(ACTIVE)
  terminationDate DateTime?
  terminationReason String?
  
  amendments      ContractAmendment[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("labor_contracts")
}

enum ContractType {
  PERMANENT
  FIXED_TERM
  PART_TIME
  CIVIL
  INTERNSHIP
}

enum ContractStatus {
  ACTIVE
  SUSPENDED
  TERMINATED
}

enum SalaryType {
  MONTHLY
  HOURLY
  PIECEWORK
}
```

**6. ContractAmendment**
```prisma
model ContractAmendment {
  id              String   @id @default(uuid())
  contractId      String
  contract        LaborContract @relation(fields: [contractId], references: [id])
  
  amendmentNumber Int
  amendmentDate   DateTime
  effectiveDate   DateTime
  
  changes         Json
  fileId          String?
  
  createdAt       DateTime @default(now())
  
  @@map("contract_amendments")
}
```

**7. DocumentTemplate**
```prisma
model DocumentTemplate {
  id              String   @id @default(uuid())
  templateType    TemplateType
  name            String
  description     String?
  content         String
  variables       Json
  isActive        Boolean  @default(true)
  version         Int      @default(1)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("document_templates")
}

enum TemplateType {
  LABOR_CONTRACT
  ORDER_HIRING
  ORDER_DISMISSAL
  ORDER_VACATION
  ORDER_TRANSFER
  CERTIFICATE_WORK
  NDA
  PD_CONSENT
}
```

---

### Migrations

#### [NEW] `backend/prisma/migrations/XXX_create_personnel_module/migration.sql`

- Create all Module 33 tables
- Add FK constraints to `Employee`
- Add indexes for performance
- **Add constraint: NO UPDATE/DELETE on `hr_domain_events`**

#### [NEW] `backend/prisma/seed-personnel.ts`

- Seed basic document templates (NDA, PD_CONSENT, LABOR_CONTRACT)
- Seed test PersonalFile for existing employees (dev only)

---

## Verification Plan

### Automated Tests

**1. Migration Test**
```bash
# Run from backend directory
npx prisma migrate dev --name create_personnel_module
npx prisma generate
```
**Expected:** Migration succeeds, all tables created

**2. Seed Test**
```bash
npm run seed:personnel
```
**Expected:** Templates created successfully

**3. Event Immutability Test**
```typescript
// backend/src/modules/personnel/__tests__/hr-event.immutability.test.ts
describe('HRDomainEvent Immutability', () => {
  it('should prevent UPDATE on hr_domain_events', async () => {
    const event = await prisma.hRDomainEvent.create({...});
    await expect(
      prisma.hRDomainEvent.update({ where: { id: event.id }, data: {...} })
    ).rejects.toThrow(); // Should fail due to DB constraint
  });
  
  it('should prevent DELETE on hr_domain_events', async () => {
    const event = await prisma.hRDomainEvent.create({...});
    await expect(
      prisma.hRDomainEvent.delete({ where: { id: event.id } })
    ).rejects.toThrow(); // Should fail due to DB constraint
  });
});
```

**Run:** `npm test -- hr-event.immutability.test.ts`

**4. HRStatus FSM Test**
```typescript
// backend/src/modules/personnel/__tests__/hr-status.fsm.test.ts
describe('HRStatus FSM Transitions', () => {
  it('should allow ONBOARDING → EMPLOYED', async () => {
    // Valid transition
  });
  
  it('should prevent EMPLOYED → ONBOARDING', async () => {
    // Invalid transition, should throw
  });
});
```

**Run:** `npm test -- hr-status.fsm.test.ts`

### Manual Verification

**1. Check Database Schema**
```bash
npx prisma studio
```
- Open `hr_domain_events` table
- Verify columns: `eventType`, `aggregateId`, `actorId`, `occurredAt`
- Verify indexes exist

**2. Check Employee Relation**
```sql
SELECT * FROM personal_files 
JOIN employees ON personal_files.employee_id = employees.id 
LIMIT 5;
```
**Expected:** FK relationship works

---

## Rollback Plan

If migration fails:
```bash
npx prisma migrate resolve --rolled-back XXX_create_personnel_module
```

---

## Estimated Effort

- Prisma models: 2 hours
- Migration + constraints: 1 hour
- Seed data: 30 min
- Tests: 2 hours
- **Total: ~6 hours**
