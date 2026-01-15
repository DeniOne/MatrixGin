import { Request, Response } from 'express';
import { EntityService } from '../services/entity.service';
import {
    isValidEntityType, EntityType
} from '../dto/domain';
import {
    CreateRegistryEntitySchema, UpdateRegistryEntitySchema, LifecycleTransitionSchema
} from '../dto/registry.dto';
import { logger } from '../utils/logger';

export class RegistryController {

    // Generic handler helper to get service instance
    private getService(req: Request): EntityService {
        const type = req.params.type as string;
        if (!isValidEntityType(type)) {
            throw { status: 400, message: `Invalid entity type: ${type}` };
        }
        return new EntityService(type);
    }

    // GET /api/v1/registry/:type
    list = async (req: Request, res: Response) => {
        try {
            const service = this.getService(req);
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await service.list(page, limit);
            res.json(result);
        } catch (err: any) {
            this.handleError(res, err);
        }
    };

    // GET /api/v1/registry/:type/:id
    getById = async (req: Request, res: Response) => {
        try {
            const service = this.getService(req);
            const result = await service.getById(req.params.id as string);
            if (!result) {
                return res.status(404).json({ error: 'Entity not found' });
            }
            res.json(result);
        } catch (err: any) {
            this.handleError(res, err);
        }
    };

    // POST /api/v1/registry/:type
    create = async (req: Request, res: Response) => {
        try {
            const service = this.getService(req);
            // Validate Payload
            const payload = CreateRegistryEntitySchema.parse(req.body);

            // Determine Actor (Mocking auth for now, in real app extract from JWT)
            const actorId = 'test-user-uuid'; // TODO: Middleware integration

            const result = await service.create(payload, actorId);
            res.status(201).json(result);
        } catch (err: any) {
            this.handleError(res, err);
        }
    };

    // PATCH /api/v1/registry/:type/:id
    update = async (req: Request, res: Response) => {
        try {
            const service = this.getService(req);
            // Check for code update attempt
            if (req.body.code) {
                return res.status(400).json({ error: 'Code is immutable' });
            }

            const payload = UpdateRegistryEntitySchema.parse(req.body);
            const actorId = 'test-user-uuid'; // TODO: Middleware

            const result = await service.update(req.params.id as string, payload, actorId);
            res.json(result);
        } catch (err: any) {
            this.handleError(res, err);
        }
    };

    // POST /api/v1/registry/:type/:id/lifecycle
    lifecycle = async (req: Request, res: Response) => {
        try {
            const service = this.getService(req);
            const payload = LifecycleTransitionSchema.parse(req.body);
            const actorId = 'test-user-uuid'; // TODO: Middleware

            const result = await service.transition(req.params.id as string, payload, actorId);
            res.json(result);
        } catch (err: any) {
            this.handleError(res, err);
        }
    };

    // GET /api/v1/registry/:type/:id/audit
    audit = async (req: Request, res: Response) => {
        try {
            const service = this.getService(req);
            const history = await service.getAuditHistory(req.params.id as string);
            res.json(history);
        } catch (err: any) {
            this.handleError(res, err);
        }
    }

    private handleError(res: Response, err: any) {
        logger.error('API Error', err);

        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        if (err.name === 'ZodError') {
            return res.status(400).json({ error: 'Validation Error', details: err.errors });
        }
        if (err.message && err.message.includes('not found')) {
            return res.status(404).json({ error: err.message });
        }
        if (err.message && err.message.includes('Conflict')) {
            return res.status(409).json({ error: err.message });
        }
        if (err.message && err.message.includes('already exists')) {
            return res.status(409).json({ error: err.message });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
}
