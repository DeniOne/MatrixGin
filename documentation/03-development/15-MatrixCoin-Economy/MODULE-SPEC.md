# Модуль: MatrixCoin Economy (Внутренняя экономика)

**Приоритет:** КРИТИЧНЫЙ (MVP Phase 1)  
**Срок:** Недели 5-6  
**Команда:** 1 Backend + 1 Frontend разработчик

---

## 📋 ОПИСАНИЕ

Система внутренней экономики с двойной валютой (MC + GMC), транзакциями, магазином и аукционами. Интеграция с российскими платежными системами.

### Основные функции

✅ **Dual Currency System:**
- **MC (MatrixCoin)** - сгораемые, операционные (TTL: 90 дней)
- **GMC (Golden MatrixCoin)** - вечные, стратегические
- Конвертация MC → GMC через аукцион

✅ **Wallet Management:**
- Балансы MC и GMC
- История транзакций
- "Сейф" - заморозка MC на 30 дней (предотвращение сгорания)

✅ **Transactions:**
- Перевод MC/GMC между пользователями
- Автоматическое начисление за задачи, достижения
- Списание за покупки в магазине

✅ **Store:**
- Товары и услуги за MC/GMC
- Скидки по рангу (Инвестор, Магнат)
- Инвентарь и лимиты

✅ **Auction System:**
- Real-time торги (WebSocket)
- Правило "Антиснайпер" (продление при ставке в последние 5 мин)
- Конвертация MC → GMC

✅ **Payment Integration:**
- СберБанк API
- Тинькофф API
- ЮКасса
- Пополнение баланса рублями

---

## 🗄️ БАЗА ДАННЫХ

### Таблицы

```sql
-- Кошельки
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    mc_balance INTEGER DEFAULT 0,
    gmc_balance INTEGER DEFAULT 0,
    mc_frozen INTEGER DEFAULT 0, -- в сейфе
    safe_until TIMESTAMPTZ, -- до какой даты заморожено
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Транзакции
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID REFERENCES users(id),
    to_user_id UUID REFERENCES users(id),
    
    amount INTEGER NOT NULL,
    currency VARCHAR(10) NOT NULL, -- MC, GMC, RUB
    type VARCHAR(50) NOT NULL, -- reward, transfer, purchase, payment
    
    -- Метаданные
    description TEXT,
    reference_type VARCHAR(50), -- task, achievement, store_item
    reference_id UUID,
    
    status VARCHAR(50) DEFAULT 'completed', -- pending, completed, failed
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Магазин
CREATE TABLE store_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    
    -- Цена
    price_mc INTEGER,
    price_gmc INTEGER,
    price_rub DECIMAL(10,2),
    
    -- Скидки по рангу
    discount_investor INTEGER DEFAULT 0, -- % скидка
    discount_magnate INTEGER DEFAULT 0,
    
    -- Инвентарь
    stock INTEGER DEFAULT -1, -- -1 = unlimited
    max_per_user INTEGER DEFAULT -1,
    
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Покупки
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    item_id UUID REFERENCES store_items(id),
    
    quantity INTEGER DEFAULT 1,
    price_paid INTEGER,
    currency_paid VARCHAR(10),
    
    status VARCHAR(50) DEFAULT 'completed', -- pending, completed, cancelled
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Аукционы
CREATE TABLE auctions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    starting_bid_mc INTEGER NOT NULL,
    current_bid_mc INTEGER,
    current_winner_id UUID REFERENCES users(id),
    
    gmc_reward INTEGER NOT NULL, -- сколько GMC получит победитель
    
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    
    status VARCHAR(50) DEFAULT 'upcoming', -- upcoming, active, ended
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ставки на аукционе
CREATE TABLE auction_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    
    bid_amount_mc INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MC Lifecycle (для отслеживания сгорания)
CREATE TABLE mc_lifecycle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    
    amount INTEGER NOT NULL,
    earned_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL, -- +90 дней от earned_at
    
    is_frozen BOOLEAN DEFAULT false,
    is_expired BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_wallets_user ON wallets(user_id);
CREATE INDEX idx_transactions_from ON transactions(from_user_id);
CREATE INDEX idx_transactions_to ON transactions(to_user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_store_items_active ON store_items(is_active);
CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_auctions_status ON auctions(status);
CREATE INDEX idx_auction_bids_auction ON auction_bids(auction_id);
CREATE INDEX idx_mc_lifecycle_user ON mc_lifecycle(user_id);
CREATE INDEX idx_mc_lifecycle_expires ON mc_lifecycle(expires_at) WHERE is_expired = false;
```

---

## 🔌 API ENDPOINTS

