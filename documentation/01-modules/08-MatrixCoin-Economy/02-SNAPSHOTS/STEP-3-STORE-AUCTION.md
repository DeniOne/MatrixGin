# STEP-3-STORE-AUCTION.md
## Module 08 — MatrixCoin-Economy

**Статус документа:** CANONICAL / APPROVED  
**MPP-фаза:** Step 3 — Store & Auction  
**Дата утверждения:** 2026-01-17  
**Изменение документа:** только через новый MPP-цикл  

---

## 0. Назначение документа

Данный документ фиксирует **канонические определения** Store и Auction:
- Смысловое назначение
- Что означает spend в контексте каждого
- Интеграция с lifecycle MC
- Абсолютные запреты

Этот документ **НЕ** содержит:
- код
- UX спецификации
- ценовые модели
- оптимизационные стратегии

Любое нарушение правил этого документа = **BLOCKED**.

---

## 1. STORE DEFINITION

### 1.1 Purpose of Store

**Store IS:**
- Механизм **немонетарного обмена** участия на символические ценности
- Инструмент **усиления ощущения выбора**, а не потребления
- Способ **мягкого обмена** MC на нематериальные или символические объекты
- Место, где MC **расходуется осознанно**, а не накапливается стратегически

**Store существует для:**
- Завершения lifecycle MC через осознанное действие пользователя
- Предоставления пользователю возможности **трансформировать участие** в символическую ценность
- Усиления чувства, что участие **имело значение**

---

### 1.2 What Can Be Exchanged

**Допустимые категории объектов в Store:**

| Категория | Описание | Смысл |
|-----------|----------|-------|
| `SYMBOLIC` | Символические ценности | Признание участия, культурные артефакты системы |
| `EXPERIENCE` | Опыт, события | Доступ к событиям, мероприятиям, опыту |
| `PRIVILEGE` | Привилегии | Нематериальные привилегии (не деньги, не материальные блага) |

**Объекты в Store:**
- Имеют **смысловую**, а не финансовую ценность
- НЕ имеют денежного эквивалента
- НЕ создают ощущения «покупки за деньги»
- НЕ формируют стратегию накопления

---

### 1.3 What MC Spend Means in Store

**MC spend в контексте Store:**
- Человек **осознанно решает** использовать своё участие
- MC переходит в терминальное состояние `SPENT`
- Нет возврата, нет refund, нет rollback (кроме exceptional administrative correction)
- Spend отражает **завершение цикла участия**, а не покупку

**Spend IS:**
- Осознанный выбор пользователя
- Терминальный переход MC
- Логируемое событие с `spend_target`

**Spend IS NOT:**
- Покупка
- Инвестиция
- Оптимальный ход

---

### 1.4 Explicit NON-GOALS of Store

Store **НЕ является:**
- Рынком
- Магазином
- Источником мотивации
- Инструментом давления
- Механизмом вознаграждения

Store **НЕ должен:**
- Стимулировать накопление MC
- Создавать инфляцию смысла
- Становиться основным источником мотивации
- Имитировать магазин с ценами
- Формировать у пользователя ощущение «покупки за деньги»
- Создавать «оптимальные стратегии» траты

---

### 1.5 Forbidden Patterns in Store

| Pattern | Описание | Нарушение |
|---------|----------|-----------|
| PRICING | Ценники на объекты | BLOCKED |
| DISCOUNTS | Скидки, акции | BLOCKED |
| BUNDLES | Пакетные предложения | BLOCKED |
| CART_MECHANICS | Корзина, checkout | BLOCKED |
| SCARCITY_PRESSURE | Искусственный дефицит для давления | BLOCKED |
| EARN_MORE_GET_MORE | «Больше MC = больше возможностей» | BLOCKED |
| COMPARISON | Сравнение «ценности» объектов | BLOCKED |
| OPTIMIZATION_HINTS | Подсказки «выгодных» трат | BLOCKED |
| AI_RECOMMENDATIONS | AI советует что «купить» | BLOCKED |
| INFINITE_AVAILABILITY | Бесконечная доступность (разрушает смысл) | BLOCKED |

---

## 2. AUCTION DEFINITION

### 2.1 Purpose of Auction

**Auction IS:**
- **Событийный шлюз** допуска к GMC
- **Институциональный ритуал** признания зрелости участия
- **Фильтр зрелости**, а не соревнование за ресурс
- **Редкое**, не регулярное событие

**Auction существует для:**
- Предоставления **шанса** на участие в признании (GMC)
- Фиксации **готовности** пользователя к статусному переходу
- Создания **события**, а не процесса

**Auction IS NOT:**
- Сервис
- Непрерывная система
- Marketplace
- Место конкуренции
- Гарантия получения GMC

---

### 2.2 Trigger Conditions (Human-Only)

