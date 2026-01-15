# MATRIXGIN — REGISTRY ONTOLOGY v1

> **Статус:** CANONICAL  
> **Версия:** 1.0  
> **Дата:** 2026-01-14  
> **Автор:** Lead System Architect / MDM & Ontology Designer

---

## 1. REGISTRY ONTOLOGY MAP v1

### 1.1 Домены и классификация

| # | Domain (RU) | Domain (EN) | Entity Count | Назначение |
|---|-------------|-------------|--------------|------------|
| 1 | Безопасность | Security | 6 | RBAC, политики, области доступа |
| 2 | Человеческий капитал | Human | 5 | Люди и акторы (внутренние/внешние/AI) |
| 3 | Организационная структура | Structure | 6 | Орг. единицы и их отношения |
| 4 | Функциональный домен | Functional | 2 | Бизнес-функции |
| 5 | Иерархия и статусы | Hierarchy | 6 | Позиции, статусы, квалификации |
| 6 | Ценностный продукт | Value | 3 | ЦКП и владение |
| 7 | Процессы и задачи | Process | 3 | Типы задач, workflow |
| 8 | Внутренняя экономика | Economy | 3 | Токены, правила вознаграждений |
| 9 | База знаний | Knowledge | 8 | Образование, методологии |
| 10 | Юридический блок | Legal | 2 | Юр. лица и документы |
| 11 | Интеграции | Integration | 3 | Внешние системы |

**Итого:** 47 доменных сущностей + 4 мета-сущности = **51 entity type**

---

### 1.2 Полный Ontology Map

#### DOMAIN: SECURITY (Безопасность)

| Entity | URN | Class | Назначение |
|--------|-----|-------|------------|
| **UserAccount** | `urn:mg:type:user_account` | core | Системный аккаунт для аутентификации. Связь с Person опциональна. |
| **Role** | `urn:mg:type:role` | reference | Роль RBAC. Группирует permissions. |
| **Permission** | `urn:mg:type:permission` | reference | Атомарное право на действие (`module:action:scope`). |
| **RolePermission** | `urn:mg:type:role_permission` | relation | Связь Role ↔ Permission. **Только relationships, без собственных attributes.** |
| **AccessScope** | `urn:mg:type:access_scope` | reference | Область применения прав (org_unit, project, global). |
| **PolicyRule** | `urn:mg:type:policy_rule` | reference | Системное ограничение. Enforcement конфигурация. |
| **RetentionPolicy** | `urn:mg:type:retention_policy` | reference | Правила удержания и архивации данных. |

---

#### DOMAIN: HUMAN (Человеческий капитал)

| Entity | URN | Class | Назначение |
|--------|-----|-------|------------|
| **Person** | `urn:mg:type:person` | core | Физическое лицо (человек). Идентити-слой. |
| **Employee** | `urn:mg:type:employee` | core | Сотрудник компании. Связан с Person. |
| **ExternalActor** | `urn:mg:type:external_actor` | core | Клиент, партнёр, подрядчик. |
| **AIAgent** | `urn:mg:type:ai_agent` | core | AI-агент как системный актор. |
| **Expert** | `urn:mg:type:expert` | core | Признанный эксперт (связан с Person). |

---

#### DOMAIN: STRUCTURE (Организационная структура)

| Entity | URN | Class | Назначение |
|--------|-----|-------|------------|
| **Organization** | `urn:mg:type:organization` | core | Головная организация / холдинг. |
| **OrgUnitType** | `urn:mg:type:org_unit_type` | reference | Тип подразделения (Department, Squad, Tribe). |
| **OrgUnit** | `urn:mg:type:org_unit` | core | Организационная единица в графе. |
| **OrgRelation** | `urn:mg:type:org_relation` | relation | Связь между OrgUnit (reports_to, collaborates). |
| **StructuralRole** | `urn:mg:type:structural_role` | reference | Роль в структуре (Head, Lead, Member). |
| **Position** | `urn:mg:type:position` | core | Штатная единица в OrgUnit. |

---

#### DOMAIN: FUNCTIONAL (Функциональный домен)

