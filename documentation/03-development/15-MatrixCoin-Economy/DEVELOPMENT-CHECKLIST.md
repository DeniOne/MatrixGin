# Чеклист разработки: MatrixCoin Economy

**Модуль:** 15-MatrixCoin-Economy  
**Статус:** 🟡 Частично выполнен  
**Прогресс:** 40/100

---

## 📅 ПЛАН РАЗРАБОТКИ

### Неделя 5: Backend Core
- **Дни 1-2:** Database schema & migrations
- **Дни 3-4:** Wallet & Transaction services
- **День 5:** Store API

### Неделя 6: Advanced Features
- **Дни 1-2:** Auction system + WebSocket
- **Дни 3-4:** Payment integrations
- **День 5:** MC Lifecycle & Cron jobs

---

## ✅ ЧЕКЛИСТ BACKEND

### 1. База данных (5 часов) ✅ ЧАСТИЧНО ВЫПОЛНЕНО

- [x] **1.1** Создать миграцию для `wallets` ✅ (существует в economy_tables)
- [x] **1.2** Создать миграцию для `transactions` ✅
- [x] **1.3** Создать миграцию для `store_items` ✅ (20250121224343_add_store_models)
- [x] **1.4** Создать миграцию для `purchases` ✅
- [ ] **1.5** Создать миграцию для `auctions`
- [ ] **1.6** Создать миграцию для `auction_bids`
- [ ] **1.7** Создать миграцию для `mc_lifecycle`
- [x] **1.8** Добавить индексы ✅
- [x] **1.9** Seed данные (тестовые товары) ✅

**Файлы:**
```
database/migrations/20250121000011_create_economy_tables.sql ✅
database/migrations/20250121224343_add_store_models.sql ✅
database/seeds/04_seed_test_data.sql ✅
```

**Статус:** 65% завершено

---

### 2. Prisma Schema (2 часа) ✅ ЧАСТИЧНО ВЫПОЛНЕНО

- [x] **2.1** Модель `Wallet` ✅
- [x] **2.2** Модель `Transaction` ✅
- [x] **2.3** Модель `StoreItem` ✅
- [x] **2.4** Модель `Purchase` ✅
- [ ] **2.5** Модель `Auction`
- [ ] **2.6** Модель `AuctionBid`
- [ ] **2.7** Модель `MCLifecycle`
- [x] **2.8** Настроить связи ✅
- [x] **2.9** `npx prisma generate` ✅

**Статус:** 60% завершено

---

### 3. DTOs (4 часа) ✅ ЧАСТИЧНО ВЫПОЛНЕНО

- [x] **3.1** `CreateTransactionDto` ✅
  ```typescript
  - toUserId: UUID
  - amount: number
  - currency: 'MC' | 'GMC'
  - description: string
  ```

- [ ] **3.2** `ActivateSafeDto`
  ```typescript
  - amount: number
  ```

- [ ] **3.3** `PurchaseItemDto`
  ```typescript
  - itemId: UUID
  - quantity: number
  - currency: 'MC' | 'GMC' | 'RUB'
  ```

- [ ] **3.4** `PlaceBidDto`
  ```typescript
  - auctionId: UUID
  - bidAmount: number
  ```

- [ ] **3.5** `CreatePaymentDto`
  ```typescript
  - amount: number
  - currency: 'RUB'
  - provider: 'sberbank' | 'tinkoff' | 'yookassa'
  ```

- [x] **3.6** Response DTOs ✅ (частично)

**Файлы:**
```
src/dto/economy/ ✅ (существует, дополнить)
```

**Статус:** 40% завершено

---

### 4. Wallet Service (6 часов) ✅ ЧАСТИЧНО ВЫПОЛНЕНО

- [x] **4.1** Создать `WalletService` ✅
- [x] **4.2** `getBalance(userId)` ✅
  - MC total, available, frozen
  - GMC total
  - Expiring MC в ближайшие 7 дней

- [x] **4.3** `earnMC(userId, amount, metadata)` ✅
  - Добавить в баланс
  - Создать запись в mc_lifecycle
  - Создать transaction record