**Auction может быть создан ТОЛЬКО:**
- По явному решению уполномоченного человека
- Как **событие**, привязанное к значимому моменту системы
- С ограниченным количеством «слотов» (не для создания pressure, а для обозначения редкости)

**Auction НЕ создаётся:**
- Автоматически (cron, schedule)
- AI
- По триггеру системы
- Регулярно (не «каждый месяц»)

**Условия существования Auction:**

| Условие | Требование |
|---------|------------|
| Initiator | Человек с полномочиями |
| Frequency | Редко, не регулярно |
| Announcement | Заранее объявлен |
| Duration | Ограничен по времени (событие, не процесс) |
| Outcome visibility | Результат объявляется публично или лично (не алгоритмически) |

---

### 2.3 What MC Spend Means in Auction

**MC spend в контексте Auction:**
- Человек **заявляет готовность** к участию в признании
- MC переходит в терминальное состояние `SPENT`
- Spend НЕ гарантирует результат
- Spend отражает **интенцию**, а не покупку права

**Важно:**
- Проигрыш в Auction **не является неудачей**
- Проигрыш **не снижает статус**
- MC потрачен осознанно, независимо от исхода

---

### 2.4 Why Outcome Is Not Guaranteed

**Auction явно НЕ гарантирует GMC:**
- GMC **признаётся**, а не покупается
- Auction — это **шанс** на признание, не право
- Человек, принимающий решение о признании, использует Auction как **один из входных сигналов**, но решение остаётся за ним
- MC spend в Auction — это **демонстрация готовности**, не оплата

**Если Auction гарантировал бы GMC:**
- GMC стал бы покупаемым → нарушение канона
- Появилась бы стратегия фарма → нарушение канона
- Исчез бы смысл признания → нарушение канона

---

### 2.5 Forbidden Patterns in Auction

| Pattern | Описание | Нарушение |
|---------|----------|-----------|
| GUARANTEED_OUTCOME | Победа = GMC | BLOCKED |
| HIGHEST_BID_WINS | «Кто больше — тот победил» | BLOCKED |
| REGULAR_SCHEDULE | Auction каждый месяц/неделю | BLOCKED |
| AI_PARTICIPATION | AI участвует или влияет | BLOCKED |
| FARMING_INCENTIVE | Накопи MC → выиграй GMC | BLOCKED |
| COMPETITIVE_RANKING | Рейтинг участников | BLOCKED |
| RESERVE_PRICE | Минимальная «ставка» | BLOCKED |
| REPEAT_UNTIL_WIN | Стратегия повторов | BLOCKED |
| LOSS_PENALTY | Штраф за проигрыш | BLOCKED |
| WINNER_GAMIFICATION | «Победитель недели!» | BLOCKED |
| CONTINUOUS_API | Постоянный эндпоинт Auction | BLOCKED |

---

## 3. LIFECYCLE INTEGRATION

### 3.1 How Store Spend Leads to MC → SPENT

**Workflow:**

1. Пользователь выбирает объект в Store (human action)
2. Система валидирует:
   - MC в состоянии `ACTIVE`
   - MC не истёк (`expiresAt > now`)
   - Количество MC достаточно
3. При подтверждении:
   - MC переходит в `SPENT` (терминальное состояние)
   - Создаётся audit record с `spend_target = STORE:<item_id>`
   - Пользователь получает доступ к символическому объекту
4. Нет возврата

**FSM transition:**
```
ACTIVE → SPENT (via STORE spend)
```

---

### 3.2 How Auction Spend Leads to MC → SPENT

**Workflow:**

1. Auction объявляется уполномоченным человеком (event creation)
2. Пользователь решает участвовать (human action)
3. При участии:
   - MC в состоянии `ACTIVE`
   - MC не истёк (`expiresAt > now`)
   - Количество MC соответствует условиям участия
4. MC переходит в `SPENT` (терминальное состояние)
5. Создаётся audit record с `spend_target = AUCTION:<event_id>`
6. **Исход Auction определяется позже**, человеком
7. Независимо от исхода — MC уже `SPENT`, возврата нет

**FSM transition:**
```
ACTIVE → SPENT (via AUCTION participation)
```

---

### 3.3 Explicit Statement of Terminality

**MC в состоянии `SPENT`:**
- Является **терминальным** состоянием
- **Не может** перейти в другое состояние
- **Не может** быть возвращён (кроме `ADMINISTRATIVE_CORRECTION`)
- **Не может** быть повторно использован

**Это справедливо для:**
- Store spend
- Auction spend
- Transfer (peer-to-peer, если будет реализован)

---

### 3.4 No Reverse Flows

**Запрещённые обратные потоки:**

| Поток | Статус |
|-------|--------|
| `SPENT → ACTIVE` | ❌ FORBIDDEN |
| `SPENT → FROZEN` | ❌ FORBIDDEN |
| Store refund | ❌ FORBIDDEN |
| Auction refund (при проигрыше) | ❌ FORBIDDEN |
| Undo spend | ❌ FORBIDDEN |

