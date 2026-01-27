import { Request, Response } from 'express';
import { foundationService } from '../services/foundation.service';
import { prisma } from '../config/prisma';
import { FOUNDATION_VERSION } from '../config/foundation.constants';
import { logger } from '../config/logger';

export class FoundationController {
    /**
     * GET /api/foundation/status
     */
    async getStatus(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const state = await foundationService.getImmersionState(userId);
            logger.info('Foundation status requested', { userId, status: state.status, blocksCount: state.blocks.length });
            res.json(state);
        } catch (error: any) {
            logger.error('Failed to get foundation status', { error: error.message });
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * POST /api/foundation/block-viewed
     */
    async markBlockViewed(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { blockId } = req.body;

            if (!blockId) {
                return res.status(400).json({ error: 'blockId is required' });
            }

            await foundationService.registerBlockView(userId, blockId);
            res.json({ success: true });
        } catch (error: any) {
            logger.error('Failed to mark block as viewed', { error: error.message });
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * POST /api/foundation/decision
     */
    async submitDecision(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { decision } = req.body;

            if (!decision || !['ACCEPT', 'DECLINE'].includes(decision)) {
                return res.status(400).json({ error: 'Valid decision (ACCEPT/DECLINE) is required' });
            }

            // Create acceptance record
            await prisma.foundationAcceptance.upsert({
                where: { person_id: userId },
                create: {
                    person_id: userId,
                    decision: decision === 'ACCEPT' ? 'ACCEPTED' : 'NOT_ACCEPTED',
                    version: FOUNDATION_VERSION,
                    accepted_at: new Date()
                },
                update: {
                    decision: decision === 'ACCEPT' ? 'ACCEPTED' : 'NOT_ACCEPTED',
                    version: FOUNDATION_VERSION,
                    accepted_at: new Date()
                }
            });

            // Sync User status
            // @ts-ignore
            await prisma.user.update({
                where: { id: userId },
                data: {
                    // @ts-ignore
                    foundation_status: decision === 'ACCEPT' ? 'ACCEPTED' : 'IN_PROGRESS'
                }
            });

            // Audit log
            await prisma.foundationAuditLog.create({
                data: {
                    user_id: userId,
                    event_type: decision === 'ACCEPT' ? 'FOUNDATION_ACCEPTED' : 'FOUNDATION_DECLINED',
                    foundation_version: FOUNDATION_VERSION,
                    timestamp: new Date(),
                    metadata: {
                        userAgent: req.get('User-Agent')
                    }
                }
            });

            res.json({ success: true });
        } catch (error: any) {
            logger.error('Failed to submit foundation decision', { error: error.message });
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export const foundationController = new FoundationController();
