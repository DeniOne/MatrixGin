# AI Core Implementation Execution Plan v1.0

## Статус документа

* Тип: Execution Blueprint / Anti-Breakage Plan
* Версия: v1.0
* Аудитория: solo‑developer (вайбкодер), архитектурное сопровождение
* Цель: внедрение AI Core MatrixGin **без архитектурных поломок**

---

## 0. Базовый принцип (фиксируем сразу)

> **Ни один следующий шаг не начинается, пока предыдущий не закрыт по чеклисту и тестам.**

Этот документ имеет приоритет над:

* скоростью разработки;
* желанием «оживить» систему;
* рефакторингом на ходу.

---

## 1. Глобальные запреты (Anti‑Pattern Guard)

❌ Запрещено:

* прямое общение AI‑агентов между собой;
* логика в контроллерах;
* хардкод бизнес‑решений;
* доступ агента к БД напрямую;
* «временные» костыли без тестов;
* рефакторинг без обновления чеклистов.

---

## 2. Фазы внедрения (строгая последовательность)

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4
```

Пропуск фаз запрещён.

---

## PHASE 0 — Архитектурная фиксация (DONE)

### Цель

Зафиксировать архитектуру так, чтобы она **не менялась при кодинге**.

### Статус

✅ Выполнено:

* AI Governance & Memory Model
* Rules DSL v1
* AI Role & Motivation Integration
* AI Orchestrator Architecture

### Gate 0 (разрешение на код)

☑ Все документы существуют
☑ Нет противоречий между ними
☑ Приняты как «закон системы»

---

## PHASE 1 — Контракты (САМАЯ ВАЖНАЯ ФАЗА)

### Цель

Создать **невидимый каркас**, который нельзя сломать случайно.

### 1.1 Agent Interface Contract

Определить **ЕДИНЫЙ** интерфейс агента:

```ts
interface AIAgent {
  id: string
  type: 'reactive' | 'operational' | 'strategic'
  allowedScopes: Scope[]

  execute(input: AgentInput): AgentOutput
}
```

❗ Реализация запрещена — только контракт.

---

### 1.2 Rule Evaluation Contract

```ts
interface RuleEvaluationResult {
  ruleId: string
  state: SystemState
  allowedIntents: Intent[]
}
```

---

### 1.3 Orchestrator Boundary Contract

```ts
interface Orchestrator {
  handleEvent(event: SystemEvent): OrchestratorResult
}
```

---

### Phase‑1 Checklist (BLOCKING)

☐ Контракты существуют в коде
☐ Нет логики внутри контрактов
☐ Контракты не ссылаются друг на друга напрямую
☐ Добавлены type‑tests (tsd / zod)

❌ Если хоть один пункт не закрыт — **дальше нельзя**

---

## PHASE 2 — Orchestrator Skeleton (БЕЗ ИНТЕЛЛЕКТА)

### Цель

Сделать Orchestrator как **пустой, но жёсткий каркас**.

### Что реализуем

* вход событий
* pipeline шагов (stub)
* audit logging

### Что запрещено

❌ AI‑вызовы
❌ Rules execution
❌ доступ к памяти

---

### Phase‑2 Checklist

☐ Orchestrator принимает события
☐ Все шаги пайплайна существуют как функции
☐ Каждый шаг логируется
☐ Есть unit‑тесты пайплайна
☐ AI вообще не подключён

---

## PHASE 3 — Rules Engine (Read‑Only)

### Цель

Научить систему **читать правила**, не выполнять действия.

### Реализация

* парсер Rules DSL
* RuleEvaluationResult
* NEGATIVE tests (запрещённые действия)

---

### Phase‑3 Checklist

☐ Правила парсятся
☐ Ошибочные правила падают
☐ Запрещённые действия блокируются
☐ Нет side‑effects

---

## PHASE 4 — Reactive Memory ONLY

### Цель

Оживить систему **без риска каскадных поломок**.

### Ограничения

* только Reactive scope
* только notify / recommend
* только read‑only данные

---

### Phase‑4 Checklist

☐ Только Reactive Agent подключён
☐ Контекст ограничен
☐ Есть kill‑switch
☐ Есть latency‑тесты
☐ Есть audit trail

---

## 3. Обязательные тест‑гейты

Перед переходом между фазами:

| Тип теста            | Обязателен |
| -------------------- | ---------- |
| Contract tests       | ✅          |
| Forbidden‑path tests | ✅          |
| Permission tests     | ✅          |
| Regression tests     | ✅          |

---

## 4. Правило вайбкодера (личное, но важное)

> **Если хочется «чуть‑чуть упростить» — значит архитектура ещё не готова.**

---

## 5. Критерий успеха

Ты можешь:

* добавлять новые контуры
* менять модели
* экспериментировать

…и система **не ломается**.

---

## 6. Следующий документ