| Entity | URN | Class | Назначение |
|--------|-----|-------|------------|
| **FunctionGroup** | `urn:mg:type:function_group` | reference | Группировка бизнес-функций (домен). |
| **Function** | `urn:mg:type:function` | reference | Атомарная бизнес-функция. |

---

#### DOMAIN: HIERARCHY (Иерархия и статусы)

| Entity | URN | Class | Назначение |
|--------|-----|-------|------------|
| **Status** | `urn:mg:type:status` | reference | Стратегический статус актора (STAR, TOPCHIK). |
| **StatusRule** | `urn:mg:type:status_rule` | reference | Правила перехода между статусами. |
| **Qualification** | `urn:mg:type:qualification` | reference | Область компетенции / навык. |
| **QualificationLevel** | `urn:mg:type:qualification_level` | reference | Уровень владения (Junior, Middle, Senior). |
| **Appointment** | `urn:mg:type:appointment` | relation | Назначение Employee на Position. Temporal. |

---

#### DOMAIN: VALUE (Ценностый продукт — ЦКП)

| Entity | URN | Class | Назначение |
|--------|-----|-------|------------|
| **CPK** | `urn:mg:type:cpk` | core | Ценный Конечный Продукт. |
| **CpkHierarchy** | `urn:mg:type:cpk_hierarchy` | relation | Иерархия продуктов (parent ↔ child). |
| **CpkOwner** | `urn:mg:type:cpk_owner` | relation | Владение CPK (связь CPK ↔ Position). |

---

#### DOMAIN: PROCESS (Процессы и задачи)

| Entity | URN | Class | Назначение |
|--------|-----|-------|------------|
| **TaskType** | `urn:mg:type:task_type` | reference | Классификатор типов задач. |
| **TaskState** | `urn:mg:type:task_state` | reference | Возможные состояния задачи. |
| **Workflow** | `urn:mg:type:workflow` | reference | Определение последовательности операций. |

---

#### DOMAIN: ECONOMY (Внутренняя экономика)

| Entity | URN | Class | Назначение |
|--------|-----|-------|------------|
| **ValueToken** | `urn:mg:type:value_token` | reference | Тип токена / валюты (XP, Gold, Stars). |
| **RewardRule** | `urn:mg:type:reward_rule` | reference | Правило начисления токенов. |
| **PenaltyRule** | `urn:mg:type:penalty_rule` | reference | Правило списания токенов. |

---

#### DOMAIN: KNOWLEDGE (База знаний)

| Entity | URN | Class | Назначение |
|--------|-----|-------|------------|
| **Faculty** | `urn:mg:type:faculty` | reference | Факультет / направление обучения. |
| **Program** | `urn:mg:type:program` | reference | Образовательная программа. |
| **Course** | `urn:mg:type:course` | reference | Учебный курс. |
| **KnowledgeUnit** | `urn:mg:type:knowledge_unit` | reference | Атомарная единица знаний (урок, статья). |
| **Methodology** | `urn:mg:type:methodology` | reference | Стандарт или руководство. |
| **ResearchArtifact** | `urn:mg:type:research_artifact` | reference | Результат исследования. |
| **ContentItem** | `urn:mg:type:content_item` | reference | Общий контент (статья, медиа). |
| **Tag** | `urn:mg:type:tag` | reference | Тег для категоризации. |

---

#### DOMAIN: LEGAL (Юридический блок)

| Entity | URN | Class | Назначение |
|--------|-----|-------|------------|
| **LegalEntity** | `urn:mg:type:legal_entity` | core | Юридическое лицо (ИНН, реквизиты). |
| **Document** | `urn:mg:type:document` | reference | Юридический документ / шаблон. |

---

#### DOMAIN: INTEGRATION (Интеграции)

| Entity | URN | Class | Назначение |
|--------|-----|-------|------------|
| **Integration** | `urn:mg:type:integration` | reference | Конфигурация внешней системы. |
| **Webhook** | `urn:mg:type:webhook` | reference | Webhook endpoint. |
| **DataImport** | `urn:mg:type:data_import` | reference | Профиль импорта данных. |

---

#### META-ENTITIES (Системные мета-сущности)

