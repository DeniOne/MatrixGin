# PHASE 0 — Store Purchase Core (Архитектурная фиксация)

## Цель

Выполнить **PHASE 0** из документа [STORE-PURCHASE-PRIORITY-1.md](file:///f:/Matrix_Gin/documentation/01-modules/08-MatrixCoin-Economy/06-IMPLEMENTATION/STORE-PURCHASE-PRIORITY-1.md):

1. Разделить ответственность: **Eligibility** (доступ к Store) ≠ **Purchase** (транзакции)
2. Создать доменные модели `StoreItem` и `Purchase` согласно [STORE-TECH.md](file:///f:/Matrix_Gin/documentation/01-modules/08-MatrixCoin-Economy/06-IMPLEMENTATION/STORE-TECH.md)
3. Подготовить фундамент для транзакционного Purchase Flow (PHASE 1-8)

---

## User Review Required

> [!IMPORTANT]
> **Критическое архитектурное решение:**
> - Существующий [StoreAccessService](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/services/store-access.service.ts#48-137) будет переименован в `StoreEligibilityService`
> - Старая модель `Purchase` (связанная с `Product`) будет **удалена** и заменена новой (связанной с `StoreItem`)
> - Это **breaking change** для любого кода, использующего старую модель `Purchase`

> [!WARNING]
> **Проверьте:**
> - Используется ли где-то старая модель `Purchase` (связанная с `Product`)?
> - Есть ли production-данные в таблице `purchases`, которые нужно сохранить?

---

## Proposed Changes

### Backend — MatrixCoin Economy Module

#### Архитектурное разделение

**Переименование файлов:**

- [RENAME] [store-access.service.ts](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/services/store-access.service.ts) → `store-eligibility.service.ts`
- [RENAME] [store-access.logic.ts](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/core/store-access.logic.ts) → `store-eligibility.logic.ts`
- [RENAME] [store-access.guards.ts](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/guards/store-access.guards.ts) → `store-eligibility.guards.ts`
- [RENAME] [store-access.adapter.ts](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/services/store-access.adapter.ts) → `store-eligibility.adapter.ts`

**Изменения:**
- Класс [StoreAccessService](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/services/store-access.service.ts#48-137) → `StoreEligibilityService`
- Все функции/типы с префиксом `StoreAccess*` → `StoreEligibility*`
- Удалить любые упоминания `purchase` / `exchange` из eligibility-кода
- Добавить явный комментарий: "Eligibility ≠ Purchase"

**Обновление импортов:**
- Найти все файлы, импортирующие [StoreAccessService](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/services/store-access.service.ts#48-137)
- Обновить импорты на `StoreEligibilityService`

---

#### [MODIFY] [schema.prisma](file:///f:/Matrix_Gin/backend/prisma/schema.prisma)

**Добавить модели:**

```prisma
enum PurchaseStatus {
  COMPLETED
  PENDING_APPROVAL
  REJECTED
  ROLLED_BACK
}

model StoreItem {
  id            String    @id @default(uuid())
  title         String
  description   String
  priceMC       Decimal   @db.Decimal(10, 2)
  category      String
  active        Boolean   @default(true)
  stock         Int?
  purchaseLimit Int?
  metadata      Json      @default("{}")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  purchases     Purchase[]

  @@map("store_items")
}

model Purchase {
  id             String         @id @default(uuid())
  userId         String
  itemId         String
  priceMC        Decimal        @db.Decimal(10, 2)
  status         PurchaseStatus @default(COMPLETED)
  transactionId  String
  idempotencyKey String
  createdAt      DateTime       @default(now())

  user           User           @relation(fields: [userId], references: [id])
  item           StoreItem      @relation(fields: [itemId], references: [id])

  @@unique([userId, idempotencyKey])
  @@index([userId])
  @@index([itemId])
  @@map("purchases")
}
```

**Удалить старую модель:**
- Удалить модель `Purchase` (строки ~477-489), связанную с `Product`
- Удалить relation `purchases Purchase[]` из модели `Product`

---

#### [NEW] [store.types.ts](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/core/store.types.ts)

Типы для доменных моделей Store:

```typescript
import { PurchaseStatus } from '@prisma/client';

export interface StoreItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly priceMC: number;
  readonly category: string;
  readonly active: boolean;
  readonly stock: number | null;
  readonly purchaseLimit: number | null;
  readonly metadata: Record<string, unknown>;
}

export interface Purchase {
  readonly id: string;
  readonly userId: string;
  readonly itemId: string;
  readonly priceMC: number;
  readonly status: PurchaseStatus;
  readonly transactionId: string;
  readonly idempotencyKey: string;
  readonly createdAt: Date;
}

export { PurchaseStatus };
```

---

#### [NEW] [purchase.types.ts](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/core/purchase.types.ts)

Типы для Purchase Flow (заготовка для PHASE 1+):

```typescript
import { Purchase, PurchaseStatus } from './store.types';

export interface PurchaseContext {
  readonly userId: string;
  readonly itemId: string;
  readonly idempotencyKey: string;
  readonly timestamp: Date;
}

export interface PurchaseResult {
  readonly purchase: Purchase;
  readonly balanceBefore: number;
  readonly balanceAfter: number;
}

export enum PurchaseErrorCode {
  INVALID_ITEM = 'INVALID_ITEM',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  PURCHASE_LIMIT_EXCEEDED = 'PURCHASE_LIMIT_EXCEEDED',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  ITEM_INACTIVE = 'ITEM_INACTIVE',
  IDEMPOTENCY_CONFLICT = 'IDEMPOTENCY_CONFLICT',
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class PurchaseError extends Error {
  constructor(
    public readonly code: PurchaseErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'PurchaseError';
  }
}
```

---

### Database Migration

#### [NEW] Migration: `store_purchase_core_phase0`

Команда:
```bash
npx prisma migrate dev --name store_purchase_core_phase0
```

**Ожидаемые изменения:**
- Создание таблицы `store_items`
- Создание enum `PurchaseStatus`
- **Удаление** старой таблицы `purchases` (если нет production-данных)
- Создание новой таблицы `purchases` с правильной структурой

---

## Verification Plan

### Automated Tests

```bash
# Проверка компиляции TypeScript
cd backend
npm run build

# Проверка Prisma схемы
npx prisma validate

# Генерация Prisma Client
npx prisma generate
```

### Manual Verification

1. **Проверка переименования:**
   - Поиск по кодовой базе: [StoreAccessService](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/services/store-access.service.ts#48-137) не должен встречаться
   - Все импорты обновлены на `StoreEligibilityService`

2. **Проверка БД:**
   - Таблица `store_items` создана
   - Таблица `purchases` имеет правильную структуру (с `itemId`, `status`, `idempotencyKey`)
   - Enum `PurchaseStatus` существует

3. **Проверка типов:**
   - `import { StoreItem, Purchase, PurchaseStatus } from './core/store.types'` работает
   - TypeScript не выдаёт ошибок

---

## Acceptance Criteria

- [ ] `StoreEligibilityService` не содержит логики списаний/транзакций
- [ ] `Purchase` — отдельная сущность в БД с правильной структурой
- [ ] `StoreItem` соответствует STORE-TECH.md (все поля присутствуют)
- [ ] Все импорты обновлены, TypeScript компилируется без ошибок
- [ ] Миграция применена успешно
- [ ] Нет breaking changes в production-коде (или они задокументированы)

---

## Риски

1. **Breaking Change:** Старая модель `Purchase` будет удалена
   - **Митигация:** Проверить использование перед удалением
2. **Production Data Loss:** Если в таблице `purchases` есть данные
   - **Митигация:** Сделать backup перед миграцией или написать data migration script

---

## Следующие шаги (после PHASE 0)

После утверждения и закрытия PHASE 0:
- **PHASE 1:** Domain Model (Purchase Entity, StoreItem Schema Fix)
- **PHASE 2:** Idempotency Core
- **PHASE 3:** Transactional Purchase Flow
- **PHASE 4-8:** API, Audit, Guards, Verification