- [x] **4.4** `deductMC(userId, amount)` ✅
  - Проверка баланса
  - Списание

- [ ] **4.5** `activateSafe(userId, amount)`
  - Расчет комиссии 5%
  - Заморозка MC
  - Обновление mc_lifecycle (is_frozen = true)

- [ ] **4.6** `deactivateSafe(userId)`
  - Авто через 30 дней (cron)

- [x] **4.7** `transferMC(fromUserId, toUserId, amount)` ✅

- [ ] **4.8** Error handling

**Файл:**
```
src/services/wallet.service.ts ✅ (существует, дополнить)
```

**Статус:** 60% завершено

---

### 5. Transaction Service (4 часа) ✅ ЧАСТИЧНО ВЫПОЛНЕНО

- [x] **5.1** Создать `TransactionService` ✅
- [x] **5.2** `create(fromUserId, toUserId, amount, currency, type, metadata)` ✅
  - Создание транзакции
  - Запись в event_log

- [x] **5.3** `getHistory(userId, filters, pagination)` ✅
  - Фильтры по type, currency
  - Пагинация

- [x] **5.4** `getStatistics(userId)` ✅
  - Total earned, spent
  - By type breakdown

**Файл:**
```
src/services/transaction.service.ts ✅ (существует)
```

**Статус:** 90% завершено ✅

---

### 6. Store Service (5 часов) ✅ ЧАСТИЧНО ВЫПОЛНЕНО

- [x] **6.1** Создать `StoreService` ✅
- [x] **6.2** `getItems(filters)` ✅
  - Фильтр по category
  - Только active items

- [x] **6.3** `getItem(itemId)` ✅
  - С учетом скидок пользователя (ранг)

- [x] **6.4** `purchaseItem(userId, itemId, quantity, currency)` ✅
  - Проверка stock
  - Проверка баланса
  - Применение скидки
  - Создание purchase record
  - Обновление stock

- [ ] **6.5** `getPurchaseHistory(userId)`

**Файл:**
```
src/services/store.service.ts ✅ (существует)
```

**Статус:** 80% завершено

---

### 7. Auction Service (8 часов)

- [ ] **7.1** Создать `AuctionService`
- [ ] **7.2** `getActiveAuctions()`
  - Только status = 'active'
  - С текущими ставками

- [ ] **7.3** `getAuction(auctionId)`
  - История ставок
  - Time remaining

- [ ] **7.4** `placeBid(auctionId, userId, bidAmount)`
  - Валидация bid > current_bid
  - Проверка баланса MC
  - Возврат MC предыдущему лидеру
  - Списание у нового лидера
  - Anti-Sniper rule: если <5 мин, продлить на 10 мин
  - WebSocket emit: 'new_bid'

- [ ] **7.5** `getBidHistory(auctionId)`

- [ ] **7.6** `endAuction(auctionId)` (Cron job)
  - Начислить GMC победителю
  - Списать MC у победителя
  - Обновить status = 'ended'

- [ ] **7.7** Error handling

**Файл:**
```
src/services/auction.service.ts (создать)
```

**Статус:** 0% завершено

---

### 8. MC Lifecycle Service (6 часов)

- [ ] **8.1** Создать `MCLifecycleService`
- [ ] **8.2** `trackEarned(userId, amount, earnedAt)`
  ```typescript
  - Создать запись в mc_lifecycle
  - expiresAt = earnedAt + 90 days
  ```

- [ ] **8.3** `getExpiringMC(userId, daysAhead = 7)`
  - Найти MC, expiring в ближайшие 7 дней

- [ ] **8.4** `checkExpiredMC()` (Cron job - ежедневно)
  ```typescript
  - Найти expired MC (expiresAt <= NOW)
  - Списать с баланса
  - Отметить is_expired = true
  - Отправить уведомление
  ```

- [ ] **8.5** `freezeMC(userId, amount)`
  - is_frozen = true для соответствующих записей

- [ ] **8.6** `unfreezeMC(userId)`
  - is_frozen = false

**Файл:**
```
src/services/mc-lifecycle.service.ts (создать)
```

**Статус:** 0% завершено

---

### 9. Payment Service (8 часов)

