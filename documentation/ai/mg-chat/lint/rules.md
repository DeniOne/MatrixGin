# MG Chat Lint Rules

Канонические правила линтинга для контрактов MG Chat.

## Уровни проверки

| Уровень | Что проверяется | Инструмент |
|---------|-----------------|------------|
| JSON | синтаксис, trailing commas | JSON.parse |
| Schema | обязательные поля, типы, форматы | AJV |
| Cross-refs | intent ↔ action ↔ component | custom |
| UX | лимиты Telegram | custom |
| Architecture | запреты на auto-actions | custom |

---

## Rule 1: Schema Compliance

Каждый JSON файл должен соответствовать своей схеме:

- `mg_intent_map.json` → `schemas/intent.schema.json`
- `mg_ux_components_map.json` → `schemas/ux_components.schema.json`
- `error_ux_map.json` → `schemas/error_ux.schema.json`

### Обязательные поля

**Intent Map:**
- `version`, `agent`, `intents`
- Каждый intent: `id`, `category`, `response`

**UX Components:**
- `version`, `platform`, `render_rules`, `components`
- Каждый component: `type`, `layout`

**Error UX:**
- `version`, `agent`, `platform`, `principles`, `error_intents`
- Каждый error_intent: `id`, `trigger`, `severity`, `response`

---

## Rule 2: Cross-Reference Integrity

Каждый `action_id` должен ссылаться на существующий:
- Intent ID
- Component ID
- Error Intent ID

```
❌ Ошибка: Unknown action_id: "nonexistent_action"
```

---

## Rule 3: Telegram UX Limits

| Ограничение | Значение |
|-------------|----------|
| Максимум рядов кнопок | 3 |
| Максимум кнопок в ряду | 2 |
| Максимум символов в кнопке | 64 |

```
❌ Ошибка: Component "x" exceeds max rows (4 > 3)
```

---

## Rule 4: Danger Action Confirmation

Кнопки со `style: "danger"` должны указывать на intent с `confirmation_required: true`.

```
❌ Ошибка: Danger button "Удалить" points to intent without confirmation_required
```

---

## Rule 5: No Auto-Mutations

Запрещённые паттерны в именах intent и action:

```
delete, fire, assign, pay, transfer,
approve_auto, reject_auto, execute, run
```

AI только рекомендует. Человек подтверждает.

```
❌ Ошибка: Intent "auto_fire_employee" contains forbidden pattern: "fire"
```

---

## Rule 6: Architectural Principles

Принцип | Значение | Проверка
--------|----------|----------
`ai_role` | `advisory_only` | Schema const
`no_auto_actions` | `true` | Schema const
`human_confirmation_required` | `true` | Schema const
`no_shaming` | `true` | Schema const
`never_block_user` | `true` | Schema const

---

## Запуск линтера

```bash
# Из корня проекта
npm run lint:mg-chat

# Или напрямую
node documentation/ai/mg-chat/lint/mg-chat.lint.js
```

---

## CI Integration

```yaml
# .github/workflows/lint.yml
- name: Lint MG Chat Contracts
  run: npm run lint:mg-chat
```

Если линтер не проходит — PR нельзя мёрджить.

---

## IDE Integration (VS Code)

1. Установить расширение: `JSON Schema`
2. Добавить в `.vscode/settings.json`:

```json
{
  "json.schemas": [
    {
      "fileMatch": ["**/mg-chat/mg_intent_map.json"],
      "url": "./documentation/ai/mg-chat/schemas/intent.schema.json"
    },
    {
      "fileMatch": ["**/mg-chat/mg_ux_components_map.json"],
      "url": "./documentation/ai/mg-chat/schemas/ux_components.schema.json"
    },
    {
      "fileMatch": ["**/mg-chat/error_ux_map.json"],
      "url": "./documentation/ai/mg-chat/schemas/error_ux.schema.json"
    }
  ]
}
```

Ошибки будут подсвечиваться прямо в редакторе.
