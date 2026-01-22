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
    ) { }

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

        // Emit EMPLOYEE_HIRED event (FACT event, one-time only)
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
     * IMPORTANT: Emits STATE CHANGE events (NOT fact events like EMPLOYEE_HIRED)
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
            data: {
                hrStatus: newStatus,
                ...(newStatus === 'TERMINATED' && { closedAt: new Date() }),
            },
        });

        // CRITICAL: Emit STATE CHANGE event (not FACT event)
        // EMPLOYEE_HIRED is emitted ONLY in create()
        // EMPLOYEE_DISMISSED is emitted ONLY when status → TERMINATED
        let eventType: any;

        if (newStatus === 'TERMINATED') {
            eventType = 'EMPLOYEE_DISMISSED'; // FACT: dismissal happened
        } else if (newStatus === 'ARCHIVED') {
            eventType = 'FILE_ARCHIVED'; // FACT: file archived
        } else {
            // All other transitions = generic state change
            eventType = 'EMPLOYEE_TRANSFERRED'; // STATE CHANGE (generic)
        }

        await this.hrEventService.emit({
            eventType,
            aggregateType: 'PERSONAL_FILE',
            aggregateId: id,
            actorId,
            actorRole,
            payload: {
                from: personalFile.hrStatus,
                to: newStatus,
                reason,
            },
            previousState: { hrStatus: personalFile.hrStatus },
            newState: { hrStatus: newStatus },
        });

        return updated;
    }

    /**
     * Find PersonalFile by ID
     */
    async findById(id: string) {
        const personalFile = await this.prisma.personalFile.findUnique({
            where: { id },
            include: {
                employee: true,
                documents: true,
                orders: true,
                contracts: true,
            },
        });

        if (!personalFile) {
            throw new NotFoundException(`PersonalFile ${id} not found`);
        }

        return personalFile;
    }

    /**
     * Generate unique file number using DB sequence
     * CRITICAL: Race-condition safe (uses DB sequence, not count)
     */
    private async generateFileNumber(): Promise<string> {
        // Use DB sequence to avoid race conditions
        const year = new Date().getFullYear();

        // Get next sequence value from DB
        const result = await this.prisma.$queryRaw<[{ nextval: bigint }]>`
      SELECT nextval('personal_file_number_seq') as nextval
    `;

        const sequenceNumber = Number(result[0].nextval);
        return `PF-${year}-${String(sequenceNumber).padStart(5, '0')}`;
    }
}
