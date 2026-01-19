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

        // ==========================================
        // MOTIVATIONAL ORGANISM INTENTS (Sprint 5-6)
        // ==========================================

        case 'morning_greeting':
            // TODO: Call /api/employee/morning-context
            return {
                text: '🌅 Доброе утро!\n\n📸 Твой ЦКП сегодня: Создать яркие воспоминания для гостей\n\n📊 Ориентир: 25+ компаний\n💰 Средняя ценность: цель 1500₽\n\n🎯 Микро-вызов дня:\n"Найди семью с ребёнком до 3 лет — улыбка гарантирована!"\n(+3 MC за выполнение)\n\nХорошего дня! 🙌',
                actions: ['employee.show_my_shift', 'employee.daily_challenge']
            };

        case 'show_my_earnings':
            // TODO: Call /api/mes/earnings-forecast
            return {
                text: '💰 ПРЕДВАРИТЕЛЬНЫЙ РАСЧЁТ\n\nБазовая часть:     2 500 ₽\nOKK-бонус:         1 610 ₽  (23 × 70₽)\nCK-бонус:          0 ₽      (ЦК ниже порога)\nMC-эквивалент:     340 ₽    (34 MC)\n─────────────────────────────\nИТОГО:             ~4 450 ₽\n\n📈 Если +3 компании и +20₽ ЦК:\nИТОГО:             ~6 200 ₽ (+39%!)',
                actions: ['employee.show_my_shift', 'employee.show_my_kpi']
            };

        case 'show_my_status_path':
            // TODO: Call /api/status/my-path
            return {
                text: '🌟 МОЙ СТАТУС\n\nСейчас: ⚡ ТОПЧИК (уровень 2 из 5)\n\nСледующий: 💎 КРЕМЕНЬ\n├─ Осталось: 2 месяца стабильного KPI ✅\n├─ Нужно: Завершить "Продвинутые продажи" ⏳\n└─ Нужно: 3 рацпредложения 📝 (сделано: 1)\n\nЧто даёт КРЕМЕНЬ:\n✅ +5% к базовой ставке\n✅ Приоритет в выборе смен\n✅ Доступ к расширенному Магазину MC',
                actions: ['employee.show_my_training', 'employee.growth_matrix']
            };

        case 'show_mc_balance':
            // TODO: Call /api/economy/wallet/my
            return {
                text: '🪙 МОИ МАТРИКС КОИНЫ\n\nБаланс: 847 MC\nСрок жизни: до 31.03 (осталось 72 дня)\n\n📥 Последние начисления:\n+15 MC — Помощь коллеге (вчера)\n+10 MC — Курс пройден (2 дня назад)\n+5 MC — Утренний челлендж (3 дня назад)\n\n🛒 Что могу купить?\n• Дополнительный выходной — 500 MC ✅\n• Сертификат ресторан — 700 MC ✅\n• Обучение у топ-фотографа — 1200 MC ⏳',
                actions: ['employee.show_achievements']
            };

        case 'show_my_training':
            // TODO: Call /api/university/my-progress
            return {
                text: '📚 МОЁ ОБУЧЕНИЕ\n\nПройдено курсов: 7 из 12 базовых\n[▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░] 58%\n\n⏳ В процессе:\n• Продвинутые продажи — 3/8 уроков\n\n📌 Рекомендуется:\n• "Работа с возражениями"\n  (+15 MC за прохождение, открывает путь к КРЕМЕНЬ)',
                actions: ['employee.show_my_status_path']
            };

        case 'daily_challenge':
            // TODO: Call /api/challenges/today
            return {
                text: '🎯 ТВОЙ ВЫЗОВ НА СЕГОДНЯ\n\n"Найди семью с ребёнком до 3 лет — улыбка гарантирована!"\n\nНаграда: +3 MC\nСтатус: ⏳ Не выполнен\n\n[✅ Отметить выполненным]',
                actions: ['employee.morning_greeting']
            };

        case 'show_my_shift':
            // TODO: Call /api/mes/my-shift
            return {
                text: '📸 МОЯ СМЕНА (сейчас)\n\nКомпаний создано: 18\n├─ Ретушь готова: 12 ✅\n├─ На ретуши: 4 ⏳\n└─ Ожидают: 2\n\nПродано: 9 (конверсия 75%!)\nОтклонено: 3\n\n💰 Прогноз за смену: ~5 800₽',
                actions: ['employee.show_my_earnings', 'employee.show_my_kpi']
            };

        case 'need_help':
            // Show help menu
            return {
                text: '🆘 НУЖНА ПОМОЩЬ\n\n• [📞 Позвать наставника]\n• [🔧 Техническая проблема]\n• [👥 Сложный клиент]\n• [❓ Не понимаю задачу]\n\n💡 Подсказка: Используй формат ЗРС:\n"Проблема → Варианты → Твоя рекомендация"\n\nЭто покажет твою инициативу (+MC!)',
                actions: ['employee.guide_next_step']
            };

        case 'show_achievements':
            // TODO: Call /api/achievements/my
            return {
                text: '⭐ МОИ ДОСТИЖЕНИЯ\n\nЗа эту неделю:\n🏆 Лучший по ЦК в среду (1 650₽!)\n🎓 Пройден курс "Работа с возражениями"\n💡 Рацпредложение принято\n\nБлагодарности от коллег:\n💬 "Спасибо за помощь со сложным клиентом!" — Пётр\n💬 "Научил меня новой технике!" — Мария',
                actions: ['employee.show_mc_balance']
            };

        case 'focus_mode':
            // TODO: Call /api/settings/focus-mode
            return {
                text: '🔇 РЕЖИМ ФОКУСА\n\nСейчас: Выключен\n\n[🔕 Включить на 2 часа]\n\nЧто отключится:\n• MC-уведомления\n• Аукционы\n• Напоминания\n\nЧто останется:\n• Критические алерты\n• Сообщения от руководителя',
                actions: []
            };

        case 'suggest_improvement':
            // Show kaizen form
            return {
                text: '💡 ПРЕДЛОЖИТЬ ИДЕЮ\n\nТвои идеи — это ценность! Мы слушаем каждого.\n\nОпиши свою идею:\n1. Что можно улучшить?\n2. Как это сделать?\n3. Какой будет эффект?\n\n[📝 Отправить идею]\n\n🎁 За принятую идею: +15-100 MC\n\nТвои предыдущие идеи: 3\n├─ Принято: 2 ✅\n└─ На рассмотрении: 1 ⏳',
                actions: []
            };

        case 'growth_matrix':
            // TODO: Call /api/growth-matrix/my
            return {
                text: '🧊 ТВОЯ МАТРИЦА РОСТА\n\n      📚 Квалификация: ████░░ 70%\n      🏆 Статус: ██░░░░░░ 40%\n      🎮 MC-капитал: █████░ 80%\n      💰 Доход: ███░░░░ 55%\n\n💡 Фокус на статусе даст прорыв!\n\n[🔮 Режим прогноза "Что если..."]',
                actions: ['employee.show_my_status_path', 'employee.show_my_training']
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