| Entity | URN | Class | Назначение |
|--------|-----|-------|------------|
| **EntityType** | `urn:mg:entity-type:entity_type:v1` | meta | Определение типа сущности. |
| **AttributeDefinition** | `urn:mg:entity-type:attribute_definition:v1` | meta | Определение атрибута. |
| **RelationshipDefinition** | `urn:mg:entity-type:relationship_definition:v1` | meta | Определение связи. |
| **FsmDefinition** | `urn:mg:entity-type:fsm_definition:v1` | meta | Определение FSM lifecycle. |

---

## 2. REGISTRY ONTOLOGY TABLE v1 (Schema Definitions)

### 2.1 Формат определения

Каждая сущность определяется через:
- **Attributes** — собственные поля сущности
- **Relationships** — связи с другими сущностями

> [!IMPORTANT]
> **Relation-сущности** (class=relation) описываются **ТОЛЬКО через relationships**.  
> Их attributes = [] (пустой массив, кроме системных полей).

---

### 2.2 Базовые атрибуты (наследуются ВСЕМИ сущностями)

| Attribute | Type | Required | Unique | Description |
|-----------|------|----------|--------|-------------|
| `id` | UUID | ✅ | ✅ | Системный идентификатор (auto) |
| `code` | STRING | ✅ | ✅ | Бизнес-код (immutable) |
| `name` | STRING | ✅ | ❌ | Отображаемое название |
| `description` | STRING | ❌ | ❌ | Описание |
| `lifecycle_status` | ENUM | ✅ | ❌ | draft / active / archived |
| `created_at` | DATETIME | ✅ | ❌ | Время создания (auto) |
| `updated_at` | DATETIME | ✅ | ❌ | Время обновления (auto) |
| `created_by` | UUID | ❌ | ❌ | Автор (FK → UserAccount) |

---

### 2.3 Entity Schemas

#### SECURITY

##### Role
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| *(base)* | — | — | — |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| — | — | — | — |

> Чистый reference. Связь с Permission — через RolePermission.

---

##### Permission
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `action` | STRING | ✅ | Действие (view, create, update, delete) |
| `resource` | STRING | ✅ | Ресурс (employee, task, registry) |
| `scope` | STRING | ❌ | Область (own, team, all) |

> [!CAUTION]
> **Semantic Constraints (v1 → v2 Migration Path):**
> - `resource` → планируется перевод в ENUM или FK на reference-сущность в v2
> - `action` → controlled vocabulary: `view`, `create`, `update`, `delete`, `execute`, `admin`
> - Свободный текст в этих полях создаёт технический долг и риск "строкового ада"

---

##### RolePermission (relation)
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| *(base only)* | — | — | — |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `role` | `urn:mg:type:role` | MANY_TO_ONE | ✅ |
| `permission` | `urn:mg:type:permission` | MANY_TO_ONE | ✅ |

---

##### AccessScope
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `scope_type` | ENUM | ✅ | global / org_unit / project / personal |

---

##### PolicyRule
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `rule_type` | STRING | ✅ | Тип правила |
| `enforcement` | ENUM | ✅ | block / warn / log |

---

##### RetentionPolicy
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `retention_days` | INTEGER | ✅ | Срок хранения в днях |
| `action` | ENUM | ✅ | archive / delete |

---

#### HUMAN

##### Person
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `first_name` | STRING | ✅ | Имя |
| `last_name` | STRING | ✅ | Фамилия |
| `middle_name` | STRING | ❌ | Отчество |
| `birth_date` | DATE | ❌ | Дата рождения |

---

##### Employee
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `hire_date` | DATE | ✅ | Дата приёма |
| `termination_date` | DATE | ❌ | Дата увольнения |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `person` | `urn:mg:type:person` | MANY_TO_ONE | ✅ |

---

##### ExternalActor
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `actor_type` | ENUM | ✅ | client / partner / vendor |
| `contact_email` | STRING | ❌ | Email |
| `contact_phone` | STRING | ❌ | Телефон |

---

##### AIAgent
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `agent_type` | STRING | ✅ | Тип агента (advisor, analyzer) |
| `model_id` | STRING | ❌ | ID модели |
| `capabilities` | STRING | ❌ | Возможности (read-only, suggest) |

