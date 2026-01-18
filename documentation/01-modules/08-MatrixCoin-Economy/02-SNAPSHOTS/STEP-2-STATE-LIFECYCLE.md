# STEP-2-STATE-LIFECYCLE.md
## Module 08 — MatrixCoin-Economy

**Статус документа:** CANONICAL / APPROVED  
**MPP-фаза:** Step 2 — State & Lifecycle  
**Дата утверждения:** 2026-01-17  
**Изменение документа:** только через новый MPP-цикл  

---

## 0. Назначение документа

Данный документ фиксирует **канонические правила** жизненного цикла и состояний для:
- MC (Matrix Coin) — операционная поведенческая единица
- GMC (Golden Matrix Coin) — стратегический статусный актив признания

Этот документ **НЕ** содержит:
- код
- диаграммы
- формулы
- UX спецификации
- оптимизационные стратегии

Любое нарушение правил этого документа = **BLOCKED**.

---

## 1. MC LIFECYCLE MAP

### 1.1 MC States

| State | Описание | Terminal? |
|-------|----------|-----------|
| `ACTIVE` | MC активен, доступен для операций (spend, freeze, transfer) | Нет |
| `FROZEN` | MC заморожен в Safe, недоступен для spend/transfer | Нет |
| `EXPIRED` | MC истёк по времени (естественный процесс, НЕ наказание) | **Да** |
| `SPENT` | MC использован (Store, Auction, Transfer) | **Да** |

---

### 1.2 Allowed Transitions

#### Transition: `ACTIVE → FROZEN`

**Trigger:** Явное человеческое действие — пользователь замораживает MC в Safe

**Invariants:**
- MC должен быть в состоянии `ACTIVE`
- MC не должен быть истёкшим (`expiresAt > now`)
- Действие инициировано владельцем MC или уполномоченным лицом
- Операция логируется с `actor_id` и `timestamp`

**Forbidden:**
- ❌ Автоматическая заморозка (cron, trigger)
- ❌ AI-initiated freeze
- ❌ Заморозка уже истёкших MC
- ❌ Заморозка чужих MC без полномочий

---

#### Transition: `FROZEN → ACTIVE`

**Trigger:** Явное человеческое действие — пользователь размораживает MC из Safe

**Invariants:**
- MC должен быть в состоянии `FROZEN`
- MC не должен быть истёкшим (`expiresAt > now`)
- Действие инициировано владельцем MC или уполномоченным лицом
- Операция логируется с `actor_id` и `timestamp`

**Forbidden:**
- ❌ Автоматическая разморозка
- ❌ AI-initiated unfreeze
- ❌ Разморозка MC, владелец которого другой пользователь

---

#### Transition: `ACTIVE → EXPIRED`

**Trigger:** Явное человеческое действие — уполномоченный оператор отмечает MC как истёкшие

**Invariants:**
- MC должен быть в состоянии `ACTIVE`
- `expiresAt <= now` (срок истёк)
- Действие выполняется человеком-оператором, НЕ cron-job
- Операция логируется как `EXPIRE` с причиной `NATURAL_DECAY`
- Экспирация НЕ является наказанием — это естественный элемент временной ценности участия

**Forbidden:**
- ❌ Cron-job автоматической экспирации
- ❌ AI-initiated expiration
- ❌ Экспирация MC, срок которых не истёк
- ❌ Экспирация замороженных MC без отдельного перехода

---

#### Transition: `FROZEN → EXPIRED`

**Trigger:** Явное человеческое действие — уполномоченный оператор отмечает замороженные MC как истёкшие

**Invariants:**
- MC должен быть в состоянии `FROZEN`
- `expiresAt <= now` (срок истёк)
- Safe **НЕ защищает** от истечения срока (каноническое решение)
- Действие выполняется человеком-оператором
- Операция логируется

**Forbidden:**
- ❌ Автоматическая экспирация
- ❌ Предположение что Safe = бессмертие MC

---

#### Transition: `ACTIVE → SPENT`

**Trigger:** Явное человеческое действие — пользователь использует MC (Store, Auction, Transfer)

