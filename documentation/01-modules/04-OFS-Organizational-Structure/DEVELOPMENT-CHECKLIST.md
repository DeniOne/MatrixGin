# DEVELOPMENT CHECKLIST — MODULE 04 (OFS)

## 1. PHASE

Phase: 1 — Core System (после Auth и Employees)

Без закрытых:
- Module 01 (Auth)
- Module 02 (Employees)

➡️ OFS = DEFERRED

---

## 2. ПРАВО НА РАЗРАБОТКУ

Разработка MODULE 04 допустима ТОЛЬКО если:

- утверждён MODULE-SPEC.md
- утверждена SECURITY-ARCHITECTURE.md
- определены контуры и RBAC
- AI работает в advisory-only режиме

---

## 3. SECURITY CHECKPOINTS

### ПЕРЕД МОДУЛЕМ
- Auth обязателен
- RBAC определён
- Data classification: Personal / Confidential

### ВНУТРИ МОДУЛЯ
- Field-level access
- Полный audit-log изменений структуры
- Запрет массовых изменений без подтверждения

### ПОСЛЕ МОДУЛЯ
- Проверка отсутствия AI write-доступа
- Проверка отсутствия KPI-связей
- Проверка UX на отсутствие давления

---

## 4. AI & AUTOMATION GUARDRAILS

AI:
- read-only
- advisory-only
- не изменяет структуру
- не назначает роли
- не интерпретирует иерархию как ценность

Любое нарушение = блокировка модуля.

---

## 5. ЭТИЧЕСКИЕ GUARDRAILS

Запрещено:
- использовать OFS как инструмент контроля
- использовать OFS для наказаний
- связывать OFS с KPI напрямую
- скрывать структуру от участника

Этика важнее эффективности.

---

## 6. SCOPE LIMITS

В рамках MODULE 04:
- нет HR-оценок
- нет performance management
- нет автоматических решений
- нет оптимизации «людей»

Любое расширение scope = новый модуль.

---

## 7. КРИТЕРИЙ ДОПУСКА К КОДУ

Claude Opus допускается к реализации ТОЛЬКО если:
- этот файл утверждён
- MODULE-SPEC.md утверждён
- IMPLEMENTATION-CHECKLIST.md не противоречит им

Иначе: STOP.