**Единственное исключение:**
- `ADMINISTRATIVE_CORRECTION` — ручное административное решение человека при системной ошибке или fraud
- Требует письменного обоснования
- Логируется отдельно
- Не создаёт прецедента

---

## 4. ABSOLUTE PROHIBITIONS

### 4.1 Store Prohibitions

| ID | Pattern | Описание |
|----|---------|----------|
| STORE-BLOCK-001 | Pricing | Ценники, стоимость объектов в числах |
| STORE-BLOCK-002 | Discounts | Скидки, акции, специальные предложения |
| STORE-BLOCK-003 | Bundles | Пакеты «2 по цене 1» |
| STORE-BLOCK-004 | Cart | Корзина, checkout flow |
| STORE-BLOCK-005 | Purchase language | UX-текст «купить», «цена», «стоимость» |
| STORE-BLOCK-006 | Leaderboards | Рейтинг «кто больше потратил» |
| STORE-BLOCK-007 | AI suggestions | AI рекомендует объекты |
| STORE-BLOCK-008 | Optimization hints | Подсказки «выгодных» трат |
| STORE-BLOCK-009 | Infinite items | Бесконечная доступность объектов |
| STORE-BLOCK-010 | Motivation loop | Store как мотиватор «заработай MC → потрать в Store» |

### 4.2 Auction Prohibitions

| ID | Pattern | Описание |
|----|---------|----------|
| AUCTION-BLOCK-001 | Guaranteed GMC | Participation = GMC |
| AUCTION-BLOCK-002 | Highest bid wins | Аукцион как торги |
| AUCTION-BLOCK-003 | Regular schedule | Auction каждую неделю/месяц |
| AUCTION-BLOCK-004 | AI participation | AI выбирает или влияет |
| AUCTION-BLOCK-005 | Continuous API | Постоянный эндпоинт |
| AUCTION-BLOCK-006 | Farming incentive | Накопи → выиграй |
| AUCTION-BLOCK-007 | Loss penalty | Штраф за проигрыш |
| AUCTION-BLOCK-008 | Winner gamification | «Победитель недели!» |
| AUCTION-BLOCK-009 | Reserve price | Минимальная ставка |
| AUCTION-BLOCK-010 | Repeat until win | Стратегия повторов |

### 4.3 General Prohibitions

| ID | Pattern | Описание |
|----|---------|----------|
| GEN-BLOCK-001 | Automation | Автоматические spend/auction events |
| GEN-BLOCK-002 | Cron-based operations | Авто-spend, авто-expiration |
| GEN-BLOCK-003 | KPI coupling | Store/Auction linked to performance |
| GEN-BLOCK-004 | Financial equivalence | MC = X рублей |
| GEN-BLOCK-005 | Refund mechanics | Возврат MC после spend |

---

## 5. GATE TO NEXT STEP

### 5.1 Pre-conditions for STEP 2 CODE

Код для STEP 2 (State & Lifecycle) может быть написан **ТОЛЬКО ЕСЛИ:**

- [x] STEP-2-STATE-LIFECYCLE.md утверждён
- [x] Все инварианты (MC-INV-*, GMC-INV-*) задокументированы
- [x] Канонические решения (Safe, Split, Batch) зафиксированы
- [x] STEP-3-STORE-AUCTION.md утверждён
- [ ] USER явно разрешил переход к коду

---

### 5.2 Pre-conditions for STEP 3 CODE

Код для STEP 3 (Store & Auction) может быть написан **ТОЛЬКО ЕСЛИ:**

- [x] STEP-3-STORE-AUCTION.md утверждён
- [ ] STEP 2 CODE реализован и протестирован
- [x] Store и Auction определения не содержат pricing/optimization логики
- [x] Все BLOCK-паттерны задокументированы
- [ ] USER явно разрешил переход к коду

---

## 6. HARD PROHIBITIONS (SUMMARY)

❌ NO pricing logic  
❌ NO discounts / bundles  
❌ NO dynamic value models  
❌ NO "earn more — get more" mechanics  
❌ NO infinite availability  
❌ NO AI participation  
❌ NO automation  
❌ NO gamified accumulation  
❌ NO guaranteed outcomes  
❌ NO refund mechanics  

---

## 7. КАНОНИЧЕСКОЕ НАПОМИНАНИЕ

Store — это не магазин.  
Auction — это не рынок.

Store существует для **завершения цикла участия**,  
а не для создания стимула накопления.

Auction существует как **редкий ритуал допуска**,  
а не как регулярный механизм обмена.

MC spend — это **осознанный выбор**,  
а не оптимальный ход.

Если реализация превращает Store или Auction  
в инструмент мотивации или оптимизации —  
она должна быть остановлена, даже если работает идеально.