### Wallet Endpoints

#### GET `/api/economy/balance/{userId}`
Получить баланс кошелька

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "user-uuid-1",
    "mc": {
      "total": 1250,
      "available": 1150,
      "frozen": 100,
      "safeUntil": "2025-12-22T10:00:00Z"
    },
    "gmc": {
      "total": 50
    },
    "statistics": {
      "totalEarned": 2450,
      "totalSpent": 1200,
      "expiringIn7Days": 150
    }
  }
}
```

#### POST `/api/economy/safe/activate`
Активировать "Сейф" (заморозка MC на 30 дней)

**Request:**
```json
{
  "amount": 500
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "frozen": 500,
    "safeUntil": "2025-12-22T10:00:00Z",
    "fee": 25
  }
}
```

#### GET `/api/economy/safe/status/{userId}`
Статус сейфа

---

### Transaction Endpoints

#### GET `/api/economy/transactions`
История транзакций

**Query:**
```
?userId=uuid-123
&type=reward,transfer
&currency=MC
&page=1
&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "tx-1",
      "from": { "id": "system", "name": "System" },
      "to": { "id": "user-1", "name": "Иван Иванов" },
      "amount": 100,
      "currency": "MC",
      "type": "reward",
      "description": "Награда за выполнение задачи",
      "createdAt": "2025-11-22T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156
  }
}
```

#### POST `/api/economy/transactions`
Создать транзакцию (перевод)

**Request:**
```json
{
  "toUserId": "user-uuid-2",
  "amount": 50,
  "currency": "MC",
  "description": "Спасибо за помощь"
}
```

---

### Store Endpoints

#### GET `/api/economy/store`
Список товаров в магазине

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "item-1",
      "name": "Дополнительный день отпуска",
      "description": "1 день оплачиваемого отпуска",
      "imageUrl": "https://storage.../vacation.jpg",
      "price": {
        "mc": 500,
        "gmc": null,
        "rub": 3000
      },
      "discount": {
        "investor": 10,
        "magnate": 20
      },
      "stock": -1,
      "category": "benefits"
    }
  ]
}
```

#### GET `/api/economy/store/{itemId}`
Детали товара

#### POST `/api/economy/store/{itemId}/buy`
Купить товар

**Request:**
```json
{
  "quantity": 1,
  "currency": "MC"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "purchaseId": "purchase-1",
    "itemName": "Дополнительный день отпуска",
    "pricePaid": 450,
    "currencyPaid": "MC",
    "discount": 10,
    "newBalance": {
      "mc": 700
    }
  }
}
```

---

### Auction Endpoints

#### GET `/api/economy/auction`
Список активных аукционов

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "auction-1",
      "title": "Аукцион за 100 GMC",
      "description": "Конвертация MC в GMC",
      "startingBid": 5000,
      "currentBid": 7500,
      "currentWinner": {
        "id": "user-1",
        "name": "Иван Иванов"
      },
      "gmcReward": 100,
      "startTime": "2025-11-22T10:00:00Z",
      "endTime": "2025-11-22T18:00:00Z",
      "status": "active",
      "timeRemaining": 14400
    }
  ]
}
```

#### GET `/api/economy/auction/{id}`
Детали аукциона

#### POST `/api/economy/auction/{id}/bid`
Сделать ставку

**Request:**
```json
{
  "bidAmount": 8000
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "currentBid": 8000,
    "yourBid": true,
    "endTimeExtended": true,
    "newEndTime": "2025-11-22T18:10:00Z"
  }
}
```

#### GET `/api/economy/auction/{id}/history`
История ставок

---

### Payment Endpoints

#### POST `/api/economy/payment/sberbank`
Оплата через СберБанк

**Request:**
```json
{
  "amount": 1000,
  "currency": "RUB",
  "description": "Пополнение MC баланса"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay-1",
    "paymentUrl": "https://securepayments.sberbank.ru/...",
    "amount": 1000,
    "currency": "RUB"
  }
}
```

#### POST `/api/economy/payment/tinkoff`
Оплата через Тинькофф

#### POST `/api/economy/payment/yookassa`
Оплата через ЮКасса

#### GET `/api/economy/payment/{transactionId}`
Статус платежа

---

## 🛠️ ТЕХНОЛОГИЧЕСКИЙ СТЕК

### Backend
- **Nest.js** ✅
- **Prisma ORM** ✅
- **BullMQ** - очереди для MC expiration
- **Socket.io** - real-time auction updates
- **Payment SDKs:**
  - @a2seven/yoo-checkout (ЮКасса)
  - node-sberbank-acquiring (СберБанк)
  - tinkoff-payment-sdk (Тинькофф)

### Frontend
- **React 18** ✅
- **Redux Toolkit** ✅
- **Socket.io Client** - real-time auction
- **Chart.js** - баланс графики

---

## 💰 ЛОГИКА MC LIFECYCLE

### Начисление MC
```typescript
// При выполнении задачи
await walletService.earnMC(userId, amount, {
  type: 'reward',
  referenceType: 'task',
  referenceId: taskId
});

