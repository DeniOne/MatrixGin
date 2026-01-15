(Process Engine + локальная аналитика)

Адаптировано под Antigravity IDE и модель ролей

Цель шага:
спроектировать замкнутый, автономный, экономикообразующий модуль,
который:

живёт своим бэком

встраивается в общий фронт

экспортирует факты и метрики в MatrixGin

не зависит от AI

2.1 Архитектурный тип модуля

PSEE = Vertical Domain Module (Bounded Context)

Это означает:

свой backend

своя доменная модель

своя аналитика

свой event store (или schema)

единая точка UI во фронте MatrixGin

📌 Не микросервис ради микросервиса
📌 А автономный контур с API

2.2 Размещение в Antigravity IDE (канонично)
📁 Backend (отдельный проект)
/photo-session-economic-engine
  ├── domain
  │   ├── Session.ts
  │   ├── SessionStatus.ts
  │   ├── Role.ts
  │   ├── StageHistory.ts
  │   └── SLA.ts
  │
  ├── application
  │   ├── createSession.ts
  │   ├── confirmStage.ts
  │   ├── rejectStage.ts
  │   ├── completeStage.ts
  │   └── handoffStage.ts
  │
  ├── analytics
  │   ├── FlowMetrics.ts
  │   ├── BottleneckDetector.ts
  │   └── SLACalculator.ts
  │
  ├── api
  │   └── sessions.controller.ts
  │
  ├── infra
  │   ├── db
  │   ├── event-publisher
  │   └── clock
  │
  └── README.md


📌 Никакого AI-кода
📌 Analytics ≠ AI

2.3 Domain Layer (ядро)
Session (aggregate root)
Session {
  id
  clientId
  currentStatus
  currentRole
  assignedUserId
  createdAt
  updatedAt
}

SessionStatus (finite state machine)
CREATED
PHOTOGRAPHER_PENDING
PHOTOGRAPHER_CONFIRMED
SHOOTING_COMPLETED
RETUSH_IN_PROGRESS
RETUSH_COMPLETED
PRINT_IN_PROGRESS
PRINT_COMPLETED
READY_FOR_DELIVERY
DELIVERED


📌 Переходы — только через application layer

StageHistory (audit trail)
StageHistory {
  sessionId
  fromStatus
  toStatus
  role
  userId
  startedAt
  endedAt
}


📌 Это золото для экономики
📌 Основа SLA и bottleneck-аналитики

2.4 Application Layer (use cases)

Каждый use-case:

атомарный

детерминированный

пишет событие

ничего не решает “умно”

Use cases v1:

createSession

confirmStage

rejectStage

completeStage

handoffStage

📌 Один endpoint = один use-case

2.5 Локальная аналитика (ОЧЕНЬ ВАЖНО)

Это НЕ MatrixGin-аналитика.
Это производственная аналитика.

Что считаем локально:

время в статусе

SLA по этапу

среднее время по ролям

текущую загрузку

Что НЕ делаем:

прогнозы

рекомендации

оценки людей

📌 Эти данные:

показываются в UI PSEE

экспортируются в MatrixGin

2.6 API-контракт (PSEE v1)
POST   /sessions
GET    /sessions
GET    /sessions/{id}

POST   /sessions/{id}/confirm
POST   /sessions/{id}/reject
POST   /sessions/{id}/complete
POST   /sessions/{id}/handoff


Каждый POST:

валидирует переход

пишет StageHistory

эмитит Event

2.7 Экспорт в MatrixGin (read-only)

Экспортируем:

SessionCreated

SessionStatusChanged

StageCompleted

StageRejected

SLABreached (event, не решение)

📌 MatrixGin:

считает KPI

включает AI Impact Analyst

строит сценарии

📌 PSEE:

НИЧЕГО не принимает обратно

2.8 Интеграция во фронт MatrixGin
Левое меню
Производство
 └─ Фотосессии

Экран

список сессий

фильтр по статусу

таймер этапа

индикатор SLA

UI:

тупой

честный

без логики

2.9 Контроль соответствия Antigravity ролям

USER — утверждает архитектуру

TECHLEAD — проектирует и режиссирует

CODER — будет писать код ТОЛЬКО после следующего шага