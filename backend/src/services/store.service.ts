import { Product, Purchase, TransactionType, Currency } from '@prisma/client';

import { prisma } from '../config/prisma';

export class StoreService {
    async getProducts(activeOnly: boolean = true): Promise<Product[]> {
        return prisma.product.findMany({
            where: activeOnly ? { is_active: true } : {},
            orderBy: { created_at: 'desc' }
        });
    }

    async getProduct(id: string): Promise<Product | null> {
        return prisma.product.findUnique({ where: { id } });
    }

    async purchaseProduct(userId: string, productId: string): Promise<Purchase> {
        return prisma.$transaction(async (tx) => {
            // 1. Get product
            const product = await tx.product.findUnique({ where: { id: productId } });
            if (!product) throw new Error('Product not found');
            if (!product.is_active) throw new Error('Product is not active');
            if (product.stock <= 0) throw new Error('Product is out of stock');

            // 2. Get wallet
            const wallet = await tx.wallet.findUnique({ where: { user_id: userId } });
            if (!wallet) throw new Error('Wallet not found');

            if (wallet.mc_balance.lessThan(product.price)) {
                throw new Error('Insufficient funds');
            }

            // 3. Deduct balance
            await tx.wallet.update({
                where: { user_id: userId },
                data: { mc_balance: { decrement: product.price } }
            });

            // 4. Create transaction record
            await tx.transaction.create({
                data: {
                    type: TransactionType.STORE_PURCHASE,
                    currency: Currency.MC,
                    amount: product.price,
                    sender_id: userId,
                    description: `Purchase of ${product.name}`,
                    metadata: { productId: product.id, productName: product.name }
                }
            });

            // 5. Decrement stock
            await tx.product.update({
                where: { id: productId },
                data: { stock: { decrement: 1 } }
            });

            // 6. Create purchase record
            const purchase = await tx.purchase.create({
                data: {
                    user_id: userId,
                    product_id: productId,
                    price_paid: product.price,
                    status: 'COMPLETED'
                }
            });

            return purchase;
        });
    }
}

export default new StoreService();