// Создается запись в mc_lifecycle
{
  userId,
  amount,
  earnedAt: NOW(),
  expiresAt: NOW() + 90 days,
  isFrozen: false,
  isExpired: false
}
```

### Сгорание MC (Cron Job)
```typescript
// Ежедневно в 00:00
@Cron('0 0 * * *')
async checkExpiredMC() {
  const expired = await prisma.mcLifecycle.findMany({
    where: {
      expiresAt: { lte: new Date() },
      isExpired: false,
      isFrozen: false
    }
  });
  
  for (const record of expired) {
    // Списать MC с баланса
    await walletService.deductMC(record.userId, record.amount);
    
    // Отметить как expired
    await prisma.mcLifecycle.update({
      where: { id: record.id },
      data: { isExpired: true }
    });
    
    // Уведомить пользователя
    await notificationService.send(record.userId, {
      type: 'mc_expired',
      amount: record.amount
    });
  }
}
```

### Логика "Сейфа"
```typescript
async activateSafe(userId: string, amount: number) {
  const fee = Math.floor(amount * 0.05); // 5% комиссия
  const totalToFreeze = amount + fee;
  
  // Проверить баланс
  const wallet = await getWallet(userId);
  if (wallet.mc_balance < totalToFreeze) {
    throw new Error('Insufficient balance');
  }
  
  // Заморозить MC
  await prisma.wallet.update({
    where: { user_id: userId },
    data: {
      mc_balance: { decrement: totalToFreeze },
      mc_frozen: { increment: amount },
      safe_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });
  
  // Заморозить в mc_lifecycle
  await prisma.mcLifecycle.updateMany({
    where: {
      user_id: userId,
      is_expired: false,
      is_frozen: false
    },
    data: { is_frozen: true }
  });
}
```

---

## 🎯 AUCTION LOGIC

### Anti-Sniper Rule
```typescript
async placeBid(auctionId: string, userId: string, bidAmount: number) {
  const auction = await getAuction(auctionId);
  
  // Валидация
  if (bidAmount <= auction.currentBid) {
    throw new Error('Bid must be higher than current bid');
  }
  
  // Проверить баланс
  const wallet = await getWallet(userId);
  if (wallet.mc_balance < bidAmount) {
    throw new Error('Insufficient balance');
  }
  
  // Вернуть MC предыдущему лидеру
  if (auction.currentWinnerId) {
    await walletService.addMC(auction.currentWinnerId, auction.currentBid);
  }
  
  // Списать MC у нового лидера
  await walletService.deductMC(userId, bidAmount);
  
  // Обновить аукцион
  await prisma.auction.update({
    where: { id: auctionId },
    data: {
      current_bid_mc: bidAmount,
      current_winner_id: userId
    }
  });
  
  // Anti-Sniper: если ставка в последние 5 минут, продлить на 10 мин
  const timeRemaining = auction.endTime.getTime() - Date.now();
  if (timeRemaining < 5 * 60 * 1000) {
    const newEndTime = new Date(auction.endTime.getTime() + 10 * 60 * 1000);
    await prisma.auction.update({
      where: { id: auctionId },
      data: { end_time: newEndTime }
    });
  }
  
  // Real-time уведомление через WebSocket
  io.to(`auction:${auctionId}`).emit('new_bid', {
    bidAmount,
    bidder: userId,
    newEndTime: auction.endTime
  });
}
```

---

## 📊 МЕТРИКИ УСПЕХА

- [ ] MC транзакции работают без ошибок
- [ ] GMC балансы корректны
- [ ] Сгорание MC происходит по расписанию
- [ ] Сейф работает корректно
- [ ] Аукционы real-time обновляются
- [ ] Платежные интеграции работают
- [ ] Покрытие тестами >80%

---

## 📝 ЗАВИСИМОСТИ

### От других модулей
- `02-Authentication-Authorization` - user accounts
- `20-Task-Management` - начисление MC за задачи
- `01-Advanced-Gamification` - начисление за достижения

### Используется модулями
- `01-Advanced-Gamification` - ранги по GMC
- `03-Branch-Feedback-System` - награды MC
- `11-Kaizen-Continuous-Improvement` - награды за улучшения
