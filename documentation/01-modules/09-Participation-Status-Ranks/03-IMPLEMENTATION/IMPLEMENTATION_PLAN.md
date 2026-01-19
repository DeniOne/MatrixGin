IMPLEMENTATION PLAN

Статус документа: APPROVED
Назначение: План пошаговой реализации модуля без нарушения CANON
Ограничение: Экономика MC/GMC не затрагивается напрямую

0. Общие принципы реализации (НЕОБСУЖДАЕМЫЕ)

Модуль не начисляет MC

Модуль не умножает MC

Модуль не участвует в Wallet / Transactions

Любое влияние — через Eligibility / Governance

Любая реализация должна соответствовать:

STATUS-RANKS-CANON.md

STATUS-RANKS-ARCHITECTURE.md

STATUS-RANKS-REGULATIONS.md

PHASE 1 — Domain Modeling (Backend Core)
Цель

Создать чистую доменную модель без бизнес-логики экономики.

1.1 Сущности
Status

code (PHOTON, TOPCHIK, STAR, UNIVERSE)

description

governance_flags

is_active

UserStatus

user_id

status_code

assigned_at

assigned_by

reason

StatusHistory

user_id

old_status

new_status

reason

changed_at

Rank

code (COLLECTOR, INVESTOR, MAGNATE, DIAMOND_HAND)

conditions (declarative)

UserRank

user_id

rank_code

calculated_at

1.2 Критерий завершения PHASE 1

Сущности описаны

Нет бизнес-логики

Нет связей с Economy

PHASE 2 — Status Assignment & Governance Logic
Цель

Реализовать регламентное управление статусами.

2.1 Backend Services

StatusAssignmentService

StatusAuditService

2.2 Возможности

ручное присвоение / изменение статуса

обязательный reason

полный audit trail

2.3 Ограничения

нет автоматических апгрейдов

нет downgrade без причины

Критерий завершения PHASE 2

статус можно присвоить

история фиксируется

RBAC соблюдён

PHASE 3 — Rank Calculation Engine
Цель

Автоматически вычислять ранг участия, не влияя на MC.

3.1 Входные данные

GMC balance (read-only)

duration of holding GMC

3.2 RankResolver

declarative rules

периодический пересчёт

детерминированный результат

Критерий завершения PHASE 3

ранг вычисляется корректно

не влияет на транзакции

воспроизводим

PHASE 4 — Eligibility & Privileges Layer
Цель

Связать Status / Rank с правами и доступами, а не доходами.

4.1 Eligibility Rules

доступ к Store Items

доступ к Auctions

участие в Governance

право наставничества

4.2 Integration

StoreEligibilityService

Governance UI

Критерий завершения PHASE 4

статусы реально влияют на доступ

экономика не затронута

PHASE 5 — UI (Read-only + Governance)
Цель

Обеспечить прозрачность без давления.

5.1 UI Components

StatusBadge

RankBadge

StatusHistoryView

PrivilegesList

5.2 Запреты UI

нет прогнозов дохода

нет коэффициентов

нет сравнений

Критерий завершения PHASE 5

пользователь видит статус и ранг

понимает их смысл

не мотивируется «выгодой»

PHASE 6 — Analytics & Audit
Цель

Сделать модуль наблюдаемым, но не оценивающим.

6.1 Метрики

количество изменений статуса

распределение статусов

стабильность рангов

6.2 Ограничения

не KPI

не performance metrics

FINAL ACCEPTANCE CRITERIA

Модуль считается завершённым, если:

 Экономика MC не изменена

 Нет multiplier как коэффициента

 Статусы влияют только на доступ

 Все изменения аудируемы

 CANON не нарушен

Статус по умолчанию

До начала PHASE 1:

Модуль существует в состоянии DESIGN-READY, IMPLEMENTATION-FROZEN