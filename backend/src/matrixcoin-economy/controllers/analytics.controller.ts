/**
 * Economy Analytics Controller
 * PHASE 4 — Analytics, Observability & Governance
 */

import { Controller, Get, Param, Headers, ForbiddenException, BadRequestException } from '@nestjs/common';
import { EconomyAnalyticsService } from '../services/analytics.service';

@Controller('api/economy/analytics')
export class EconomyAnalyticsController {
    constructor(private readonly analyticsService: EconomyAnalyticsService) { }

    /**
     * GET /api/economy/analytics/overview
     * Глобальные показатели системы. Доступно ролям MANAGER, EXECUTIVE (ADMIN).
     */
    @Get('overview')
    async getOverview(@Headers('X-User-Role') role: string) {
        this.checkRole(role, ['ADMIN', 'HR_MANAGER', 'BRANCH_MANAGER']);
        return this.analyticsService.getGlobalOverview();
    }

    /**
     * GET /api/economy/analytics/store
     * Статистика востребованности магазина. Доступно всем.
     */
    @Get('store')
    async getStoreActivity() {
        return this.analyticsService.getStoreActivity();
    }

    /**
     * GET /api/economy/analytics/wallet/my
     * Персональный тренд и баланс.
     */
    @Get('wallet/my')
    async getMyTrend(@Headers('X-User-Id') userId: string) {
        if (!userId) throw new BadRequestException('User-Id header missing');
        return this.analyticsService.getUserWalletTrend(userId);
    }

    /**
     * GET /api/economy/analytics/wallet/:userId
     * Просмотр аудита сотрудника. Доступно HEAD_OF_DEPT (DEPARTMENT_HEAD).
     */
    @Get('wallet/:userId')
    async getUserTrend(
        @Param('userId') targetUserId: string,
        @Headers('X-User-Role') role: string
    ) {
        this.checkRole(role, ['ADMIN', 'DEPARTMENT_HEAD']);
        return this.analyticsService.getUserWalletTrend(targetUserId);
    }

    /**
     * GET /api/economy/analytics/audit
     * Журнал аудита. Для админов - весь, для юзеров - свой.
     */
    @Get('audit')
    async getAudit(
        @Headers('X-User-Id') userId: string,
        @Headers('X-User-Role') role: string
    ) {
        if (role === 'ADMIN') {
            return this.analyticsService.getAuditTrail();
        }
        if (!userId) throw new BadRequestException('User-Id header missing');
        return this.analyticsService.getAuditTrail(userId);
    }

    /**
     * Helper for basic RBAC checks (Phase 4 Testing Mode)
     */
    private checkRole(role: string, allowedRoles: string[]) {
        if (!role || !allowedRoles.includes(role)) {
            throw new ForbiddenException(`Access denied for role: ${role || 'anonymous'}`);
        }
    }
}
