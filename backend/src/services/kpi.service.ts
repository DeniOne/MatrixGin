import { startOfDay } from 'date-fns/startOfDay';
import { startOfWeek } from 'date-fns/startOfWeek';
import { startOfMonth } from 'date-fns/startOfMonth';
import { endOfDay } from 'date-fns/endOfDay';
import { endOfWeek } from 'date-fns/endOfWeek';
import { endOfMonth } from 'date-fns/endOfMonth';

import { prisma } from '../config/prisma';

/**
 * Service responsible for calculating KPI statistics based on wallet transactions and task rewards.
 * The methods return simple aggregated numbers; they can be extended to return richer DTOs.
 */
export class KpiService {
    /**
     * Calculate daily statistics for the current day.
     * Returns total transaction amount, total task rewards, and count of transactions.
     */
    async calculateDailyStats() {
        const now = new Date();
        const dayStart = startOfDay(now);
        const dayEnd = endOfDay(now);

        const [transactions, rewards] = await Promise.all([
            prisma.transaction.findMany({
                where: {
                    created_at: { gte: dayStart, lte: dayEnd },
                },
                select: { amount: true },
            }),
            prisma.task.findMany({
                where: {
                    created_at: { gte: dayStart, lte: dayEnd },
                    mc_reward: { not: null },
                },
                select: { mc_reward: true },
            }),
        ]);

        const totalTransaction = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const totalReward = rewards.reduce((sum, r) => sum + Number(r.mc_reward ?? 0), 0);

        return {
            period: 'daily',
            date: now.toISOString().split('T')[0],
            totalTransaction,
            totalReward,
            transactionCount: transactions.length,
        };
    }

    /**
     * Calculate weekly statistics for the current week (Monday‑Sunday).
     */
    async calculateWeeklyStats() {
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

        const [transactions, rewards] = await Promise.all([
            prisma.transaction.findMany({
                where: { created_at: { gte: weekStart, lte: weekEnd } },
                select: { amount: true },
            }),
            prisma.task.findMany({
                where: { created_at: { gte: weekStart, lte: weekEnd }, mc_reward: { not: null } },
                select: { mc_reward: true },
            }),
        ]);

        const totalTransaction = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const totalReward = rewards.reduce((sum, r) => sum + Number(r.mc_reward ?? 0), 0);

        return {
            period: 'weekly',
            weekStart: weekStart.toISOString().split('T')[0],
            weekEnd: weekEnd.toISOString().split('T')[0],
            totalTransaction,
            totalReward,
            transactionCount: transactions.length,
        };
    }

    /**
     * Calculate monthly statistics for the current month.
     */
    async calculateMonthlyStats() {
        const now = new Date();
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);

        const [transactions, rewards] = await Promise.all([
            prisma.transaction.findMany({
                where: { created_at: { gte: monthStart, lte: monthEnd } },
                select: { amount: true },
            }),
            prisma.task.findMany({
                where: { created_at: { gte: monthStart, lte: monthEnd }, mc_reward: { not: null } },
                select: { mc_reward: true },
            }),
        ]);

        const totalTransaction = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const totalReward = rewards.reduce((sum, r) => sum + Number(r.mc_reward ?? 0), 0);

        return {
            period: 'monthly',
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            totalTransaction,
            totalReward,
            transactionCount: transactions.length,
        };
    }
}

export default new KpiService();

