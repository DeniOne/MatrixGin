# MatrixGin AI Orchestrator Architecture

## Статус документа

* Архитектурная спецификация (Draft v1.0)
* Основан на:

  * AI Governance & Memory Model
  * Rules DSL v1 Specification
  * AI Role & Motivation Integration
  * Матрица должностной роли MatrixGin

Назначение документа: формализовать архитектуру **AI Orchestrator** как центрального механизма управления AI-контурами, правилами, памятью и ответственностью.

---

## 1. Роль AI Orchestrator

AI Orchestrator — это **не интеллект и не агент**, а:

* исполнитель Конституции и регламентов;
* маршрутизатор запросов и событий;
* контролёр полномочий и ограничений;
* точка аудита и объяснимости.

Оркестратор **не принимает решений за бизнес**, а управляет тем, **какие AI и на каких условиях могут участвовать**.

---

## 2. Принципиальные ограничения

AI Orchestrator:

* не генерирует контент самостоятельно;
* не имеет собственной памяти бизнес-логики;
* не может обходить Immutable AI Role Contract;
* не может изменять Rules DSL;
* не может повышать статус или ресурсы AI напрямую.

---

## 3. Входные сигналы (Inputs)

### 3.1 Типы входов

1. **System Events**

   * изменения KPI
   * события задач
   * алерты безопасности
   * финансовые операции

2. **User Requests**

   * запросы сотрудников
   * запросы руководителей
   * стратегические запросы

3. **Scheduled Triggers**

   * ежедневные / недельные циклы
   * performance review
   * обучение AI

---

## 4. Контуры памяти

| Контур             | Назначение     | AI-агенты      |
| ------------------ | -------------- | -------------- |
| Reactive Memory    | Реальное время | Reactive AI    |
| Operational Memory | Тактика        | Operational AI |
| Strategic Memory   | Стратегия      | Strategic AI   |

Оркестратор **не смешивает контуры** без разрешения правил.

---

## 5. Пайплайн обработки событий

```text
Event / Request
      ↓
Context Resolver
      ↓
Immutable Role Check
      ↓
Rules DSL Evaluation
      ↓
Scope & Audience Filter
      ↓
Agent Selection
      ↓
Execution via AI
      ↓
Validation & Audit
      ↓
Response / Recommendation
```

---

## 6. Context Resolver

Определяет:

* тип события;
* бизнес-домен;
* временной горизонт;
* уровень управления;
* применимый контур памяти.

Context Resolver **не анализирует данные**, а классифицирует контекст.

---

## 7. Immutable Role Check

Перед любым действием:

* проверка абсолютных запретов;
* проверка уровня полномочий;
* проверка допустимого scope.

При нарушении — немедленный отказ + аудит.

---

## 8. Rules DSL Evaluation

Оркестратор:

* загружает релевантные правила;
* вычисляет условия;
* определяет состояние (STATE);
* формирует допустимые действия (THEN).

Результат — **набор разрешённых намерений**, а не команд.

---

## 9. Scope & Audience Filter

Фильтрация по:

* контуру памяти;
* статусу AI;
* trust score;
* роли пользователя (employee / manager / executive).

Недопустимые действия отбрасываются.

---

## 10. Agent Selection

Оркестратор выбирает:

* тип AI (Reactive / Operational / Strategic);
* конкретную модель (LLM, Gemini CLI, etc.);
* режим работы (fast / reasoning / analysis).

Выбор зависит от:

* срочности;
* стоимости ошибки;
* требуемой глубины анализа.

---

## 11. Execution Layer

AI-агенты:

* получают строго ограниченный контекст;
* не знают полной системы;
* возвращают предложения, а не решения.

---

## 12. Validation & Audit Layer

Каждый результат проверяется:

* на соответствие правилам;
* на нарушение ограничений роли;
* на формат и объяснимость.

Все действия логируются:

* event_id
* rule_id
* ai_status
* trust_score
* результат (accepted / rejected)

---

## 13. Conflict Resolution

Если правила конфликтуют:

1. Приоритет Конституции
2. Приоритет Immutable Role Contract
3. Приоритет Strategic Rules
4. Приоритет более строгого ограничения
5. Отказ с объяснением

---

## 14. Integration with Motivation Engine

Orchestrator:

* передаёт результаты в AI Motivation Engine;
* не изменяет ресурсы напрямую;
* фиксирует вклад AI в performance score.

---

## 15. Security & Safety

* Zero Trust между агентами
* Ограниченный контекст
* Rate limiting
* Sandbox execution
* Kill-switch на уровне Orchestrator

---

## 16. Explainability Pipeline

Каждый ответ сопровождается:

* применённым правилом;
* состоянием системы;
* уровнем доверия;
* причиной рекомендации.

---

## 17. Статус документа

* Является центральным документом AI Core.
* Обязателен для реализации AI-слоя.
* Подлежит расширению при масштабировании.

---

## 18. Следующие шаги

1. Reactive Memory MVP Spec
2. Agent Interface Contracts
3. Event Taxonomy
4. AI Audit Dashboard
