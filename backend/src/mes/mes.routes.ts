import { Router } from 'express';
import passport from 'passport';
import { mesController } from './controllers/mes.controller';

const router = Router();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/production-orders', mesController.createProductionOrder);
router.get('/production-orders', mesController.getProductionOrders);
router.get('/production-orders/:id', mesController.getProductionOrder);

router.post('/quality-checks', mesController.createQualityCheck);
router.post('/defects', mesController.createDefect);

export const mesRouter = router;
export default router;