**Invariants:**
- MC должен быть в состоянии `ACTIVE`
- MC не должен быть истёкшим (`expiresAt > now`)
- Количество spend ≤ доступного количества MC
- Действие инициировано владельцем MC
- Операция логируется с целью использования (`spend_target`)
- `SPENT` — терминальное состояние, возврат невозможен

**Forbidden:**
- ❌ Spend замороженных MC (сначала разморозить)
- ❌ Spend истёкших MC
- ❌ AI-initiated spend
- ❌ Автоматический spend (subscriptions, auto-buy)

---

#### Transition: `FROZEN → SPENT`

**Status:** ЗАПРЕЩЁН

Прямой переход из `FROZEN` в `SPENT` **не допускается**.

Требуется: `FROZEN → ACTIVE → SPENT`

---

### 1.3 GMC State (Static Holder)

GMC **НЕ имеет lifecycle transitions**.

| Аспект | Значение |
|--------|----------|
| State | Единственное: `RECOGNIZED` (существует) |
| Decay | ❌ Отсутствует |
| Spend | ❌ Запрещён |
| Transfer | ❌ Запрещён |
| Expiration | ❌ Отсутствует (GMC бессмертен) |

GMC создаётся один раз человеком и существует неизменным.

---

## 2. STATE INVARIANTS

### 2.1 MC Structural Invariants

| ID | Инвариант | Нарушение = |
|----|-----------|-------------|
| MC-INV-001 | Каждый MC обязан иметь `expiresAt` | Архитектурная ошибка |
| MC-INV-002 | `expiresAt` > `issuedAt` | Невалидное состояние |
| MC-INV-003 | `amount` > 0 | Невалидное состояние |
| MC-INV-004 | `userId` обязателен и неизменен | Нарушение ownership |
| MC-INV-005 | `sourceType` ∈ {MANUAL_GRANT, EVENT_PARTICIPATION, PEER_TRANSFER} | Недопустимый источник |

### 2.2 MC Lifecycle Invariants

| ID | Инвариант | Нарушение = |
|----|-----------|-------------|
| MC-INV-010 | MC в состоянии `SPENT` или `EXPIRED` не может изменять состояние | Нарушение терминальности |
| MC-INV-011 | MC не может перейти из `FROZEN` в `SPENT` напрямую | Нарушение workflow |
| MC-INV-012 | MC не может быть в двух состояниях одновременно | Нарушение FSM |
| MC-INV-013 | Каждое изменение состояния обязано быть залогировано | Нарушение аудита |

### 2.3 MC Prohibition Invariants

| ID | Инвариант | Нарушение = |
|----|-----------|-------------|
| MC-INV-020 | MC не создаётся автоматически (cron, trigger, AI) | BLOCKED |
| MC-INV-021 | MC не изменяет состояние автоматически | BLOCKED |
| MC-INV-022 | AI не может инициировать операции с MC | BLOCKED |
| MC-INV-023 | MC не имеет денежного эквивалента | Архитектурная ошибка |
| MC-INV-024 | MC не используется для расчёта KPI | BLOCKED |

### 2.4 MC Safe & Split Invariants (Канонические решения)

| ID | Инвариант | Нарушение = |
|----|-----------|-------------|
| MC-INV-030 | Safe не продлевает `expiresAt` — MC в состоянии `FROZEN` продолжает отсчёт TTL | Нарушение канона |
| MC-INV-031 | Split MC-записи обязан сохранять `issuedAt`, `sourceType`, `sourceId` оригинала | Нарушение целостности |
| MC-INV-032 | Split логируется как событие `MC_SPLIT` с ссылкой на parent record | Нарушение аудита |
| MC-INV-033 | Batch-операции обязаны создавать per-MC audit trail | Нарушение аудита |

### 2.5 MC Invalid State Conditions

MC считается **INVALID** если:
- `expiresAt` отсутствует или ≤ `issuedAt`
- `lifecycleState` = null или неизвестное значение
- `userId` отсутствует
- `amount` ≤ 0
- `sourceType` содержит AI или SYSTEM источник
- Отсутствует audit record для создания

