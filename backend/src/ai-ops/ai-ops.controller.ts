/**
 * AI Ops Controller (Secure API)
 */

import { Request, Response } from 'express';
import { aiOpsService } from './ai-ops.service';
import { logger } from '../config/logger';

export class AIOpsController {

    /**
     * GET /api/ai-ops/:entityType/:id/analyze
     */
    analyze = async (req: Request, res: Response) => {
        const { entityType, id } = req.params;

        try {
            const result = await aiOpsService.analyzeEntity(entityType, id);
            return res.send(result);
        } catch (error: any) {
            logger.error(`[AIOpsController] Error analyzing ${entityType}/${id}`, error);
            if (error.message.includes('not found')) {
                return res.status(404).send({ error: error.message });
            }
            if (error.message.includes('Security')) {
                return res.status(403).send({ error: error.message });
            }
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    }
}

export const aiOpsController = new AIOpsController();
