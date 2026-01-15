/**
 * AI Ops Routes
 */

import { Router } from 'express';
import { aiOpsController } from './ai-ops.controller';
import passport from 'passport';

const router = Router();

// GET /api/ai-ops/:entityType/:id/analyze
router.get(
    '/:entityType/:id/analyze',
    passport.authenticate('jwt', { session: false }),
    aiOpsController.analyze
);

export default router;
