import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { TaskStatus } from '../dto/common/common.enums';

const taskService = new TaskService();

export class TaskController {
    async create(req: Request, res: Response) {
        try {
            const userId = (req.user as any).id;
            const task = await taskService.createTask(req.body, userId);
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await taskService.getTasks(req.query);

            // If result is already paginated, return as is
            if (result && typeof result === 'object' && 'data' in result) {
                return res.json(result);
            }

            // Otherwise, wrap in pagination format
            const tasks = Array.isArray(result) ? result : [];
            res.json({
                data: tasks,
                total: tasks.length,
                page,
                limit
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const task = await taskService.getTaskById(req.params.id);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const task = await taskService.updateTask(req.params.id, req.body);
            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { status } = req.body;
            if (!Object.values(TaskStatus).includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }
            const task = await taskService.updateStatus(req.params.id, status);
            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async assign(req: Request, res: Response) {
        try {
            const { assigneeId } = req.body;
            if (!assigneeId) {
                return res.status(400).json({ message: 'Assignee ID is required' });
            }
            const task = await taskService.assignTask(req.params.id, assigneeId);
            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
