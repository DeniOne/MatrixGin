import { Request, Response } from 'express';
import { productionOrderService } from '../services/production-order.service';
import { qualityService } from '../services/quality.service';
import { defectService } from '../services/defect.service';
import { CreateProductionOrderDto, CreateQualityCheckDto, CreateDefectDto } from '../dto/mes.dto';

export class MesController {

    async createProductionOrder(req: Request, res: Response) {
        try {
            const user = req.user as any;
            const dto = req.body as CreateProductionOrderDto;
            const order = await productionOrderService.create(dto, user.id);
            res.status(201).json(order);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getProductionOrders(req: Request, res: Response) {
        try {
            const orders = await productionOrderService.getAll();
            res.json(orders);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getProductionOrder(req: Request, res: Response) {
        try {
            const order = await productionOrderService.getOne(req.params.id);
            if (!order) return res.status(404).json({ message: 'Order not found' });
            res.json(order);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async createQualityCheck(req: Request, res: Response) {
        try {
            const user = req.user as any;
            const dto = req.body as CreateQualityCheckDto;
            const check = await qualityService.registerCheck(dto, user.id);
            res.status(201).json(check);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async createDefect(req: Request, res: Response) {
        try {
            const user = req.user as any;
            const dto = req.body as CreateDefectDto;
            const defect = await defectService.registerDefect(dto, user.id);
            res.status(201).json(defect);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // ==========================================
    // MOTIVATIONAL ORGANISM ENDPOINTS (Sprint 5-6)
    // ==========================================

    /**
     * GET /api/mes/my-shift
     * Get current employee's shift progress
     */
    async getMyShift(req: Request, res: Response) {
        try {
            const user = req.user as any;
            // TODO: Integrate with PSEE to get real data
            // For now, return demo data
            const shiftProgress = {
                employeeId: user.id,
                shiftDate: new Date().toISOString().split('T')[0],
                companiesCreated: 18,
                retouchReady: 12,
                retouchPending: 4,
                retouchWaiting: 2,
                companiesSold: 9,
                companiesRejected: 3,
                conversion: 75, // %
                averageValue: 1350, // in rubles
                forecastEarnings: 5800 // in rubles
            };
            res.json(shiftProgress);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * GET /api/mes/earnings-forecast
     * Calculate earnings forecast based on current shift metrics
     */
    async getMyEarningsForecast(req: Request, res: Response) {
        try {
            const user = req.user as any;
            // TODO: Integrate with PSEE and motivation rules
            // For now, return demo calculation
            const forecast = {
                employeeId: user.id,
                baseSalary: 2500,
                okkBonus: 1610, // companiesCreated * ratePerCompany
                ckBonus: 0, // averageValue bonus (below threshold)
                mcEquivalent: 340, // MC value in rubles
                totalCurrent: 4450,
                // Projection if +3 companies and +20 averageValue
                projectedTotal: 6200,
                projectedIncrease: 39, // %
                breakdown: {
                    companiesCreated: 23,
                    ratePerCompany: 70,
                    averageValue: 1180,
                    averageValueThreshold: 1200,
                    mcBalance: 34
                }
            };
            res.json(forecast);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const mesController = new MesController();
