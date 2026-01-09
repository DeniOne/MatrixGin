import { Request, Response } from 'express';
import storeService from '../services/store.service';

export class StoreController {
    async getProducts(req: Request, res: Response) {
        try {
            const products = await storeService.getProducts();
            res.json(products);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async purchaseProduct(req: Request, res: Response) {
        try {
            const userId = (req.user as any).id;
            const productId = req.params.id;
            const purchase = await storeService.purchaseProduct(userId, productId);
            res.status(201).json(purchase);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
