import { Employee, User } from '@prisma/client';
import { CreateEmployeeRequestDto, UpdateEmployeeRequestDto, EmployeeResponseDto, UpdateEmotionalToneDto } from '../dto/employees/employee.dto';
import { EmployeeStatus, EmployeeRank, UserRole, UserStatus } from '../dto/common/common.enums';
import { prisma } from '../config/prisma';

export class EmployeeService {
    async createEmployee(dto: CreateEmployeeRequestDto): Promise<EmployeeResponseDto> {
        // Verify user exists
        const user = await prisma.user.findUnique({ where: { id: dto.userId } });
        if (!user) {
            throw new Error('User not found');
        }

        // Verify department exists
        const department = await prisma.department.findUnique({ where: { id: dto.departmentId } });
        if (!department) {
            throw new Error('Department not found');
        }

        // Check if user is already an employee
        const existingEmployee = await prisma.employee.findUnique({ where: { user_id: dto.userId } });
        if (existingEmployee) {
            throw new Error('User is already an employee');
        }

        const employee = await prisma.employee.create({
            data: {
                user_id: dto.userId,
                department_id: dto.departmentId,
                position: dto.position,
                salary: dto.salary,
                employee_number: dto.employeeNumber,
                status: (dto.status as any) || EmployeeStatus.PHOTON,
                rank: (dto.rank as any) || EmployeeRank.COLLECTOR,
                hired_at: new Date(dto.hireDate),
            },
            include: {
                user: true,
                department: true
            }
        });

        return this.mapToResponse(employee);
    }

    async getEmployeeById(id: string): Promise<EmployeeResponseDto | null> {
        const employee = await prisma.employee.findUnique({
            where: { id },
            include: {
                user: true,
                department: true
            }
        });

        return employee ? this.mapToResponse(employee) : null;
    }

    async updateEmployee(id: string, dto: UpdateEmployeeRequestDto): Promise<EmployeeResponseDto> {
        const employee = await prisma.employee.update({
            where: { id },
            data: {
                department_id: dto.departmentId,
                position: dto.position,
                salary: dto.salary,
                status: dto.status as any,
                rank: dto.rank as any,
            },
            include: {
                user: true,
                department: true
            }
        });

        return this.mapToResponse(employee);
    }

    async updateEmotionalTone(id: string, tone: number): Promise<EmployeeResponseDto> {
        const employee = await prisma.employee.update({
            where: { id },
            data: { emotional_tone: tone },
            include: { user: true, department: true }
        });
        return this.mapToResponse(employee);
    }

    async promoteEmployee(id: string): Promise<EmployeeResponseDto> {
        const employee = await prisma.employee.findUnique({ where: { id } });
        if (!employee) throw new Error('Employee not found');

        const statusOrder = [
            EmployeeStatus.PHOTON,
            EmployeeStatus.TOPCHIK,
            EmployeeStatus.FLINT_CARBON,
            EmployeeStatus.STAR,
            EmployeeStatus.UNIVERSE
        ];

        const currentIndex = statusOrder.indexOf(employee.status as unknown as EmployeeStatus);
        if (currentIndex === -1 || currentIndex === statusOrder.length - 1) {
            throw new Error('Employee cannot be promoted further');
        }

        const newStatus = statusOrder[currentIndex + 1];
        const updatedEmployee = await prisma.employee.update({
            where: { id },
            data: { status: newStatus as any },
            include: { user: true, department: true }
        });

        return this.mapToResponse(updatedEmployee);
    }

    async demoteEmployee(id: string): Promise<EmployeeResponseDto> {
        const employee = await prisma.employee.findUnique({ where: { id } });
        if (!employee) throw new Error('Employee not found');

        const statusOrder = [
            EmployeeStatus.PHOTON,
            EmployeeStatus.TOPCHIK,
            EmployeeStatus.FLINT_CARBON,
            EmployeeStatus.STAR,
            EmployeeStatus.UNIVERSE
        ];

        const currentIndex = statusOrder.indexOf(employee.status as unknown as EmployeeStatus);
        if (currentIndex <= 0) {
            throw new Error('Employee cannot be demoted further');
        }

        const newStatus = statusOrder[currentIndex - 1];
        const updatedEmployee = await prisma.employee.update({
            where: { id },
            data: { status: newStatus as any },
            include: { user: true, department: true }
        });

        return this.mapToResponse(updatedEmployee);
    }

    private mapToResponse(emp: Employee & { user: User; department?: any }): EmployeeResponseDto {
        return {
            id: emp.id,
            userId: emp.user_id,
            departmentId: emp.department_id || '', // Should ideally not be null if created properly
            position: emp.position || '',
            employeeNumber: emp.employee_number || undefined,
            salary: emp.salary ? Number(emp.salary) : undefined,
            status: emp.status as unknown as EmployeeStatus,
            rank: emp.rank as unknown as EmployeeRank,
            hireDate: emp.hired_at.toISOString().split('T')[0],
            terminationDate: emp.termination_date?.toISOString().split('T')[0],
            emotionalTone: emp.emotional_tone as any,
            mcBalance: emp.mc_balance ? Number(emp.mc_balance) : 0,
            gmcBalance: emp.gmc_balance ? Number(emp.gmc_balance) : 0,
            createdAt: emp.created_at.toISOString(),
            updatedAt: emp.updated_at.toISOString(),
            user: {
                id: emp.user.id,
                email: emp.user.email,
                role: emp.user.role as unknown as UserRole,
                status: emp.user.status as unknown as UserStatus,
                firstName: emp.user.first_name,
                lastName: emp.user.last_name,
                middleName: emp.user.middle_name || undefined,
                phoneNumber: emp.user.phone_number || undefined,
                avatar: emp.user.avatar || undefined,
                departmentId: emp.user.department_id || undefined,
                lastLoginAt: emp.user.last_login_at?.toISOString(),
                createdAt: emp.user.created_at.toISOString(),
                updatedAt: emp.user.updated_at.toISOString(),
                personalDataConsent: emp.user.personal_data_consent,
            },
            department: emp.department ? {
                id: emp.department.id,
                name: emp.department.name,
                code: emp.department.code,
                description: emp.department.description,
                headId: emp.department.head_id,
                createdAt: emp.department.created_at.toISOString(),
                updatedAt: emp.department.updated_at.toISOString(),
            } : undefined
        };
    }
}