---

#### STRUCTURE

##### Organization
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `short_name` | STRING | ❌ | Сокращённое название |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `legal_entity` | `urn:mg:type:legal_entity` | MANY_TO_ONE | ❌ |

---

##### OrgUnitType
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `level` | INTEGER | ❌ | Уровень в иерархии |

---

##### OrgUnit
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| *(base)* | — | — | — |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `org_unit_type` | `urn:mg:type:org_unit_type` | MANY_TO_ONE | ✅ |
| `parent` | `urn:mg:type:org_unit` | MANY_TO_ONE | ❌ |
| `organization` | `urn:mg:type:organization` | MANY_TO_ONE | ❌ |

---

##### OrgRelation (relation)
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `relation_type` | ENUM | ✅ | reports_to / collaborates / matrix |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `from_unit` | `urn:mg:type:org_unit` | MANY_TO_ONE | ✅ |
| `to_unit` | `urn:mg:type:org_unit` | MANY_TO_ONE | ✅ |

---

##### Position
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `headcount` | INTEGER | ❌ | Штатные единицы (default: 1) |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `org_unit` | `urn:mg:type:org_unit` | MANY_TO_ONE | ✅ |
| `structural_role` | `urn:mg:type:structural_role` | MANY_TO_ONE | ❌ |

---

#### HIERARCHY

##### Appointment (relation)
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `start_date` | DATE | ✅ | Дата начала |
| `end_date` | DATE | ❌ | Дата окончания |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `position` | `urn:mg:type:position` | MANY_TO_ONE | ✅ |
| `employee` | `urn:mg:type:employee` | MANY_TO_ONE | ✅ |

> [!NOTE]
> Appointment — это **temporal relation**. Имеет временные атрибуты.

---

##### Status
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `priority` | INTEGER | ❌ | Порядок отображения |
| `color` | STRING | ❌ | HEX цвет для UI |

---

##### Qualification
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `category` | STRING | ❌ | Категория навыка |

---

##### QualificationLevel
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `level_order` | INTEGER | ✅ | Порядок уровня |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `qualification` | `urn:mg:type:qualification` | MANY_TO_ONE | ✅ |

---

#### VALUE (ЦКП)

##### CPK
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `value_metrics` | STRING | ❌ | Метрики ценности |

---

##### CpkHierarchy (relation)
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| *(base only)* | — | — | — |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `parent_cpk` | `urn:mg:type:cpk` | MANY_TO_ONE | ✅ |
| `child_cpk` | `urn:mg:type:cpk` | MANY_TO_ONE | ✅ |

---

##### CpkOwner (relation)
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| *(base only)* | — | — | — |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `cpk` | `urn:mg:type:cpk` | MANY_TO_ONE | ✅ |
| `owner_position` | `urn:mg:type:position` | MANY_TO_ONE | ✅ |

---

#### PROCESS

##### TaskType
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `default_priority` | ENUM | ❌ | low / medium / high / urgent |

---

##### TaskState
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `state_order` | INTEGER | ✅ | Порядок состояния |
| `is_final` | BOOLEAN | ✅ | Финальное состояние? |

---

##### Workflow
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `trigger_event` | STRING | ❌ | Событие-триггер |

---

#### ECONOMY

##### ValueToken
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `symbol` | STRING | ✅ | Символ (XP, ★, 💰) |
| `is_transferable` | BOOLEAN | ✅ | Можно передавать? |

---

##### RewardRule
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `trigger_event` | STRING | ✅ | Событие-триггер |
| `amount` | DECIMAL | ✅ | Сумма начисления |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `token` | `urn:mg:type:value_token` | MANY_TO_ONE | ✅ |

---

##### PenaltyRule
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `trigger_event` | STRING | ✅ | Событие-триггер |
| `amount` | DECIMAL | ✅ | Сумма списания |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `token` | `urn:mg:type:value_token` | MANY_TO_ONE | ✅ |

---

#### KNOWLEDGE

##### Faculty
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| *(base)* | — | — | — |

---

