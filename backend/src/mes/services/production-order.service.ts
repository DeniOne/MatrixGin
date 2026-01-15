import { prisma } from '../../config/prisma';
import { ProductionOrderStatus } from '@prisma/client';
import { CreateProductionOrderDto, UpdateProductionOrderStatusDto } from '../dto/mes.dto';

export class ProductionOrderService {

    async create(data: CreateProductionOrderDto, userId: string) {
        // 1. Log Audit (Pre-Action) - Optional, but canonical requires traceability.
        // We'll rely on the transaction or post-action logging.

        // 2. Create Order
        const order = await prisma.productionOrder.create({
            data: {
                source_type: data.source_type,
                source_ref_id: data.source_ref_id,
                product_type: data.product_type,
                quantity: data.quantity,
                created_by_id: userId,
                status: ProductionOrderStatus.DRAFT,
            }
        });

        // 3. Log Audit
        await prisma.auditLog.create({
            data: {
                action: 'MES_ORDER_CREATE',
                entity_type: 'ProductionOrder',
                entity_id: order.id,
                user_id: userId,
                details: { ...data }
            }
        });

        return order;
    }

    async getOne(id: string) {
        return prisma.productionOrder.findUnique({
            where: { id },
            include: {
                work_orders: { orderBy: { sequence_order: 'asc' } },
                quality_checks: true,
                defects: true
            }
        });
    }

    async getAll() {
        return prisma.productionOrder.findMany({
            orderBy: { created_at: 'desc' }
        });
    }

    async updateStatus(id: string, status: ProductionOrderStatus, userId: string) {
        // 1. Fetch current
        const order = await prisma.productionOrder.findUnique({ where: { id } });
        if (!order) throw new Error('Order not found');

        // 2. Transition Logic (Simple FSM for now)
        // TODO: Add stricter FSM if needed.

        const updated = await prisma.productionOrder.update({
            where: { id },
            data: {
                status,
                closed_at: (status === ProductionOrderStatus.COMPLETED || status === ProductionOrderStatus.CANCELLED) ? new Date() : null
            }
        });

        // 3. Log Audit
        await prisma.auditLog.create({
            data: {
                action: 'MES_ORDER_STATUS_CHANGE',
                entity_type: 'ProductionOrder',
                entity_id: id,
                user_id: userId,
                details: { from: order.status, to: status }
            }
        });

        return updated;
    }
}

export const productionOrderService = new ProductionOrderService();
