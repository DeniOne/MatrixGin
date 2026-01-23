Frontend Immersion UI Spec
FOUNDATIONAL IMMERSION (Admission UI)

Scope: Frontend (Web + optional Telegram WebView)
Backend: FoundationService (single source of truth)
Canon: v2.2
UI Trust Level: LOW (UI не принимает решений)

1. Цель UI

UI НЕ обучает и НЕ оценивает.
UI выполняет три функции:

Показать смысл каждого FOUNDATIONAL блока

Провести пользователя через обязательный сценарий

Зафиксировать осознанное решение ACCEPT / DECLINE

Все проверки и блокировки — уже на backend.

2. Глобальные UI-инварианты (жёстко)

❌ Нет доступа к системе до ACCEPTED

❌ Нет skip / fast-forward

❌ Нет auto-accept

❌ Нет partial states

❌ Нет UI-only блокировок

❌ Нет “позже приму”

UI всегда синхронизируется с backend-статусом.

3. Entry & Routing Logic
3.1 Global App Guard (frontend)

При любом старте приложения:

GET /api/foundation/status


Ответ:

NOT_STARTED | IN_PROGRESS | ACCEPTED | NOT_ACCEPTED | VERSION_MISMATCH

3.2 Routing Rules
Backend Status	UI Поведение
NOT_STARTED	Redirect → /foundation/start
IN_PROGRESS	Redirect → /foundation/immersion
ACCEPTED	Normal app routing
NOT_ACCEPTED	Locked screen + info
VERSION_MISMATCH	Forced re-immersion

❗ Frontend не кэширует статус.

4. UI Structure
/foundation
├── start
├── immersion
│   ├── block/1 (Constitution)
│   ├── block/2 (Codex)
│   ├── block/3 (Golden Standard)
│   ├── block/4 (Role Model)
│   ├── block/5 (Motivation)
│   └── review
├── decision
└── result

5. Screen-by-Screen Spec
5.1 /foundation/start — Context Screen

Purpose:
Психологически и логически подготовить к решению.

UI Elements:

Краткое объяснение:

“Перед тобой система с жёсткими правилами допуска…”

Чёткое предупреждение:

“Без принятия Foundation ты не сможешь работать в системе.”

Button: BEGIN IMMERSION

❌ Нет “пропустить”
❌ Нет ссылок в основной интерфейс

5.2 /foundation/immersion/block/:id

Purpose:
Передать смысл + последствия, не “учить”.

Структура блока

Section A — Meaning

Что это

Зачем существует

Почему это важно

Section B — Consequences

Что будет, если соблюдать

Что будет, если нарушать

Action:

Button: I UNDERSTAND

Поведение кнопки
POST /api/foundation/block-viewed
{
  blockId: 1..5
}


Backend:

пишет в FoundationAuditLog

возвращает progress

❌ Кнопка неактивна, пока:

не достигнут конец контента

не прошло минимальное время (опционально)

5.3 /foundation/review

Purpose:
Собрать всё вместе перед решением.

UI:

Список 5 блоков (read-only)

Ключевые тезисы

Явное напоминание:

“После принятия правила будут применяться автоматически.”

Button:

PROCEED TO DECISION

5.4 /foundation/decision — КРИТИЧЕСКИЙ ЭКРАН

Purpose:
Осознанное юридико-системное решение.

UI Elements:

Текст принятия (не редактируемый)

Checkbox (обязательный):

“Я понимаю и принимаю правила системы”

Buttons:

ACCEPT FOUNDATION

DECLINE

❌ Нет default selection
❌ ACCEPT недоступен без checkbox

API
POST /api/foundation/decision
{
  decision: ACCEPT | DECLINE
}

5.5 /foundation/result
ACCEPTED

Короткое подтверждение

Сообщение:

“Доступ к системе открыт.”

Redirect → Role Assignment / Dashboard

DECLINED

Нейтральный текст

Сообщение:

“Ты не принял условия системы.”

Кнопка:

LOG OUT

❌ Нет “передумать позже” без re-immersion

6. Error & Edge Handling
6.1 Backend says BLOCK

Если любой API возвращает:

403 FOUNDATION_REQUIRED


Frontend:

немедленный redirect → /foundation/start

без попыток “восстановить UI”

6.2 Version mismatch

UI обязан показать:

“Правила системы обновились. Требуется повторное принятие.”

Redirect → /foundation/start

7. UI Anti-Patterns (ЗАПРЕЩЕНО)

❌ Прогресс-бары “40% completed”
❌ Геймификация
❌ “Обучающие видео”
❌ Ссылки на Applied
❌ Tooltip “не волнуйся”
❌ Кнопка “позже”

FOUNDATIONAL ≠ onboarding.

8. Минимальный MVP UI

Для MVP достаточно:

/foundation/start

/foundation/immersion/block/:id

/foundation/decision

global redirect logic

Review можно объединить с decision.

9. Definition of Done (Frontend)

UI считается корректным, если:

 Нельзя попасть в систему без ACCEPTED

 Все 5 блоков обязательны

 ACCEPT невозможен без явного действия

 Любой backend BLOCK корректно отрабатывается

 Нет UI-only логики допуска

10. Архитектурный вывод

Frontend — это проводник закона,
а не место, где он ослабляется.

Если UI “удобнее”, чем backend — это баг.