##### Program
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `duration_weeks` | INTEGER | ❌ | Длительность в неделях |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `faculty` | `urn:mg:type:faculty` | MANY_TO_ONE | ❌ |

---

##### Course
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `duration_hours` | INTEGER | ❌ | Длительность в часах |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `program` | `urn:mg:type:program` | MANY_TO_ONE | ❌ |

---

##### KnowledgeUnit
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `content_type` | ENUM | ✅ | article / video / quiz |

| Relationship | Target | Cardinality | Required |
|--------------|--------|-------------|----------|
| `course` | `urn:mg:type:course` | MANY_TO_ONE | ❌ |

---

#### LEGAL

##### LegalEntity
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `inn` | STRING | ✅ | ИНН |
| `kpp` | STRING | ❌ | КПП |
| `ogrn` | STRING | ❌ | ОГРН |
| `legal_address` | STRING | ❌ | Юридический адрес |

---

##### Document
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `document_type` | STRING | ✅ | Тип документа |
| `template_urn` | STRING | ❌ | URN шаблона |

---

#### INTEGRATION

##### Integration
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `system_type` | STRING | ✅ | Тип системы |
| `endpoint_url` | STRING | ✅ | URL эндпоинта |
| `auth_type` | ENUM | ✅ | none / api_key / oauth |

---

##### Webhook
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `target_url` | STRING | ✅ | URL для вызова |
| `events` | STRING | ✅ | Список событий (comma-separated) |
| `secret` | STRING | ❌ | Секрет для подписи |

---

##### DataImport
| Attribute | Type | Required | Note |
|-----------|------|----------|------|
| `source_type` | ENUM | ✅ | csv / json / api |
| `mapping_config` | STRING | ❌ | Конфигурация маппинга |

---

## 3. REGISTRY MODELING RULES (Канон)

### Классификация сущностей

| # | Правило |
|---|---------|
| **R1** | **Core-сущность** — бизнес-объект с собственной идентичностью и lifecycle (Person, Employee, CPK). |
| **R2** | **Reference-сущность** — справочник или каталог, используемый другими сущностями (Role, Status, TaskType). |
| **R3** | **Relation-сущность** — связь между двумя+ сущностями. **Не имеет собственных бизнес-атрибутов** (только FK и temporal поля). |
| **R4** | **Event-сущность** — временное событие с timestamp. **INTENTIONALLY EXCLUDED from Registry Ontology v1.** All events are handled outside Registry scope (Event Store, PSEE module). Добавление event-entities в Registry v1 **ЗАПРЕЩЕНО**. |

---

### Правила атрибутов

| # | Правило |
|---|---------|
| **R5** | Каждая сущность ОБЯЗАНА иметь **либо attributes, либо relationships**. Пустых schema не существует. |
| **R6** | Base-поля (`id`, `code`, `name`, `description`, `lifecycle_status`, timestamps) наследуются автоматически и НЕ дублируются в schema. |
| **R7** | `code` — **immutable** после создания. Формат: `^[a-z][a-z0-9_]*$`. |
| **R8** | FK-поля (типа `*_id`) **не описываются как attributes**. Вместо них используются **relationships**. |

---

### Правила отношений

| # | Правило |
|---|---------|
| **R9** | Relation-сущность описывается **ТОЛЬКО через relationships**. `attributes = []`. |
| **R10** | M:N отношения **ВСЕГДА** реализуются через relation-сущность (RolePermission, CpkHierarchy). |
| **R11** | Self-referential связи (parent/child) используют **один relationship** с `target = self`. |
| **R12** | Temporal relations (Appointment) могут иметь `start_date`, `end_date` как исключение из R9. |

---

### Lifecycle правила

| # | Правило |
|---|---------|
| **R13** | Все сущности используют **стандартный FSM**: `draft` → `active` → `archived`. |
| **R14** | Переходы **необратимы**. Rollback запрещён. |
| **R15** | Сущность в `archived` — **только для чтения**, не может быть целью новых relationships. |

---

## 4. IMPLEMENTATION CHECKLIST

### 4.1 Entity Validation

