import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PersonalFileService } from '../services/personal-file.service';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * EmployeeHiredListener
 * 
 * CRITICAL: Listens to employee.hired event (NOT employee.created)
 * 
 * Reason: Employee ≠ Hired
 * - Employee can be created but not hired yet
 * - PersonalFile should only be created AFTER hire fact
 * 
 * Idempotency: Checks if PersonalFile already exists before creating
 */
@Injectable()
export class EmployeeHiredListener {
    constructor(
        private readonly personalFileService: PersonalFileService,
        private readonly prisma: PrismaService,
    ) { }

    @OnEvent('employee.hired') // ✅ HIRED, not CREATED
    async handleEmployeeHired(payload: EmployeeHiredEvent) {
        // Idempotency check
        const existing = await this.prisma.personalFile.findUnique({
            where: { employeeId: payload.employeeId },
        });

        if (existing) {
            console.log(`[EmployeeHiredListener] PersonalFile already exists for employee ${payload.employeeId}`);
            return; // Already created
        }

        // Create PersonalFile AFTER hire fact
        await this.personalFileService.create(
            payload.employeeId,
            payload.hiredBy || 'SYSTEM',
            payload.hiredByRole || 'HR_MANAGER'
        );

        console.log(`[EmployeeHiredListener] PersonalFile created for employee ${payload.employeeId}`);
    }
}

// Event payload interface
interface EmployeeHiredEvent {
    employeeId: string;
    hireDate: string;
    hiredBy?: string;
    hiredByRole?: string;
}
