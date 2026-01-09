import { Router } from 'express';
import { StoreController } from '../controllers/store.controller';
import passport from 'passport';

const router = Router();
const storeController = new StoreController();

router.get('/products', passport.authenticate('jwt', { session: false }), (req, res) => storeController.getProducts(req, res));
router.post('/purchase/:id', passport.authenticate('jwt', { session: false }), (req, res) => storeController.purchaseProduct(req, res));

export default router;
