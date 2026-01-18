REGISTRY-NOTES.md

Module: MatrixCoin Economy
Scope: Registry Core ↔ Economy
Status: Canonical (Architecture Decision Record)

1. Назначение документа

Этот документ фиксирует осознанное архитектурное решение о взаимодействии
(и текущем невзаимодействии) MatrixCoin Economy с Registry Core.

Документ создан для:

предотвращения неявных зависимостей,

снятия вопросов на архитектурных и compliance-аудитах,

защиты транзакционного контура Economy от преждевременной интеграции.

2. Определение Registry Core (контекст)

Registry Core — это реестр:

долгоживущих,

канонических,

кросс-модульных сущностей,

используемых как точка идентичности и ссылки, а не как ledger или event-log.

Registry НЕ предназначен для:

транзакционных данных,

событий,

экономических операций,

временных или сгораемых сущностей.

3. Решение по MatrixCoin Economy (ФИКСАЦИЯ)
3.1 Сущности, НЕ регистрируемые в Registry Core

Следующие сущности ЯВНО НЕ РЕГИСТРИРУЮТСЯ в Registry Core:

Сущность	Причина
StoreItem	Конфигурационная сущность Store-модуля
Purchase	Событийная / транзакционная сущность
EconomyTransaction	Ledger / event entity
IdempotencyKey	Техническая сущность

Обоснование:

Эти сущности живут в транзакционном контуре

Их регистрация нарушит:

изоляцию модулей

атомарность операций

rollback-гарантии

3.2 Явные запреты (NON-NEGOTIABLE)

В рамках PRIORITY 1 и Store Purchase Core:

❌ Purchase НЕ создаёт записей в Registry

❌ StoreItem НЕ имеет registry-id

❌ EconomyTransaction НЕ регистрируется

❌ Registry НЕ участвует в idempotency

❌ Registry НЕ участвует в Purchase Flow

Любая попытка нарушить эти правила считается архитектурной ошибкой.

4. Пограничная сущность: Wallet (ОТЛОЖЕННО)
4.1 Статус Wallet

Wallet признан пограничной сущностью:

Критерий	Статус
Долгоживущая	✅
Используется кросс-модульно	⚠️ потенциально
Транзакционная	❌ (ledger — отдельно)
4.2 Решение

В текущей реализации Wallet НЕ регистрируется в Registry Core

Интеграция Wallet ↔ Registry ОТЛОЖЕНА

Причина:
До стабилизации Purchase Flow и Wallet API любые registry-связи создадут
архитектурный долг и риск расхождений.

5. Когда решение подлежит пересмотру

Переоценка допустима ТОЛЬКО при выполнении всех условий:

 Закрыт PRIORITY 1 (Purchase Core)

 Стабилен Wallet API

 Появилась потребность в:

cross-module asset tracking

GMC

внешней отчётности

governance / compliance export

До этого момента данное решение считается финальным.

6. Связанные документы

STORE-TECH.md

STORE-API.md

STORE-FLOW.md

STORE-PURCHASE-PRIORITY-1.md

7. Архитектурная фиксация

MatrixCoin Economy осознанно изолирован от Registry Core
на этапе реализации Store Purchase Core.

Это решение:

снижает сложность,

сохраняет транзакционную целостность,

предотвращает premature abstraction.