# ROADMAP: Интеграция PSEE с MatrixGin Core

## Архитектурные каноны
- PSEE = источник истины (facts, statuses, events)
- MatrixGin = аналитика, KPI, AI advisory
- AI = только читает, не управляет

---

## STEP 1 — Migrations ✅

**Цель:** Применить schema `psee` на PostgreSQL

### Задачи
- [x] Подключиться к PostgreSQL instance
- [x] Создать `schema psee`
- [x] Применить DDL из `infra/db/schema.sql`:
  - [x] `psee.sessions`
  - [x] `psee.stage_history`
  - [x] `psee.assignments`
  - [x] `psee.events`
- [x] Проверить constraints (PK/FK, NOT NULL)
- [x] Проверить INSERT/SELECT

**Результат:** ✅ БД готова

---

## STEP 2 — Fastify Integration ✅

**Цель:** Подключить PSEE API как bounded context

### Задачи
- [x] Зарегистрировать PSEE как Fastify server (standalone)
- [x] Настроить port 3001
- [x] Передать зависимости через DI
- [x] Health check `/health` → 200 OK
- [x] Docker integration (docker-compose.yml)
- [x] TypeScript compilation

**Результат:** ✅ PSEE доступен через Fastify

---

## STEP 3 — Event Export ✅

**Цель:** Read-only экспорт для MatrixGin / AI

### Задачи
- [x] Настроить read-access к `psee.events`
- [x] Реализовать event consumer в MatrixGin
- [x] Построить read-model: KPI, SLA, timeline
- [x] AI integration (safe mode)

### Жёсткие запреты
- ❌ AI не вызывает PSEE API
- ❌ AI не пишет в БД PSEE
- ❌ Нет auto-actions
- ❌ Нет обратных webhooks

**Результат:** ✅ AI анализирует, но не управляет

---

## Финальное состояние
```
PSEE (Process Engine)
  └─ PostgreSQL (facts + events)
        ↑
MatrixGin Core (Read / Analytics / KPI)
        ↑
AI (Advisory only)
```
