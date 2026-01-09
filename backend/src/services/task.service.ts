import { Task, TaskComment, TaskAttachment, User } from '@prisma/client';
import { CreateTaskRequestDto, UpdateTaskRequestDto, TaskResponseDto, TaskCommentResponseDto, TaskFiltersDto } from '../dto/tasks/task.dto';
import { TaskStatus, TaskPriority } from '../dto/common/common.enums';
import { prisma } from '../config/prisma';

export class TaskService {
    async createTask(dto: CreateTaskRequestDto, creatorId: string): Promise<TaskResponseDto> {
        const task = await prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                creator_id: creatorId,
                assignee_id: dto.assigneeId,
                department_id: dto.departmentId,
                priority: (dto.priority as any) || TaskPriority.MEDIUM,
                due_date: dto.dueDate ? new Date(dto.dueDate) : null,
                tags: dto.tags || [],
            },
            include: {
                creator: true,
                assignee: true,
                department: true
            }
        });

        return this.mapToResponse(task);
    }

    async getTaskById(id: string): Promise<TaskResponseDto | null> {
        const task = await prisma.task.findUnique({
            where: { id },
            include: {
                creator: true,
                assignee: true,
                department: true
            }
        });

        return task ? this.mapToResponse(task) : null;
    }

    async updateTask(id: string, dto: UpdateTaskRequestDto): Promise<TaskResponseDto> {
        const task = await prisma.task.update({
            where: { id },
            data: {
                title: dto.title,
                description: dto.description,
                assignee_id: dto.assigneeId,
                status: dto.status as any,
                priority: dto.priority as any,
                due_date: dto.dueDate ? new Date(dto.dueDate) : undefined,
            },
            include: {
                creator: true,
                assignee: true,
                department: true
            }
        });

        return this.mapToResponse(task);
    }

    async updateStatus(id: string, status: TaskStatus): Promise<TaskResponseDto> {
        const task = await prisma.task.update({
            where: { id },
            data: {
                status: status as any,
                completed_at: status === TaskStatus.DONE ? new Date() : null
            },
            include: {
                creator: true,
                assignee: true,
                department: true
            }
        });

        return this.mapToResponse(task);
    }

    async assignTask(id: string, assigneeId: string): Promise<TaskResponseDto> {
        const task = await prisma.task.update({
            where: { id },
            data: { assignee_id: assigneeId },
            include: {
                creator: true,
                assignee: true,
                department: true
            }
        });

        return this.mapToResponse(task);
    }

    async getTasks(filters: TaskFiltersDto): Promise<TaskResponseDto[]> {
        const where: any = {};

        if (filters.status) where.status = filters.status as any;
        if (filters.assigneeId) where.assignee_id = filters.assigneeId;
        if (filters.departmentId) where.department_id = filters.departmentId;
        if (filters.priority) where.priority = filters.priority as any;
        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
            ];
        }

        const tasks = await prisma.task.findMany({
            where,
            include: {
                creator: true,
                assignee: true,
                department: true
            },
            orderBy: { created_at: 'desc' }
        });

        return tasks.map(this.mapToResponse);
    }

    private mapToResponse(task: Task & { creator: User; assignee?: User | null; department?: any }): TaskResponseDto {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status as unknown as TaskStatus,
            priority: task.priority as unknown as TaskPriority,
            creatorId: task.creator_id,
            assigneeId: task.assignee_id || undefined,
            departmentId: task.department_id || undefined,
            dueDate: task.due_date?.toISOString(),
            completedAt: task.completed_at?.toISOString(),
            tags: task.tags,
            mcReward: task.mc_reward ? Number(task.mc_reward) : undefined,
            createdAt: task.created_at.toISOString(),
            updatedAt: task.updated_at.toISOString()
        };
    }
}