- [ ] **9.1** Создать `PaymentService`
- [ ] **9.2** Интеграция с СберБанк
  ```typescript
  - Установить node-sberbank-acquiring
  - createPayment(amount, description)
  - checkPaymentStatus(orderId)
  - handleCallback(data)
  ```

- [ ] **9.3** Интеграция с Тинькофф
  ```typescript
  - Установить tinkoff-payment-sdk
  - init(amount)
  - confirm(paymentId)
  - getState(paymentId)
  ```

- [ ] **9.4** Интеграция с ЮКасса
  ```typescript
  - Установить @a2seven/yoo-checkout
  - createPayment(amount, returnUrl)
  - capturePayment(paymentId)
  - Webhook handler
  ```

- [ ] **9.5** `convertRUBtoMC(amountRUB)`
  - Курс конвертации (например, 10 RUB = 1 MC)

- [ ] **9.6** `processSuccessfulPayment(transactionId)`
  - Начислить MC на баланс

**Файл:**
```
src/services/payment.service.ts (создать)
```

**Статус:** 0% завершено

---

### 10. Controllers (6 часов) ✅ ЧАСТИЧНО ВЫПОЛНЕНО

- [x] **10.1** Создать `EconomyController` ✅
- [x] **10.2** `GET /api/economy/balance/:userId` ✅
- [x] **10.3** `GET /api/economy/transactions` ✅
- [x] **10.4** `POST /api/economy/transactions` ✅
- [ ] **10.5** `POST /api/economy/safe/activate`
- [ ] **10.6** `GET /api/economy/safe/status/:userId`

- [x] **10.7** Создать `StoreController` ✅
- [x] **10.8** `GET /api/economy/store` ✅
- [x] **10.9** `GET /api/economy/store/:itemId` ✅
- [x] **10.10** `POST /api/economy/store/:itemId/buy` ✅

- [ ] **10.11** Создать `AuctionController`
- [ ] **10.12** `GET /api/economy/auction`
- [ ] **10.13** `GET /api/economy/auction/:id`
- [ ] **10.14** `POST /api/economy/auction/:id/bid`
- [ ] **10.15** `GET /api/economy/auction/:id/history`

- [ ] **10.16** Создать `PaymentController`
- [ ] **10.17** `POST /api/economy/payment/sberbank`
- [ ] **10.18** `POST /api/economy/payment/tinkoff`
- [ ] **10.19** `POST /api/economy/payment/yookassa`
- [ ] **10.20** `GET /api/economy/payment/:transactionId`
- [ ] **10.21** Webhook handlers для платежных систем

**Файлы:**
```
src/controllers/economy.controller.ts ✅ (существует, дополнить)
src/controllers/store.controller.ts ✅ (существует)
src/controllers/auction.controller.ts (создать)
src/controllers/payment.controller.ts (создать)
```

**Статус:** 40% завершено

---

### 11. Routes (2 часа) ✅ ЧАСТИЧНО ВЫПОЛНЕНО

- [x] **11.1** Роутер economy ✅
- [x] **11.2** Роутер store ✅
- [ ] **11.3** Роутер auction
- [ ] **11.4** Роутер payment
- [x] **11.5** Auth middleware ✅
- [x] **11.6** RBAC middleware ✅

**Файлы:**
```
src/routes/economy.routes.ts ✅
src/routes/store.routes.ts ✅
src/routes/auction.routes.ts (создать)
src/routes/payment.routes.ts (создать)
```

**Статус:** 50% завершено

---

### 12. WebSocket для Аукционов (5 часов)

- [ ] **12.1** Настроить Socket.io Gateway
- [ ] **12.2** Room: `auction:{auctionId}`
- [ ] **12.3** Event: `new_bid`
  ```typescript
  {
    auctionId,
    bidAmount,
    bidder: { id, name },
    currentBid,
    timeRemaining,
    endTimeExtended
  }
  ```

- [ ] **12.4** Event: `auction_ended`
  ```typescript
  {
    auctionId,
    winner: { id, name },
    finalBid,
    gmcAwarded
  }
  ```

- [ ] **12.5** Join/leave room при подключении

