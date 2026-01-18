# MatrixCoin / GMC — IMPLEMENTATION CHECKLIST
## Backend / Frontend / UX / Documentation

Легенда статусов:
- [ ] не сделано
- [x] сделано
- [!] частично / требует доработки

---

## 1. WALLET (MC / GMC)

### 1.1 Backend
- [x] Wallet entity (MC, GMC balances)
- [x] Single source of truth для баланса
- [x] Запрет прямого изменения баланса (только через transactions)
- [x] Transactional update (ACID)
- [x] Защита от double-spend
- [x] Reason codes для транзакций

**Документация:**
- WALLET-TECH.md (структура данных, инварианты)
- WALLET-API.md (эндпоинты, payload, ошибки)

---

### 1.2 API
- [x] GET /api/economy/wallet
- [x] GET /api/economy/transactions
- [x] Pagination для истории
- [x] Error codes (401, 403, 409, 500)

**Документация:**
- WALLET-API.md

---

### 1.3 Frontend
- [x] Wallet Page (Widget implemented)
- [x] Отображение MC баланса
- [x] Отображение GMC баланса
- [x] Краткая история транзакций (Modal implemented)
- [x] Empty / Loading / Error states

**Документация:**
- WALLET-UX.md (что видит пользователь)

---

## 2. STORE (МАГАЗИН)

### 2.1 Backend — Store Items
- [x] StoreItem entity (Types & Logic exist)
- [x] Типы товаров (benefit / access / auction)
- [x] Price в MC
- [x] Constraints (лимиты, cooldown, условия)
- [x] Активность товара (on/off)

**Документация:**
- STORE-TECH.md (сущности и связи)

---

### 2.2 Backend — Purchase Flow
- [x] POST /api/store/purchase
- [x] Проверка баланса
- [x] Проверка constraints
- [x] Atomic transaction (wallet + transaction)
- [x] Rollback при ошибке
- [x] Idempotency (повтор запроса — Backend responsibility)

**Документация:**
- STORE-FLOW.md (логика покупки)
- STORE-API.md

---

### 2.3 API
- [x] GET /api/store/items
- [x] POST /api/store/purchase
- [x] Error responses (недостаток MC, лимит, запрет)

**Документация:**
- STORE-API.md

---

### 2.4 Frontend — Store UI
- [x] Store Page
- [x] Список товаров
- [x] Цена в MC
- [x] Ограничения товара
- [x] Кнопка BUY
- [x] Disabled state (нельзя купить)
- [x] Success / Error feedback

**Документация:**
- STORE-UX.md

---

## 3. TRANSACTIONS (ИСТОРИЯ)

### 3.1 Backend
- [x] Transaction entity
- [x] Типы транзакций (earn, spend, burn, adjust)
- [x] Связь с источником (store, task, admin)
- [x] Audit trail

**Документация:**
- TRANSACTIONS-TECH.md

---

### 3.2 Frontend
- [x] Transactions Page (History Modal)
- [x] Фильтр по типу
- [x] Фильтр по дате
- [x] Читаемое описание reason

**Документация:**
- TRANSACTIONS-UX.md

---

## 4. MC LIFECYCLE

### 4.1 Начисление
- [x] Явные точки начисления MC
- [x] Централизованный сервис начисления
- [x] Логи начислений

**Документация:**
- MC-LIFECYCLE.md
- MC-EARN-RULES.md

---

### 4.2 Сгорание
- [x] Правила сгорания MC
- [x] Периодичность
- [x] Исключения
- [x] Прозрачность для пользователя

**Документация:**
- MC-BURN-RULES.md
- MC-LIFECYCLE.md

---

## 5. GMC (СТРАТЕГИЧЕСКИЙ УРОВЕНЬ)

### 5.1 Backend
- [x] GMC как отдельный баланс
- [x] Запрет прямого начисления
- [x] Источник появления GMC (явно)
- [x] Ограниченные операции

**Документация:**
- GMC-TECH.md

---

### 5.2 Frontend
- [x] Отображение GMC в Wallet
- [x] Tooltip / help что это такое (информационная подпись)
- [x] Нет кнопки «потратить»

**Документация:**
- GMC-UX.md

---

## 6. STATUS & MULTIPLIERS
> ⚠️ STATUS & MULTIPLIERS  
> Данный блок **осознанно не реализован**.
>  
> Статусы и ранги зафиксированы на стратегическом уровне и описаны в  
> `documentation/00-strategic/STATUS-RANKS-CANON.md`.
>  
> Отсутствие реализации не является техническим долгом или дефектом.

### 6.1 Backend
- [ ] CORE: Implement Status Ranks Logic (Photon -> Universe) <!-- id: 50 -->
- [ ] Связь статуса с MC
- [ ] Мультипликаторы начислений
- [ ] Логика пересчёта

**Документация:**
- STATUS-TECH.md

---

### 6.2 Frontend
- [ ] Отображение текущего статуса
- [ ] Влияние на MC (read-only)
- [ ] История смены статуса

**Документация:**
- STATUS-UX.md

---

## 7. ERROR HANDLING & SECURITY

### 7.1 Backend
- [x] Единый формат ошибок
- [x] 409 conflict для денег
- [x] Защита от повторных запросов
- [x] Rate limiting на purchase

**Документация:**
- ECONOMY-ERRORS.md
- ECONOMY-SECURITY.md

---

### 7.2 Frontend
- [x] Читаемые ошибки (Error Handling Matrix)
- [x] Retry / Cancel (Reset error implemented)
- [x] No silent failures

**Документация:**
- ERROR-UX.md

---

## 8. EXPLOIT & OPS
- [x] Audit лог всех операций
- [x] Admin read-only просмотр (Global Dashboard)
- [!] Manual rollback (admin) (API missing)
- [x] Monitoring (Analytics Heatmap)

**Документация:**
- ECONOMY-OPS.md

---

## 9. FINAL ACCEPTANCE
- [x] Пользователь может:
  - [x] видеть баланс
  - [x] видеть магазин
  - [x] купить товар
  - [x] видеть историю
- [x] Разработчик может:
  - [x] понять API без чтения кода (Analytics API implemented)
  - [x] добавить новый товар
- [x] Модуль виден и понятен во фронте

**Документация:**
- README-IMPLEMENTATION.md
