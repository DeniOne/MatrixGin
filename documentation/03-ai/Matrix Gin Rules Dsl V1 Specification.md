# MatrixGin Rules DSL v1 Specification

## Статус документа

* Архитектурная спецификация (Draft v1.0)
* Основан на: AI Governance & Memory Model, Внутренняя Конституция Фотоматрицы v3.0
* Назначение: формализация «Состояний существования» и «Формул» в машинно-читаемый вид

---

## 1. Назначение Rules DSL

Rules DSL — это декларативный язык правил MatrixGin, предназначенный для:

* формализации управленческой логики;
* ограничения действий AI;
* обеспечения объяснимости решений;
* связи KPI, состояний и допустимых действий.

Rules DSL **не является языком программирования**, а языком управления.

---

## 2. Базовые сущности DSL

### 2.1 Condition (Условие)

Условие — логическое выражение, вычисляемое на основе данных памяти.

Примеры источников:

* KPI
* состояния задач
* временные параметры
* роли и уровни доступа

---

### 2.2 State (Состояние существования)

Состояние — агрегированная оценка ситуации.

Базовый перечень (v1):

* PROSPERITY (Процветание)
* NORMAL (Нормальная работа)
* WARNING (Чрезвычайное положение)
* INACTIVITY (Бездействие)
* CRISIS (Авария)

Состояние **не является действием**.

---

### 2.3 Formula (Формула действий)

Формула — предопределённый набор допустимых реакций.

Формула всегда:

* привязана к состоянию;
* ограничена по правам;
* не выполняется автоматически без разрешений.

---

## 3. Общий синтаксис Rules DSL

```dsl
RULE <rule_name>:
  WHEN <conditions>
  STATE <state>
  THEN <formula>
  WITH:
    scope: <reactive | operational | strategic>
    audience: <employee | manager | executive>
    permissions:
      - notify
      - recommend
      - escalate
```

---

## 4. Условия (WHEN)

### 4.1 Пример

```dsl
WHEN:
  department.kpi < 80%
  FOR 3 days
  AND task.overdue_count > 5
```

Допустимые операторы:

* <, >, <=, >=, ==
* AND / OR
* FOR (временное окно)

---

## 5. Состояния (STATE)

### 5.1 Пример

```dsl
STATE WARNING
```

Состояние используется:

* для визуализации;
* для выбора формулы;
* для эскалации.

---

## 6. Формулы (THEN)

### 6.1 Пример

```dsl
THEN:
  notify.manager
  recommend.load_rebalance
  suggest.training
```

Типы действий:

* notify.* — уведомление
* recommend.* — рекомендация
* suggest.* — подсказка
* escalate.* — эскалация

---

## 7. Scope (Контур памяти)

```dsl
scope: reactive
```

Допустимые значения:

* reactive
* operational
* strategic

Ограничение:

* правило не может обращаться к данным выше своего scope.

---

## 8. Audience (Кому адресовано)

```dsl
audience: manager
```

Значения:

* employee
* manager
* executive

Audience определяет:

* форму подачи;
* уровень детализации;
* допустимые действия.

---

## 9. Permissions (Ограничения AI)

```dsl
permissions:
  - notify
  - recommend
```

AI **не может** выполнять действия, не перечисленные в permissions.

---

## 10. Пример полного правила

```dsl
RULE Department_Performance_Warning:
  WHEN:
    department.kpi < 80%
    FOR 3 days
  STATE WARNING
  THEN:
    notify.manager
    recommend.load_rebalance
  WITH:
    scope: operational
    audience: manager
    permissions:
      - notify
      - recommend
```

---

## 11. Принципы безопасности

* AI не выполняет irreversible actions;
* AI не изменяет правила;
* AI всегда указывает причину (rule_id).

---

## 12. Статус документа

* DSL v1 фиксирует минимально необходимый набор.
* Расширения (v1.1+):

  * приоритеты правил;
  * цепочки формул;
  * симуляции.

---

## 13. Следующий документ

AI Orchestrator Architecture
