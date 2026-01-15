# MATRIXGIN — SYSTEM REGISTRY UI SPECIFICATION

Status: CANONICAL  
Version: 1.0  
Scope: Internal Administrative UI (System Registry)  
User Roles: REGISTRY_VIEW, REGISTRY_ADMIN  

Depends on:
- REGISTRY-API-CONTRACT.md (v1)
- SYSTEM-REGISTRY-SERVICE.md
- SYSTEM-REGISTRY-ACCESS-MODEL.md
- REGISTRY-BOOTSTRAP-STRATEGY.md

---

## 1. PURPOSE & SCOPE

System Registry UI предназначен ИСКЛЮЧИТЕЛЬНО для ручного управления
каноническими системными сущностями (Foundation Entities).

Разрешённые операции:
- создание (CREATE)
- редактирование метаданных (UPDATE META)
- управление жизненным циклом (DRAFT → ACTIVE → ARCHIVED)
- просмотр аудита (AUDIT)

Запрещено:
- аналитика
- визуализация структур (OFS, графы)
- управление процессами
- AI-интерфейсы
- удаление данных (DELETE)

System Registry UI — это **инженерный инструмент**, а не пользовательский продукт.

---

## 2. ACCESS CONTROL & RBAC

### 2.1 Application Roles

| Role | Capabilities |
|----|-------------|
| REGISTRY_VIEW | Просмотр сущностей и audit |
| REGISTRY_ADMIN | Полный доступ (create / update / lifecycle) |

### 2.2 Visibility Rules

- Модуль **System Registry** виден ТОЛЬКО пользователям с ролями REGISTRY_*
- Все остальные пользователи НЕ ВИДЯТ модуль полностью
- Executive / OFS / Analytics роли не имеют implicit-доступа

---

## 3. FRONTEND ISOLATION RULES (NON-NEGOTIABLE)

- Base route: `/registry/*`
- Отдельный layout: `RegistryLayout`
- Отдельная навигация
- Отсутствуют ссылки на:
  - OFS
  - Analytics
  - Economy
  - AI
- Registry UI — write-authority mental mode
- Никакого смешения read-only и write-контекстов

---

## 4. ROUTING

### 4.1 Base Route

/registry

shell
Копировать код

### 4.2 Entity Routes

/registry/:entity_type
/registry/:entity_type/new
/registry/:entity_type/:id

makefile
Копировать код

Примеры:
/registry/org-unit-types
/registry/value-tokens
/registry/task-states

yaml
Копировать код

---

## 5. UI STRUCTURE

### 5.1 RegistryLayout

- Sidebar navigation
- Группировка сущностей по доменам
- Минимальный, утилитарный дизайн
- Высокая плотность данных

---

### 5.2 Entity List Screen

**Route:** `/registry/:entity_type`

Компоненты:
- Header: Entity Name + "Create New"
- Filter Bar:
  - Search (code / name)
  - Lifecycle Status: All | Draft | Active | Archived
- Data Table (read-only):
  - CODE (monospace)
  - NAME
  - STATUS (badge)
  - UPDATED_AT
- Row click → Entity Detail Screen

API:
GET /api/v1/registry/:entity_type

yaml
Копировать код

---

### 5.3 Create Entity Screen

**Route:** `/registry/:entity_type/new`

Form fields:
1. CODE (required, immutable)
   - Pattern: `^[a-z_][a-z0-9_]*$`
2. NAME (required)
3. DESCRIPTION (optional)

Action:
- CREATE DRAFT

Rules:
- Все новые сущности создаются ТОЛЬКО в статусе `draft`
- Создание `active` напрямую запрещено

API:
POST /api/v1/registry/:entity_type

yaml
Копировать код

---

### 5.4 Entity Detail Screen

**Route:** `/registry/:entity_type/:id`

#### A. General Information

- ID (UUID, read-only, copyable)
- CODE (read-only, locked)
- NAME (editable)
- DESCRIPTION (editable)
- SAVE CHANGES (enabled only on dirty state)

API:
PATCH /api/v1/registry/:entity_type/:id

yaml
Копировать код

---

#### B. Lifecycle Control Panel

Отображает текущий статус и допустимые переходы.

Кнопки:
- Activate (только если `draft`)
- Archive (только если `active`)

Запрещено:
- reverse transitions
- manual status edit

API:
POST /api/v1/registry/:entity_type/:id/lifecycle

yaml
Копировать код

---

#### C. Audit Log Section

Read-only таблица.

Колонки:
- TIMESTAMP (UTC)
- ACTOR (User UUID / System)
- OPERATION (CREATE | UPDATE_META | UPDATE_LIFECYCLE)
- DETAILS (diff / transition)

API:
GET /api/v1/registry/:entity_type/:id/audit

yaml
Копировать код

---

## 6. API CONTRACT (CANONICAL)

Base URL:
/api/v1/registry

yaml
Копировать код

| Method | Endpoint | Purpose |
|------|---------|--------|
| GET | /:entity_type | List entities |
| POST | /:entity_type | Create entity (draft) |
| GET | /:entity_type/:id | Get entity |
| PATCH | /:entity_type/:id | Update metadata |
| POST | /:entity_type/:id/lifecycle | Activate / Archive |
| GET | /:entity_type/:id/audit | Audit log |

UI взаимодействует ИСКЛЮЧИТЕЛЬНО с `system-registry-service`.

---

## 7. UI GUARDRAILS

1. NO DELETE — удаление запрещено на уровне UI
2. CODE immutable — поле недоступно для редактирования
3. Lifecycle строго через FSM
4. No inline-edit в таблицах
5. No bulk-actions (v1)
6. Все ошибки API отображаются явно (no silent fail)

---

## 8. ERROR HANDLING

| Code | UI Behavior |
|----|------------|
| 400 | Validation error (form highlight) |
| 403 | Access denied |
| 404 | Entity not found |
| 409 | Lifecycle or code conflict |
| 5xx | Hard error (blocking) |

---

## 9. DONE CRITERIA

System Registry UI считается реализованным, если:

- Любая сущность из FOUNDATION-ENTITIES.md может быть:
  - создана
  - отредактирована
  - активирована
  - архивирована
- Audit доступен из UI
- CODE неизменяем на уровне UI и API
- Lifecycle кнопки соответствуют FSM
- Registry UI изолирован от OFS / Analytics

---

## 10. NON-GOALS

- Migration tooling
- Bulk import/export
- Schema editing
- AI assistance
- End-user access

---

END OF DOCUMENT