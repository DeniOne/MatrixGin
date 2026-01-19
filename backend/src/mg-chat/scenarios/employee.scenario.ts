import { ResolvedIntent } from '../intent';
import { MGChatResponse } from '../telegram';
import { mesService } from '../../mes/services/mes.service';
import { prisma } from '../../config/prisma';
import { growthMatrixService } from '../../services/growth-matrix.service';

/**
 * Handle Employee scenarios (Execution contour)
 * 
 * SCOPE: "Me", Personal Data, Self-Improvement
 * PRIVACY: Only accesses data for the current user (intent.userId)
 */
export async function handleEmployeeScenario(action: string, intent: ResolvedIntent): Promise<MGChatResponse> {
    switch (action) {
        // ==========================================
        // SPRINT 11: Real Integrations
        // ==========================================
        case 'morning_greeting':
            return {
                text: '🌅 Доброе утро!\n\n(Данные загружаются...)\n\n📸 Твой ЦКП сегодня: Создать яркие воспоминания для гостей\n\n📊 Ориентир: 25+ компаний\n💰 Средняя ценность: цель 1500₽',
                actions: ['employee.show_my_shift', 'employee.daily_challenge']
            };

        case 'show_my_earnings':
            const earningsForecast = await mesService.getEarningsForecast(intent.userId);
            // Advisory Only: Shows data, suggests "Check Shift"
            return {
                text: `💰 ПРОГНОЗ ЗАРАБОТКА\n\nБаза: ${earningsForecast.baseSalary}₽\nБонус (Смена): ${earningsForecast.bonusPool}₽\n\nИтого: ~${earningsForecast.totalProjected}₽\n\n${earningsForecast.breakdown.message}`,
                actions: ['employee.show_my_shift', 'employee.show_my_kpi']
            };

        case 'show_my_shift':
            const shift = await mesService.getMyShiftProgress(intent.userId);
            // Advisory Only: Shows progress, suggests "Check Earnings"
            return {
                text: `📸 МОЯ СМЕНА\n\nКомпаний: ${shift.companiesCreated}\nПродано: ${shift.companiesSold}\nКонверсия: ${shift.conversion}%\nАктивные задачи: ${shift.activeTasks}`,
                actions: ['employee.show_my_earnings', 'employee.show_my_kpi']
            };

        case 'show_mc_balance':
            const wallet = await prisma.wallet.findUnique({ where: { user_id: intent.userId } });
            const balance = wallet ? Number(wallet.mc_balance) : 0;
            // NBA: Suggest spending
            return {
                text: `🪙 МОИ МАТРИКС КОИНЫ\n\nБаланс: ${balance} MC\n\n🛒 Магазин доступен!`,
                actions: ['employee.show_achievements']
            };

        case 'show_my_training':
            // Read-only enrollment check
            return {
                text: '📚 МОЁ ОБУЧЕНИЕ\n\n(Функция в разработке, заглушка)', // University service integration pending
                actions: ['employee.show_my_status_path']
            };

        case 'growth_matrix':
            const pulse = await growthMatrixService.getGrowthPulse(intent.userId);
            const lines = pulse.map(p => `- ${p.axis}: ${p.value}%`).join('\n');
            return {
                text: `🧊 ТВОЯ МАТРИЦА РОСТА\n\n${lines}`,
                actions: ['employee.show_my_status_path']
            };

        // ==========================================
        // Legacy / Placeholders
        // ==========================================
        case 'show_my_schedule':
            return {
                text: '📅 Твой график на сегодня:\n\n09:00 - 18:00 (Офис)',
                actions: ['employee.show_my_tasks', 'employee.explain_status']
            };

        case 'show_my_tasks':
            return {
                text: '📋 Твои задачи:\n\n1. Завершить отчёт\n2. Проверить email',
                actions: ['employee.show_my_schedule', 'employee.guide_next_step']
            };

        case 'show_my_kpi':
            return {
                text: '📊 Твои показатели:\n\nПроизводительность: 95%\nКачество: 98%',
                actions: ['employee.explain_status']
            };

        case 'explain_status':
            return {
                text: '✅ Твой статус: Активен\n\nВсе задачи в порядке',
                actions: ['employee.show_my_kpi', 'employee.guide_next_step']
            };

        case 'guide_next_step':
            return {
                text: '➡️ Следующий шаг:\n\nЗавершить текущую задачу',
                actions: ['employee.show_my_tasks']
            };

        case 'show_my_status_path':
            return {
                text: '🌟 МОЙ СТАТУС\n\nСейчас: ⚡ ТОПЧИК (уровень 2 из 5)\nСледующий: 💎 КРЕМЕНЬ',
                actions: ['employee.show_my_training', 'employee.growth_matrix']
            };

        case 'daily_challenge':
            return {
                text: '🎯 ТВОЙ ВЫЗОВ НА СЕГОДНЯ\n\n(Заглушка)...',
                actions: ['employee.morning_greeting']
            };

        case 'need_help':
            return {
                text: '🆘 НУЖНА ПОМОЩЬ\n\n• [📞 Позвать наставника]\n• [🔧 Техническая проблема]\n• [👥 Сложный клиент]\n• [❓ Не понимаю задачу]',
                actions: ['employee.guide_next_step']
            };

        case 'show_achievements':
            return {
                text: '⭐ МОИ ДОСТИЖЕНИЯ\n\n(Заглушка)...',
                actions: ['employee.show_mc_balance']
            };

        case 'focus_mode':
            return {
                text: '🔇 РЕЖИМ ФОКУСА\n\n(Заглушка)...',
                actions: []
            };

        case 'suggest_improvement':
            return {
                text: '💡 ПРЕДЛОЖИТЬ ИДЕЮ\n\n(Заглушка)...',
                actions: []
            };

        default:
            return {
                text: `Employee action не реализован: ${action}`,
                actions: []
            };
    }
}