---

### 2.6 GMC Structural Invariants

| ID | Инвариант | Нарушение = |
|----|-----------|-------------|
| GMC-INV-001 | GMC обязан иметь `recognizedBy` (человек) | Архитектурная ошибка |
| GMC-INV-002 | `recognizedBy` НИКОГДА не может быть AI/System | **ABSOLUTE BLOCK** |
| GMC-INV-003 | `justification` обязательно, минимум 50 символов | Невалидное признание |
| GMC-INV-004 | `amount` > 0 | Невалидное состояние |
| GMC-INV-005 | `category` ∈ допустимых категорий | Невалидная категория |

### 2.7 GMC Immutability Invariants

| ID | Инвариант | Нарушение = |
|----|-----------|-------------|
| GMC-INV-010 | GMC после создания **не изменяется** | Нарушение immutability |
| GMC-INV-011 | GMC **не списывается** | Нарушение immutability |
| GMC-INV-012 | GMC **не передаётся** | Нарушение immutability |
| GMC-INV-013 | GMC **не истекает** | Нарушение immutability |

### 2.8 GMC Prohibition Invariants

| ID | Инвариант | Нарушение = |
|----|-----------|-------------|
| GMC-INV-020 | GMC не фармится | BLOCKED |
| GMC-INV-021 | GMC не автоматизируется | BLOCKED |
| GMC-INV-022 | GMC не конвертируется в деньги | BLOCKED |
| GMC-INV-023 | GMC не используется как награда/бонус | BLOCKED |

---

## 3. EDGE CASES & SAFETY

### 3.1 Expiration Edge Cases

#### EC-EXP-001: MC истекает во время операции spend

**Сценарий:** Пользователь начинает spend операцию, но MC истекает между валидацией и commit.

**Правило:** Проверка `expiresAt > now` обязана выполняться:
1. При начале операции (pre-validation)
2. При commit операции (final-validation)

Если MC истёк между проверками — операция отклоняется, MC переходит в `EXPIRED`.

---

#### EC-EXP-002: MC истекает в состоянии FROZEN

**Сценарий:** MC заморожен в Safe, срок истёк.

**Правило (каноническое):** 
- Safe **НЕ продлевает** срок жизни MC
- MC переходит в `EXPIRED` при следующем human-triggered review
- `expiresAt` отсчитывается независимо от состояния freeze

**Формулировка канона:**
> Safe защищает MC от использования, но не от течения времени.

---

#### EC-EXP-003: Expiration пакета MC с разными сроками

**Сценарий:** У пользователя несколько MC-записей с разными `expiresAt`.

**Правило:** 
- Каждая MC-запись обрабатывается индивидуально
- Нет batch-expiration
- Оператор отмечает истёкшие MC вручную

---

### 3.2 Freeze/Unfreeze Edge Cases

#### EC-FRZ-001: Частичная заморозка

**Сценарий:** Пользователь хочет заморозить часть MC.

**Правило (каноническое):** 
- Split **РАЗРЕШЁН**, но с жёсткими условиями:
  - Split возможен только по явному human action
  - Каждая новая запись сохраняет `issuedAt`, `sourceType`, `sourceId`
  - `expiresAt` **НЕ продлевается**
  - Split логируется как событие `MC_SPLIT`

**Запрещено:**
- ❌ Автоматический split
- ❌ Split как оптимизационный инструмент
- ❌ Split с пересчётом выгодного TTL

**Формулировка канона:**
> Split — это техническая необходимость, не механика.

---

#### EC-FRZ-002: Массовая разморозка (Batch Unfreeze)

**Сценарий:** Пользователь хочет разморозить все MC из Safe.

**Правило (каноническое):**
- Batch-unfreeze **РАЗРЕШЁН** как UX-удобство
- Batch = одно human action
- Каждая MC-запись логируется **отдельно**

**Запрещено:**
- ❌ Batch как автоматизация
- ❌ Batch без per-MC audit trail
- ❌ Batch, скрывающий индивидуальные состояния

---

#### EC-FRZ-003: Freeze → Unfreeze → Freeze cycling