**Файл:**
```
src/websocket/auction.gateway.ts (создать)
```

**Статус:** 0% завершено

---

### 13. Cron Jobs (4 часа)

- [ ] **13.1** Настроить BullMQ или @nestjs/schedule
- [ ] **13.2** Job: MC Expiration Check
  ```typescript
  @Cron('0 0 * * *') // Ежедневно в 00:00
  async checkExpiredMC() {
    await mcLifecycleService.checkExpiredMC();
  }
  ```

- [ ] **13.3** Job: End Auctions
  ```typescript
  @Cron('*/5 * * * *') // Каждые 5 минут
  async endAuctions() {
    const ended = await auctionService.endExpiredAuctions();
  }
  ```

- [ ] **13.4** Job: Unfreeze Safe MC
  ```typescript
  @Cron('0 1 * * *') // Ежедневно в 01:00
  async unfrezeSafe() {
    await walletService.unfreezeExpiredSafes();
  }
  ```

**Файл:**
```
src/services/cron-jobs.service.ts (создать)
```

**Статус:** 0% завершено

---

### 14. Интеграции (3 часа)

- [x] **14.1** Task completion → MC reward ✅ (частично)
  ```typescript
  await walletService.earnMC(assigneeId, 10, {
    type: 'reward',
    referenceType: 'task',
    referenceId: taskId
  });
  ```

- [ ] **14.2** Achievement unlock → MC reward
- [ ] **14.3** Kaizen improvement → MC reward
- [ ] **14.4** Gamification rank calculation → использование GMC
- [ ] **14.5** Telegram notifications для:
  - MC earned
  - MC expiring
  - Auction won/lost

**Статус:** 25% завершено

---

## ✅ ЧЕКЛИСТ FRONTEND

### 15. Redux Store (4 часа)

- [ ] **15.1** `economySlice`
  - State: wallet, transactions, storeItems, auctions
- [ ] **15.2** `economyApi` (RTK Query)
- [ ] **15.3** Real-time auction updates (Socket.io)

**Файлы:**
```
frontend/src/features/economy/economySlice.ts
frontend/src/features/economy/economyApi.ts
```

**Статус:** 0% завершено

---

### 16. UI Компоненты (12 часов)

- [ ] **16.1** `WalletWidget`
  - Баланс MC/GMC
  - Expiring MC warning
  - Link to transactions

- [ ] **16.2** `TransactionHistory`
  - Таблица транзакций
  - Фильтры
  - Пагинация

- [ ] **16.3** `Store`
  - Сетка товаров
  - Категории
  - Purchase modal

- [ ] **16.4** `AuctionList`
  - Active auctions
  - Countdown timer
  - Current bid

- [ ] **16.5** `AuctionDetails`
  - Bid history
  - Real-time updates
  - Bid form

- [ ] **16.6** `SafeActivation`
  - Amount input
  - Fee calculation
  - Confirmation

- [ ] **16.7** `PaymentModal`
  - Provider selection
  - Amount input
  - Redirect to payment gateway

**Файлы:**
```
frontend/src/features/economy/WalletWidget.tsx
frontend/src/features/economy/TransactionHistory.tsx
frontend/src/features/economy/Store.tsx
frontend/src/features/economy/AuctionList.tsx
frontend/src/features/economy/AuctionDetails.tsx
frontend/src/features/economy/SafeActivation.tsx
frontend/src/features/economy/PaymentModal.tsx
```

**Статус:** 0% завершено

---

### 17. Pages (3 часа)

- [ ] **17.1** `/wallet` - Кошелек
- [ ] **17.2** `/store` - Магазин
- [ ] **17.3** `/auctions` - Аукционы
- [ ] **17.4** `/transactions` - История транзакций

**Статус:** 0% завершено

---

## ✅ ТЕСТИРОВАНИЕ

### 18. Backend Unit Tests (8 часов)

- [x] **18.1** Тесты для `WalletService` ✅ (частично)
  - earnMC, deductMC, transferMC
  - Safe activation

- [x] **18.2** Тесты для `TransactionService` ✅
- [ ] **18.3** Тесты для `StoreService`
  - Purchase with discount
  - Stock management
