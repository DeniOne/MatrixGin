/**
 * Scenario Router (Step 4)
 * 
 * Routes resolved intents to appropriate backend scenarios.
 * 
 * WHY THIS EXISTS:
 * - Intent Resolver gives us WHAT user wants
 * - Scenario Router decides HOW to fulfill it
 * - Connects MG Chat Core to MatrixGin backend
 * 
 * ARCHITECTURE:
 * - Intent Namespace = Management Contour
 * - employee.* → Employee scenarios
 * - manager.* → Manager scenarios
 * - exec.* → Executive scenarios
 * 
 * RULES:
 * - NO business logic (that's in backend)
 * - ONLY routing and API calls
 * - Returns MGChatResponse
 */

import { ResolvedIntent } from '../intent';
import { MGChatResponse } from '../telegram';

/**
 * Route intent to appropriate scenario.
 * 
 * This is where Intent Namespaces become technical reality.
 */
export function routeScenario(intent: ResolvedIntent): MGChatResponse {
    const [namespace, action] = intent.intentId.split('.');

    switch (namespace) {
        case 'employee':
            return handleEmployeeScenario(action, intent);
        case 'manager':
            return handleManagerScenario(action, intent);
        case 'exec':
            return handleExecutiveScenario(action, intent);
        default:
            return {
                text: `Неизвестный namespace: ${namespace}`,
                actions: []
            };
    }
}

/**
 * Handle Employee scenarios (Execution contour)
 * 
 * WHY: Employee intents are about "me" — personal data, no aggregations
 */
function handleEmployeeScenario(action: string, intent: ResolvedIntent): MGChatResponse {
    switch (action) {
        case 'show_my_schedule':
            // TODO: Call /api/schedule/my
            return {
                text: '📅 Твой график на сегодня:\n\n09:00 - 18:00 (Офис)',
                actions: ['employee.show_my_tasks', 'employee.explain_status']
            };

        case 'show_my_tasks':
            // TODO: Call /api/tasks/my
            return {
                text: '📋 Твои задачи:\n\n1. Завершить отчёт\n2. Проверить email',
                actions: ['employee.show_my_schedule', 'employee.guide_next_step']
            };

        case 'show_my_kpi':
            // TODO: Call /api/kpi/my
            return {
                text: '📊 Твои показатели:\n\nПроизводительность: 95%\nКачество: 98%',
                actions: ['employee.explain_status']
            };

        case 'explain_status':
            // TODO: Call /api/status/my
            return {
                text: '✅ Твой статус: Активен\n\nВсе задачи в порядке',
                actions: ['employee.show_my_kpi', 'employee.guide_next_step']
            };

        case 'guide_next_step':
            // TODO: Call /api/guidance/next
            return {
                text: '➡️ Следующий шаг:\n\nЗавершить текущую задачу',
                actions: ['employee.show_my_tasks']
            };

        default:
            return {
                text: `Employee action не реализован: ${action}`,
                actions: []
            };
    }
}

/**
 * Handle Manager scenarios (Tactical Control contour)
 * 
 * WHY: Manager intents are about "my team" — aggregates, tactical decisions
 */
function handleManagerScenario(action: string, intent: ResolvedIntent): MGChatResponse {
    switch (action) {
        case 'show_shift_status':
            // TODO: Call /api/shifts/current
            return {
                text: '👥 Статус смены:\n\nНа смене: 5 человек\nОтсутствуют: 2',
                actions: ['manager.show_absences', 'manager.show_team_overview']
            };

        case 'show_team_overview':
            // TODO: Call /api/team/overview
            return {
                text: '📊 Обзор команды:\n\nВсего: 12 человек\nАктивны: 10',
                actions: ['manager.show_shift_status', 'manager.show_absences']
            };

        case 'show_absences':
            // TODO: Call /api/absences/current
            return {
                text: '🏥 Отсутствия:\n\n- Иванов (больничный)\n- Петров (отпуск)',
                actions: ['manager.manage_shift_reassign']
            };

        case 'resolve_incident':
            // TODO: Call /api/incidents/resolve
            return {
                text: '⚠️ Какой инцидент нужно решить?\n\nОтправьте номер инцидента',
                actions: ['manager.show_shift_status']
            };

        case 'manage_shift_reassign':
            // TODO: Call /api/shifts/reassign
            return {
                text: '🔄 Переназначение смены:\n\nВыберите сотрудника',
                actions: ['manager.show_shift_status']
            };

        default:
            return {
                text: `Manager action не реализован: ${action}`,
                actions: []
            };
    }
}

/**
 * Handle Executive scenarios (Signal/Navigate contour)
 * 
 * WHY: Executive intents are about "system" — signals, no actions
 */
function handleExecutiveScenario(action: string, intent: ResolvedIntent): MGChatResponse {
    switch (action) {
        case 'show_system_health':
            // TODO: Call /api/system/health
            return {
                text: '🏥 Здоровье системы:\n\n✅ Все сервисы работают\n✅ Нет критических отклонений',
                actions: ['exec.show_kpi_summary', 'exec.explain_risk']
            };

        case 'show_kpi_summary':
            // TODO: Call /api/kpi/summary
            return {
                text: '📊 Сводка KPI:\n\nПроизводительность: 92%\nУдовлетворённость: 88%',
                actions: ['exec.explain_risk', 'exec.navigate_dashboard']
            };

        case 'explain_risk':
            // TODO: Call /api/risks/current
            return {
                text: '⚠️ Анализ рисков:\n\nНизкий риск: Все показатели в норме',
                actions: ['exec.show_system_health', 'exec.navigate_dashboard']
            };

        case 'navigate_dashboard':
            // TODO: Return dashboard link
            return {
                text: '📊 Дашборд:\n\nhttps://matrixgin.local/dashboard',
                actions: ['exec.show_system_health', 'exec.show_kpi_summary']
            };

        default:
            return {
                text: `Executive action не реализован: ${action}`,
                actions: []
            };
    }
}