**Сценарий:** Пользователь многократно замораживает/размораживает MC.

**Правило:**
- Нет ограничений на количество циклов
- Каждый переход логируется
- Срок жизни (`expiresAt`) продолжает течь (Safe не продлевает)

---

### 3.3 Double-Spend Prevention (Conceptual)

#### Принцип

MC не может быть использован дважды.

#### Механизмы (концептуально)

| Защита | Описание |
|--------|----------|
| Atomic transition | Переход в `SPENT` атомарен и необратим |
| Pre-spend lock | При начале spend операции MC помечается как `PENDING_SPEND` (temporary lock) |
| Idempotency | Каждая spend-операция имеет уникальный `operation_id` |
| Audit trail | Каждый spend логируется с `operation_id`, `timestamp`, `actor_id` |

#### Forbidden

- ❌ Optimistic spend (spend без проверки state)
- ❌ Eventual consistency для MC balance
- ❌ Parallel spend операции на одной MC-записи

---

### 3.4 Rollback & Audit Expectations (Conceptual)

#### Rollback Rules

| Аспект | Правило |
|--------|---------|
| MC SPENT | **Rollback запрещён** — терминальное состояние |
| MC EXPIRED | **Rollback запрещён** — терминальное состояние |
| MC FROZEN | Rollback через UNFREEZE (human action) |
| GMC | **Rollback запрещён** — immutable |

#### Exceptional Rollback

В случае системной ошибки или fraud:
- Rollback возможен **только через административное решение человека**
- Требуется письменное обоснование
- Создаётся отдельный audit record типа `ADMINISTRATIVE_CORRECTION`
- Не создаёт прецедента для автоматических rollback

#### Audit Trail Requirements

| Событие | Обязательные поля |
|---------|-------------------|
| Создание MC | `id`, `userId`, `amount`, `issuedAt`, `expiresAt`, `sourceType`, `sourceId`, `actor_id`, `timestamp` |
| Transition | `id`, `from_state`, `to_state`, `actor_id`, `timestamp`, `reason` |
| Split | `original_id`, `new_ids[]`, `actor_id`, `timestamp` |
| GMC Recognition | `id`, `userId`, `amount`, `category`, `justification`, `recognizedBy`, `timestamp` |

---

## 4. CANONICAL DECISIONS LOG

Решения, принятые в рамках STEP 2:

| # | Вопрос | Решение | Обоснование |
|---|--------|---------|-------------|
| 1 | Safe продлевает срок жизни MC? | **НЕТ** | expiresAt течёт независимо от состояния. Убирает стратегию «заморозь и жди». |
| 2 | Разрешён ли split MC-записей? | **ДА** с жёсткими условиями | Техническая необходимость, не механика. |
| 3 | Допускаются ли batch-операции? | **ДА** как UX-удобство | Per-MC audit trail обязателен. |

---

## 5. HARD PROHIBITIONS (ABSOLUTE)

❌ NO cron jobs  
❌ NO auto-transitions  
❌ NO optimization formulas  
❌ NO "best strategy" logic  
❌ NO farming / grinding mechanics  
❌ NO KPI / performance coupling  
❌ NO AI write-access  
❌ NO AI-initiated events  

---

## 6. GATE TO NEXT STEP

Переход к следующему шагу **РАЗРЕШЁН ТОЛЬКО ЕСЛИ**:

- [x] STEP-2-STATE-LIFECYCLE.md утверждён
- [ ] Все инварианты понятны и приняты
- [ ] Нет открытых вопросов по lifecycle
- [ ] Scope остаётся неизменным

**Следующий допустимый шаг:** STEP 3 (определяется USER)

---

## 7. КАНОНИЧЕСКОЕ НАПОМИНАНИЕ

MatrixCoin-Economy — это система поддержки осознанности,  
а не инструмент управления поведением.

MC имеет временную природу — и это **не наказание**, а отражение  
временной ценности участия.

GMC — признание, а не награда. Оно неизменно.

Если код нарушает эти принципы — он должен быть остановлен,  
даже если работает идеально.
