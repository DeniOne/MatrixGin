MatrixGin — Enterprise Registry / Metadata Platform

Статус: CANONICAL
Версия: v3
Уровень: Phase A — Foundation
Назначение: архитектурный закон Registry

1. Назначение Registry

MatrixGin Registry — это Enterprise Metadata Platform (MDM), а не справочник.

Registry является:

единственным источником правды (SSOT)

системой управления смыслами, структурами и изменениями

фундаментом для OFS, Analytics, Economy, University, Security

Registry НЕ:

CRUD-админка

конфигурационный файл

UI-ориентированная сущность

2. Архитектурные уровни Registry
Level 0 — Storage Foundation

SQL / NewSQL — транзакционная истина

Append-only events — аудит

Graph / ltree — иерархии

Read-model — CQRS

Level 1 — Semantic Core (CRITICAL)

Metamodel (Schema Registry)

Global URN / Semantic IDs

FSM как данные

Constraint DAG

Immutable audit

Level 2 — Intelligence (Phase B)

Validation / Policy Engine

Impact Analysis

Dedup / Merge

3. Ключевой принцип

Registry описывает не данные —
Registry описывает, какими МОГУТ БЫТЬ данные.

4. Core Objects (Metamodel)

Registry самоописываемый.
Все сущности ниже — данные Registry, а не код.

🧠 METAMODEL — JSON SCHEMAS (CANONICAL)
4.1 entity_type
Назначение

Описывает тип сущности, допустимый в системе.

JSON Schema
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "urn:mg:schema:entity_type:v1",
  "type": "object",
  "required": ["urn", "name", "version", "lifecycle_fsm_urn"],
  "properties": {
    "urn": {
      "type": "string",
      "pattern": "^urn:mg:entity-type:[a-z0-9-]+(:v[0-9]+)?$"
    },
    "name": {
      "type": "string",
      "description": "Logical name of entity type"
    },
    "version": {
      "type": "integer",
      "minimum": 1
    },
    "description": {
      "type": "string"
    },
    "is_abstract": {
      "type": "boolean",
      "default": false
    },
    "is_system": {
      "type": "boolean",
      "default": false
    },
    "lifecycle_fsm_urn": {
      "type": "string",
      "pattern": "^urn:mg:fsm:[a-z0-9-]+(:v[0-9]+)?$"
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "archived_at": {
      "type": ["string", "null"],
      "format": "date-time"
    }
  }
}

Инварианты

entity_type не удаляется

изменение = новая версия

URN неизменяем

4.2 attribute_definition
Назначение

Описывает атрибут сущности (как данные).

JSON Schema
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "urn:mg:schema:attribute_definition:v1",
  "type": "object",
  "required": ["entity_type_urn", "name", "data_type"],
  "properties": {
    "entity_type_urn": {
      "type": "string",
      "pattern": "^urn:mg:entity-type:"
    },
    "name": {
      "type": "string",
      "pattern": "^[a-z][a-z0-9_]*$"
    },
    "data_type": {
      "type": "string",
      "enum": [
        "string",
        "integer",
        "boolean",
        "decimal",
        "date",
        "datetime",
        "json",
        "urn",
        "reference"
      ]
    },
    "is_required": {
      "type": "boolean",
      "default": false
    },
    "is_multivalue": {
      "type": "boolean",
      "default": false
    },
    "is_indexed": {
      "type": "boolean",
      "default": false
    },
    "constraints": {
      "type": "object",
      "description": "Validation constraints (regex, enum, range, etc.)"
    },
    "ui_visibility": {
      "type": "string",
      "enum": ["visible", "hidden", "system"],
      "default": "visible"
    },
    "valid_from": {
      "type": "string",
      "format": "date-time"
    },
    "valid_to": {
      "type": ["string", "null"],
      "format": "date-time"
    }
  }
}

Инварианты

атрибут не обязателен быть полем БД

удаление запрещено → только valid_to

изменение типа = новая версия entity_type

4.3 fsm_definition
Назначение

Определяет lifecycle сущности декларативно.

FSM — данные, не код.

JSON Schema
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "urn:mg:schema:fsm_definition:v1",
  "type": "object",
  "required": ["urn", "entity_type_urn", "initial_state", "states", "transitions"],
  "properties": {
    "urn": {
      "type": "string",
      "pattern": "^urn:mg:fsm:[a-z0-9-]+(:v[0-9]+)?$"
    },
    "entity_type_urn": {
      "type": "string",
      "pattern": "^urn:mg:entity-type:"
    },
    "initial_state": {
      "type": "string"
    },
    "states": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1
    },
    "transitions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["from", "to"],
        "properties": {
          "from": { "type": "string" },
          "to": { "type": "string" },
          "roles_allowed": {
            "type": "array",
            "items": { "type": "string" }
          },
          "conditions": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      }
    },
    "is_system": {
      "type": "boolean",
      "default": false
    }
  }
}

Инварианты

обход FSM запрещён

rollback невозможен

transition = событие (audit)

5. Глобальные законы Registry

❌ Delete запрещён
❌ Циклы запрещены
❌ Изменения без версии запрещены
❌ Данные вне Metamodel запрещены

✅ Всё имеет URN
✅ Всё имеет lifecycle
✅ Всё воспроизводимо во времени

6. Минимальный bootstrap (следующий шаг)

Registry начинается с описания самого себя:

entity_type: entity_type

entity_type: attribute_definition

entity_type: fsm_definition

fsm: default-registry-lifecycle

📌 Статус

REGISTRY-ARCHITECTURE-v3.md — ЗАФИКСИРОВАН