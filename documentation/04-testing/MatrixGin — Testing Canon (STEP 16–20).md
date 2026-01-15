# MatrixGin — Testing Canon (STEP 16–20)

## Purpose

Этот документ фиксирует **обязательный тестовый канон** для MatrixGin после реализации:

* STEP 16 — Visibility
* STEP 17 — Enforcement & Determinism
* STEP 18 — Observability
* STEP 19 — Policy Simulation
* STEP 20 — Universal Form Template

Цель тестирования:

* доказать корректность архитектуры,
* исключить регресс,
* подтвердить, что UI остаётся dumb renderer,
* подтвердить, что Registry и Impact — единственный источник решений.

Документ используется как:

* чеклист ручного тестирования,
* основа для e2e / integration тестов,
* критерий приёмки изменений.

---

## 1. TESTING PRINCIPLES (НЕ НАРУШАТЬ)

* Тестируем **поведение системы**, не UI детали
* UI считается корректным, если он строго повторяет backend projection
* Отсутствие поля = корректное поведение
* Любая ошибка должна быть:

  * детерминированной
  * воспроизводимой
  * fail-closed

---

## 2. STEP 16 — VISIBILITY TESTS

### 2.1 Attribute Visibility

**Scenario:** поле скрыто правилом visibility

* Action: GET `/entities/:urn`
* Expected:

  * поле отсутствует в JSON
  * UI не рендерит поле

### 2.2 Entity Visibility (404)

**Scenario:** сущность скрыта

* Action: GET `/entities/:urn`
* Expected:

  * HTTP 404
  * одинаковый ответ для "не существует" и "скрыто"

### 2.3 View Visibility (403)

**Scenario:** history / graph view запрещён

* Action: GET `/entities/:urn/history`
* Expected:

  * HTTP 403

---

## 3. STEP 17 — ENFORCEMENT & SAFETY TESTS

### 3.1 Authorization ≠ Visibility

**Scenario:** пользователь видит, но не может изменить

* Action: POST `/bulk/commit`
* Expected:

  * BLOCKING или auth deny
  * visibility не влияет на решение

### 3.2 Impact Visibility Blindness

**Scenario:** скрытая связь участвует в impact

* Action: DELETE entity A
* Expected:

  * Impact Analysis обнаруживает зависимость
  * возвращает BLOCKING

### 3.3 Fail-Closed Registry

**Scenario:** некорректное visibility правило

* Action: старт приложения
* Expected:

  * приложение не стартует

---

## 4. STEP 18 — GOVERNANCE OBSERVABILITY TESTS

### 4.1 Snapshot Integrity

* Action: GET `/governance/snapshot`
* Expected:

  * возвращаются активные Registry rules
  * есть version + timestamp

### 4.2 Projection Inspector

* Action: GET `/governance/projection-map`
* Expected:

  * списки visible / hidden полей
  * никаких объяснений

---

## 5. STEP 19 — POLICY SIMULATION TESTS

### 5.1 In-Memory Simulation

**Scenario:** симуляция скрытия поля

* Action: POST `/governance/simulate`
* Expected:

  * diff показывает removed field
  * live entity остаётся без изменений

### 5.2 No Runtime Side Effects

* Action: после simulation вызвать GET `/entities/:urn`
* Expected:

  * данные не изменились

---

## 6. STEP 20 — UNIVERSAL FORM TESTS

### 6.1 Create Mode

* Action: GET `/entities/form-projection?mode=CREATE&type=X`
* Expected:

  * пустые поля
  * widget = INPUT

### 6.2 Edit Mode

* Action: GET `/entities/form-projection?mode=EDIT&urn=...`
* Expected:

  * данные присутствуют
  * is_editable=false → STATIC_TEXT

### 6.3 View Mode

* Action: GET `/entities/form-projection?mode=VIEW&urn=...`
* Expected:

  * только STATIC_TEXT
  * отсутствие input элементов

### 6.4 Hidden Fields

* Expected:

  * скрытых полей нет в FormProjection

---

## 7. REGRESSION TESTS (ОБЯЗАТЕЛЬНО)

* Добавить новое поле в Registry

  * UI отображает без кода
* Изменить visibility rule

  * UI автоматически меняется
* Добавить новую сущность

  * форма работает без UI изменений

---

## 8. ACCEPTANCE CRITERIA

Тестирование считается успешным, если:

* все сценарии воспроизводимы
* нет UI-логики
* нет расхождения backend ↔ UI
* Impact и Registry всегда главные

---

# Этот документ обязателен к выполнению перед любыми UI-изменениями.
