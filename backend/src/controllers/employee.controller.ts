import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';

const employeeService = new EmployeeService();

export class EmployeeController {
    async create(req: Request, res: Response) {
        try {
            const employee = await employeeService.createEmployee(req.body);
            res.status(201).json(employee);
        } catch (error: any) {
            if (error.message === 'User not found' || error.message === 'Department not found') {
                return res.status(404).json({ message: error.message });
            }
            if (error.message === 'User is already an employee') {
                return res.status(409).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const employee = await employeeService.getEmployeeById(req.params.id);
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            res.json(employee);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const employee = await employeeService.updateEmployee(req.params.id, req.body);
            res.json(employee);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateEmotionalTone(req: Request, res: Response) {
        try {
            const { tone } = req.body;
            if (tone === undefined || tone < 0 || tone > 4) {
                return res.status(400).json({ message: 'Invalid emotional tone value (0-4)' });
            }
            const employee = await employeeService.updateEmotionalTone(req.params.id, tone);
            res.json(employee);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async promote(req: Request, res: Response) {
        try {
            const employee = await employeeService.promoteEmployee(req.params.id);
            res.json(employee);
        } catch (error: any) {
            if (error.message === 'Employee cannot be promoted further') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async demote(req: Request, res: Response) {
        try {
            const employee = await employeeService.demoteEmployee(req.params.id);
            res.json(employee);
        } catch (error: any) {
            if (error.message === 'Employee cannot be demoted further') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
