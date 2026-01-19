# IMPLEMENTATION-CHECKLIST.md  
## MODULE 07 — TELEGRAM INTERFACE (MatrixGin)

Статус: ❌ REJECTED (Audit 2026-01-19)  
Версия: 1.1 (Post-Audit)  
Назначение: определить КОНКРЕТНЫЕ инженерные задачи  
и критерии, при которых модуль считается ЗАКРЫТЫМ.

> [!CAUTION]
> Модуль отклонен из-за отсутствия Sandbox/DMZ и критических нарушений безопасности. См. [AUDIT-REPORT.md](./AUDIT-REPORT.md).

---

## ЛЕГЕНДА

- MUST — обязательно для закрытия модуля  
- SHOULD — желательно, но не блокирует закрытие  
- OPTIONAL — можно отложить  
- DEFERRED — запрещено реализовывать сейчас  

---

## PHASE A — FOUNDATION (БЕЗ ЭТОГО ДАЛЬШЕ НЕЛЬЗЯ)

### A1. Telegram Infrastructure
- [MUST] Создать Telegram Bot (Webhook mode)
- [MUST] Endpoint `/api/telegram/webhook`
- [MUST] Проверка подписи Telegram
- [MUST] Rate limiting (per telegram_id)
- [MUST] Idempotency protection

---

### A2. Identity & Auth Binding
- [MUST] Связка Telegram ID ↔ User ID
- [MUST] Запрет анонимных команд
- [MUST] RBAC-проверка на каждый интент
- [MUST] Контекст пользователя (role, level, permissions)

---

## PHASE B — SANDBOX / DMZ (CRITICAL)

### B1. Sandbox Pipeline
- [MUST] Отдельный Sandbox слой
- [MUST] DTO schema validation (все сообщения)
- [MUST] Input sanitization
- [MUST] Payload size limits
- [MUST] Anti prompt-injection filter
- [MUST] File-type whitelist (PDF, JPG, PNG)

---

### B2. File Handling (Documents)
- [MUST] Временное хранилище файлов (TTL)
- [MUST] Запрет постоянного хранения в Sandbox
- [MUST] Virus / malware scanning (если применимо)
- [MUST] Metadata extraction (без содержимого)

---

## PHASE C — INTENT SYSTEM

### C1. Intent Registry
- [MUST] Реестр интентов (central config)
- [MUST] Для каждого интента:
  - id
  - description
  - allowed roles
  - owner service
  - impact level (read / action / advisory)
- [MUST] Versioning интентов

---

### C2. Intent Routing
- [MUST] Deterministic intent matching
- [MUST] Запрет free-form execution
- [MUST] Явный fallback → "intent not allowed"
- [MUST] Логирование intent → outcome

---

## PHASE D — CORE FUNCTIONALITY (MUST)

### D1. Registration & Onboarding
- [MUST] Регистрация через Telegram
- [MUST] Привязка аккаунта
- [MUST] Онбординг-флоу
- [MUST] Capture initial consent

---

### D2. Employee LK — OFS Projection
- [MUST] Read-only OFS view
- [MUST] Моя позиция
- [MUST] Подчинённость
- [MUST] Запрет чужих персональных данных

---

### D3. Shift & Attendance
- [MUST] Start shift
- [MUST] End shift
- [MUST] Геолокация (consent-based)
- [MUST] Фото / селфи подтверждение
- [MUST] История смен
- [MUST] Advisory уведомления (опоздания)

---

### D4. Tasks & Operations
- [MUST] Список задач на смену
- [MUST] Создание личных задач
- [MUST] Отметка выполнения
- [MUST] Напоминания

---

### D5. Employee Dashboard
- [MUST] План / факт
- [MUST] Онлайн-статус
- [MUST] История личных показателей
- [MUST] Без сравнений с другими

---

### D6. AI Assistant — Employee Mode
- [MUST] Ответы на вопросы (read-only)
- [MUST] Объяснение данных
- [MUST] Планирование смены
- [MUST] Напоминания
- [MUST] Advisory-only enforcement

---

## PHASE E — DOCUMENTS & PERSONAL FILES (CRITICAL)

### E1. Document Request Flow
- [MUST] HR может запросить документ
- [MUST] Уведомление сотрудника
- [MUST] Статус запроса (pending / approved / rejected)

---

### E2. Document Upload
- [MUST] Загрузка через Telegram
- [MUST] Sandbox storage (TTL)
- [MUST] Human approval workflow
- [MUST] Загрузка в Secure Registry после approval
- [MUST] Audit log всего цикла

---

### E3. Access Control
- [MUST] Доступ только владельцу и HR
- [MUST] Запрет AI-доступа к raw-документам
- [MUST] Read-only просмотр статуса сотрудником

---

## PHASE F — MANAGER & EXECUTIVE PROJECTIONS

### F1. Tactical Manager LK
- [SHOULD] Агрегаты по подразделению
- [SHOULD] План / факт команды
- [SHOULD] Алерты
- [SHOULD] Постановка задач

---

### F2. Executive Snapshot
- [OPTIONAL] KPI snapshots
- [OPTIONAL] Strategic alerts
- [OPTIONAL] High-level Q&A

---

## PHASE G — COMMUNICATION & SUPPORT

### G1. Corporate Communication
- [SHOULD] Корпоративные каналы
- [SHOULD] Объявления
- [OPTIONAL] Опросы
- [OPTIONAL] Сбор идей

---

### G2. Support & Helpdesk
- [SHOULD] IT-запросы
- [SHOULD] HR-вопросы
- [OPTIONAL] Интеграция с ITSM

---

## PHASE H — SECURITY, ETHICS & AUDIT (NON-NEGOTIABLE)

### H1. Audit & Logging
- [MUST] Лог всех интентов
- [MUST] Лог всех действий
- [MUST] Лог всех document uploads
- [MUST] Лог AI input → output
- [MUST] Immutable audit trail

---

### H2. Consent Management
- [MUST] Consent на геолокацию
- [MUST] Consent на фото
- [MUST] Consent на AI
- [MUST] Возможность отзыва согласия

---

## PHASE I — EXIT CRITERIA (ЗАКРЫТИЕ МОДУЛЯ)

Модуль 07 считается ЗАКРЫТЫМ, если:

- [MUST] Закрыты все пункты MUST
- [MUST] Зафиксирован Intent Registry
- [MUST] Sandbox обязателен и протестирован
- [MUST] Документы доходят до Secure Registry
- [MUST] AI работает только advisory-only
- [MUST] Пройден security review
- [MUST] Пройден ethics review
- [MUST] Нет DEFERRED-функций в коде

До этого момента модуль считается
**частично реализованным**, даже если работает.

---

## PHASE J — ЯВНЫЕ DEFERRED (ЗАПРЕЩЕНО СЕЙЧАС)

- [DEFERRED] Автоматический аппрув документов
- [DEFERRED] AI-психодиагностика
- [DEFERRED] AI-управленческие решения
- [DEFERRED] Стратегическая аналитика через Telegram
- [DEFERRED] Сравнительные KPI рейтинги
