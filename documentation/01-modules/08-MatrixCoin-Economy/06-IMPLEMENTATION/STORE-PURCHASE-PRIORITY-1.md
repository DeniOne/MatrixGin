# Module 08 — MatrixCoin Economy
## Submodule — Store (MC)
## PRIORITY 1: Purchase Core

**Статус:** BLOCKING  
**Scope:** Минимальная реализация покупки товаров  
**Критерий:** Без закрытия PRIORITY 1 — дальнейшая разработка ЗАПРЕЩЕНА

---

## PHASE 0 — Архитектурная фиксация (BLOCKING)

### 0.1 Разведение ответственности

- [ ] Переименовать `StoreAccessService` → `StoreEligibilityService`
- [ ] Убрать любые упоминания purchase / exchange из access-кода
- [ ] Зафиксировать: **Eligibility ≠ Purchase**

**Acceptance:**
- Store Access не содержит логики списаний / транзакций
- Purchase Core не зависит от Eligibility (может вызываться после него)

---

## PHASE 1 — Domain Model (ОБЯЗАТЕЛЬНО)

### 1.1 Purchase Entity

- [ ] `purchase.entity.ts`
- [ ] `PurchaseStatus` enum
- [ ] Prisma / DB migration

```typescript
Purchase {
  id: string
  userId: string
  itemId: string
  priceMC: number
  status: PurchaseStatus
  transactionId: string
  idempotencyKey: string
  createdAt: Date
}

enum PurchaseStatus {
  COMPLETED
  PENDING_APPROVAL
  REJECTED
  ROLLED_BACK
}
```

**Acceptance:**
- Purchase хранится в БД
- Status enum = `COMPLETED | PENDING_APPROVAL | REJECTED | ROLLED_BACK`

---

### 1.2 StoreItem Schema Fix

- [ ] `name` → `title`
- [ ] `mcCost` → `priceMC`
- [ ] `isAvailable` → `active`
- [ ] Добавить `purchaseLimit`
- [ ] Добавить `metadata`

**Acceptance:**
- StoreItem 1:1 соответствует STORE-TECH.md

---

## PHASE 2 — Idempotency Core (CRITICAL)

### 2.1 Idempotency Storage

- [ ] Таблица / репозиторий idempotency keys
- [ ] Key = `(userId + endpoint + idempotencyKey)`
- [ ] Payload hash

**Acceptance:**
- Повторный запрос → возвращает тот же Purchase
- Payload mismatch → `409 IDEMPOTENCY_CONFLICT`

---

## PHASE 3 — Transactional Purchase Flow (CORE)

### 3.1 Purchase Service

- [ ] `purchase.service.ts`
- [ ] Реализация 9-step flow:

```
1. Validate item
2. Validate limits
3. Validate wallet balance
4. BEGIN TRANSACTION
5. Create Purchase
6. Create EconomyTransaction
7. Update stock
8. COMMIT
9. Audit log
```

**Acceptance:**
- Весь flow — в одной DB transaction
- НЕТ async-побочных эффектов

---

### 3.2 Wallet Integration

- [ ] Списание MC через Economy layer
- [ ] `amountMC < 0`
- [ ] `referenceId = purchase.id`

**Acceptance:**
- Баланс меняется атомарно
- Нет "висячих" транзакций

---

### 3.3 Rollback Logic

- [ ] try/catch на транзакции
- [ ] Status → `ROLLED_BACK`
- [ ] Баланс восстановлен
- [ ] Idempotency сохранена

**Acceptance:**
- Ошибка на любом шаге ≠ потеря MC
- Повторный запрос безопасен

---

## PHASE 4 — API Entry Point (MINIMUM)

### 4.1 POST /api/store/purchase

- [ ] Controller
- [ ] DTO validation
- [ ] `Idempotency-Key` header
- [ ] Error mapping (400/402/403/409/422/500)

**Acceptance:**
- Endpoint реально покупает товар
- Соответствует STORE-API.md §2.1

---

## PHASE 5 — Audit & Observability

### 5.1 Audit Events

- [ ] `PURCHASE_CREATED`
- [ ] `PURCHASE_COMPLETED`
- [ ] `PURCHASE_ROLLED_BACK`
- [ ] `ECONOMY_TX_CREATED`

**Acceptance:**
- Все события коррелируются по:
  - `purchaseId`
  - `transactionId`
  - `userId`
  - `idempotencyKey`

---

## PHASE 6 — Guards & Safety

### 6.1 Mandatory Guards

- [ ] `AuthGuard`
- [ ] User active
- [ ] StoreEligibility (если используется)

**Acceptance:**
- Purchase невозможен без Auth
- Guards НЕ делают бизнес-логику

---

## PHASE 7 — Minimal Verification (SELF-CHECK)

### 7.1 Smoke Tests (ручные допустимы)

- [ ] Успешная покупка
- [ ] Недостаточно MC → 402
- [ ] Повторный запрос → тот же Purchase
- [ ] Искусственная ошибка → rollback
- [ ] Повтор после rollback → тот же результат

---

## PHASE 8 — Критерий закрытия PRIORITY 1

**PRIORITY 1 считается ЗАКРЫТЫМ, если:**

- [ ] `POST /api/store/purchase` существует и работает
- [ ] MC списываются атомарно
- [ ] Idempotency гарантирована
- [ ] Rollback доказуем
- [ ] Purchase — отдельная сущность
- [ ] Audit события есть

**Если хотя бы один пункт ❌ — PRIORITY 1 НЕ ЗАКРЫТ.**

---

## СТРОГО ЗАПРЕЩЕНО ДО ЗАКРЫТИЯ PRIORITY 1

- ❌ UI Store
- ❌ `GET /store/items`
- ❌ `GET /store/purchases`
- ❌ Approval flows
- ❌ GMC logic
- ❌ Любые "временные заглушки"

---

## Связанные документы

- [STORE-TECH.md](./STORE-TECH.md) — техническая спецификация
- [STORE-API.md](./STORE-API.md) — API контракт
- [STORE-FLOW.md](./STORE-FLOW.md) — бизнес-логика покупки
- [Store Compliance Report](C:\Users\DeniOne\.gemini\antigravity\brain\e69942dd-ce49-49ec-9695-e1fca3b44398\store_compliance_report.md) — отчёт о несоответствии

---

**СТАТУС:** READY FOR IMPLEMENTATION
