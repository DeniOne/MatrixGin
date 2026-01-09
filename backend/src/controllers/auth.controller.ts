import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterRequestDto, LoginRequestDto } from '../dto/auth/auth.dto';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const dto: RegisterRequestDto = req.body;
            const result = await authService.register(dto);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const dto: LoginRequestDto = req.body;
            const result = await authService.login(dto);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }

    async me(req: Request, res: Response) {
        // User is attached to req.user by passport middleware
        res.json(req.user);
    }
}
