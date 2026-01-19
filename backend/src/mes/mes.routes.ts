import { Router } from 'express';
import passport from 'passport';
import { mesController } from './controllers/mes.controller';
import { requireRoles } from '../middleware/roles.middleware';
import { UserRole } from '../dto/common/common.enums';

const router = Router();

router.use(passport.authenticate('jwt', { session: false }));

const requireProductionWrite = requireRoles(UserRole.ADMIN, UserRole.MANAGER, UserRole.PRODUCTION_MANAGER);

router.post('/production-orders', requireProductionWrite, mesController.createProductionOrder);
router.get('/production-orders', mesController.getProductionOrders);
router.get('/production-orders/:id', mesController.getProductionOrder);

router.post('/quality-checks', requireProductionWrite, mesController.createQualityCheck);
router.post('/defects', requireProductionWrite, mesController.createDefect);

export const mesRouter = router;
export default router;