- [ ] **18.4** Тесты для `AuctionService`
  - Bid placement
  - Anti-Sniper rule
  - Auction ending
- [ ] **18.5** Тесты для `MCLifecycleService`
  - Expiration logic
  - Freeze/unfreeze
- [ ] **18.6** Тесты для `PaymentService`
  - Payment creation
  - Callback handling

**Статус:** 30% завершено

---

### 19. Integration Tests (5 часов)

- [ ] **19.1** E2E: Earn MC → Transfer → Purchase
- [ ] **19.2** E2E: Activate Safe → Wait 30 days → Unfreeze
- [ ] **19.3** E2E: Place bid → Outbid → Auction end
- [ ] **19.4** E2E: Payment → MC credited
- [ ] **19.5** MC Expiration flow

**Статус:** 0% завершено

---

### 20. Frontend Tests (3 часа)

- [ ] **20.1** Component tests
- [ ] **20.2** Redux slice tests
- [ ] **20.3** Real-time auction tests

**Статус:** 0% завершено

---

## ✅ ДОКУМЕНТАЦИЯ

### 21. API Documentation (3 часа)

- [x] **21.1** OpenAPI спецификация ✅ (частично)
- [ ] **21.2** Payment webhooks documentation
- [ ] **21.3** Auction WebSocket events
- [ ] **21.4** Postman collection

**Статус:** 30% завершено

---

## ✅ ДЕПЛОЙ

### 22. Environment Setup (2 часа)

- [ ] **22.1** Payment credentials
  ```bash
  SBERBANK_USERNAME=...
  SBERBANK_PASSWORD=...
  TINKOFF_TERMINAL_KEY=...
  YOOKASSA_SHOP_ID=...
  YOOKASSA_SECRET_KEY=...
  ```

- [ ] **22.2** MC to RUB conversion rate
  ```bash
  MC_RUB_RATE=10  # 10 RUB = 1 MC
  ```

- [ ] **22.3** Auction settings
  ```bash
  AUCTION_ANTISNIPER_TIME=300000  # 5 minutes
  AUCTION_EXTENSION_TIME=600000   # 10 minutes
  ```

**Статус:** 0% завершено

---

### 23. Мониторинг (2 часа)

- [ ] **23.1** Метрики:
  - MC в обращении
  - GMC в обращении
  - Ежедневные транзакции
  - MC expired за день
  - Active auctions
  - Payment success rate

- [ ] **23.2** Алерты:
  - Payment failure
  - MC imbalance (earned != balance)
  - Auction не закрылся вовремя

**Статус:** 0% завершено

---

## 📊 DEFINITION OF DONE

- [x] ✅ Wallet балансы работают (60%)
- [x] ✅ Транзакции создаются (80%)
- [x] ✅ Store API работает (70%)
- [ ] ✅ Auction system real-time
- [ ] ✅ MC Lifecycle + expiration
- [ ] ✅ Payment integrations работают
- [ ] ✅ Safe mechanism работает
- [ ] ✅ Frontend UI полностью функционален
- [ ] ✅ Unit tests coverage >80%
- [ ] ✅ Integration tests проходят
- [ ] ✅ Security audit пройден (платежи)
- [ ] ✅ Product Owner принял модуль

---

## 📈 ПРОГРЕСС ПО СЕКЦИЯМ

| Секция | Прогресс | Статус |
|--------|----------|--------|
| Backend Database | 65% | 🟡 |
| Wallet & Transactions | 75% | 🟡 |
| Store | 70% | 🟡 |
| Auctions | 0% | 🔴 |
| Payments | 0% | 🔴 |
| MC Lifecycle | 0% | 🔴 |
| Cron Jobs | 0% | 🔴 |
| Frontend | 0% | 🔴 |
| Testing | 20% | 🔴 |
| **ОБЩИЙ ПРОГРЕСС** | **40%** | 🟡 |

---

**Последнее обновление:** 2025-11-22  
**Ответственный:** Backend Team Lead + Payment Integration Specialist  
**Основано на:** Мастер-чеклист Фаза 1 (Module 4)