| ✅ | Check | Description |
|----|-------|-------------|
| ☐ | **URN Format** | `urn:mg:type:{entity_name}` для доменных сущностей |
| ☐ | **Class Assigned** | Каждая сущность имеет class: core/reference/relation |
| ☐ | **Schema Non-Empty** | `attributes.length > 0 OR relationships.length > 0` |
| ☐ | **Base Fields Not Duplicated** | `id`, `code`, `name`, etc. не в attributes |
| ☐ | **Relation Has Only Relationships** | Если class=relation → attributes = base only |

---

### 4.2 Attribute Validation

| ✅ | Check | Description |
|----|-------|-------------|
| ☐ | **Type Valid** | STRING, INTEGER, DECIMAL, BOOLEAN, DATE, DATETIME, ENUM |
| ☐ | **Required Marked** | Обязательные поля помечены is_required=true |
| ☐ | **No FK Attributes** | `*_id` поля → relationships, не attributes |
| ☐ | **ENUM Has Options** | Если type=ENUM → есть enum_options |

---

### 4.3 Relationship Validation

| ✅ | Check | Description |
|----|-------|-------------|
| ☐ | **Target Exists** | target_entity_type_urn указывает на существующий entity type |
| ☐ | **Cardinality Valid** | ONE_TO_ONE, ONE_TO_MANY, MANY_TO_ONE, MANY_TO_MANY |
| ☐ | **Required Marked** | Обязательные связи помечены is_required=true |
| ☐ | **No Circular Required** | Нет циклов обязательных relationships |

---

### 4.4 UI Rendering Check

| ✅ | Check | Description |
|----|-------|-------------|
| ☐ | **Label Present** | Каждый attribute/relationship имеет label |
| ☐ | **Description Present** | Опционально, но рекомендуется |
| ☐ | **Order Defined** | Для UI порядок полей определён |
| ☐ | **Visibility Set** | ui_visibility: visible / hidden / system |

---

### 4.5 Graph Integrity Check

| ✅ | Check | Description |
|----|-------|-------------|
| ☐ | **FK Constraints Valid** | ON DELETE RESTRICT для всех relationships |
| ☐ | **No Orphans** | Relation-сущности всегда имеют обе стороны |
| ☐ | **Hierarchy Valid** | Self-refs не создают циклов |

---

### 4.6 Lifecycle Check

| ✅ | Check | Description |
|----|-------|-------------|
| ☐ | **FSM Assigned** | lifecycle_fsm_urn указан для каждого entity type |
| ☐ | **Initial State = draft** | Новые сущности создаются в draft |
| ☐ | **Archived Read-Only** | archived сущности не редактируются |

---

## 5. EXPLICIT v1 LIMITATIONS (Deferred to v2)

> [!IMPORTANT]
> Следующие вопросы **осознанно отложены** до версии v2.  
> Они **НЕ БЛОКИРУЮТ** v1, но требуют решения при расширении системы.

| # | Question | Decision | Impact v1 | Owner | Target Version |
|---|----------|----------|-----------|-------|----------------|
| 1 | **UserAccount vs Person** — Нужна ли связь UserAccount → Person? | DEFERRED | None — они работают независимо | PO | v2 |
| 2 | **Event entities** — Добавление event-сущностей в Registry | EXCLUDED | None — события вне Registry | Architect | v2+ |
| 3 | **Entity Versioning** — Поддержка v1, v2 для сущностей | DEFERRED | None — version=1 для всех | PO | v2 |
| 4 | **Soft Dependencies** — Архивация target при optional relationships | DEFERRED | None — ON DELETE RESTRICT | Architect | v2 |
| 5 | **AI Agent capabilities** — Формализация capabilities в Registry | DEFERRED | None — используем описательный STRING | PO | v2 |

---

## 6. APPENDIX: URN Conventions

```
urn:mg:type:{entity_name}              — Доменная сущность
urn:mg:entity-type:{name}:v{n}         — Мета-тип сущности
urn:mg:attribute:{entity}:{attr}:v{n}  — Определение атрибута
urn:mg:rel:{from}:{to}:{name}:v{n}     — Определение relationship
urn:mg:fsm:{name}:v{n}                 — FSM definition
```

---

**END OF DOCUMENT**
