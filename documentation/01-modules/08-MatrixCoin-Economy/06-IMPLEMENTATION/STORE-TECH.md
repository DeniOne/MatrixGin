STORE-TECH.md

Module: MatrixCoin Economy
Submodule: Store (MC)
Status: Canonical Implementation Spec
Scope: Backend domain + invariants

0. Назначение подмодуля Store

Store — это детерминированный механизм обмена MC → результат, где:

результат = факт покупки + побочный эффект (если есть)

Store НЕ:

мотивация

KPI

геймификация

финансовая система

Store ДА:

экономическая операция

списание MC

фиксация события

1. Доменные сущности
1.1 StoreItem
StoreItem {
  id: string
  title: string
  description: string
  priceMC: number
  category: string
  active: boolean
  stock: number | null
  purchaseLimit: number | null
  metadata: {
    requiresApproval?: boolean
    [key: string]: unknown
  }
}

Инварианты StoreItem

priceMC > 0

active = false → покупка запрещена

stock = null → бесконечный товар

stock = 0 → покупка запрещена

purchaseLimit применяется на пользователя

1.2 Purchase
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

PurchaseStatus
enum PurchaseStatus {
  COMPLETED
  PENDING_APPROVAL
  REJECTED
  ROLLED_BACK
}

Инварианты Purchase

priceMC фиксируется на момент покупки

transactionId обязателен

idempotencyKey уникален в пределах user + endpoint

Purchase НЕ МОЖЕТ менять статус назад (кроме rollback)

1.3 EconomyTransaction (зависимая сущность)

Store НЕ владеет, но ОБЯЗАН создавать:

EconomyTransaction {
  id: string
  walletId: string
  amountMC: number   // всегда отрицательное
  type: 'STORE_PURCHASE'
  referenceId: Purchase.id
  createdAt: Date
}

2. Поток покупки (строго)
2.1 Последовательность
1. Validate item
2. Validate purchase limits
3. Validate wallet balance
4. Begin DB transaction
5. Create Purchase (PENDING или COMPLETED)
6. Create EconomyTransaction
7. Apply stock decrement (если есть)
8. Commit
9. Emit audit log

2.2 Условные ветки

requiresApproval = true
→ Purchase.status = PENDING_APPROVAL

Ошибка на любом шаге после (4)
→ rollback + Purchase.status = ROLLED_BACK

3. Транзакционность (ОБЯЗАТЕЛЬНО)
3.1 Границы транзакции

В одной DB-транзакции должны быть:

Purchase

EconomyTransaction

Stock update

3.2 Rollback-правила

Rollback считается успешным, если:

баланс кошелька восстановлен

Purchase зафиксирован как ROLLED_BACK

повтор по тому же idempotencyKey возвращает тот же результат

4. Идемпотентность
4.1 Ключ
(userId + endpoint + idempotencyKey)

4.2 Поведение
Сценарий	Результат
Повтор с тем же payload	200 + тот же Purchase
Повтор с другим payload	409 IDEMPOTENCY_CONFLICT
5. Ограничения и запреты
5.1 Запрещено

менять цену после покупки

создавать Purchase без EconomyTransaction

списывать MC вне Store Flow

обрабатывать Store без DB-транзакции

делать async-purchase без фиксации Purchase

5.2 Не входит в Store

начисление GMC

автоматическое одобрение PENDING

delivery / fulfillment

UI-логика

6. Аудит и наблюдаемость
6.1 Обязательные логи

PURCHASE_CREATED

PURCHASE_COMPLETED

PURCHASE_ROLLED_BACK

ECONOMY_TX_CREATED

6.2 Корреляция

Все логи обязаны иметь:

purchaseId
transactionId
idempotencyKey
userId

7. Расширяемость (design rule)

StoreItem.metadata — единственная точка расширения:

новые типы товаров

approval-процессы

внешние эффекты

Добавление нового типа StoreItem НЕ должно ломать API.

8. Критерий принятия подмодуля

Store считается ЗАКРЫТЫМ, если:

любой пользователь может купить товар

баланс корректно меняется

повторный запрос безопасен

rollback работает

разработчик понимает Store без чтения всего проекта

9. Связанные документы

STORE-API.md — HTTP-контракт

STORE-FLOW.md — бизнес-алгоритм

STORE-UX.md — пользовательский интерфейс

STORE-TECH.md — технический закон Store.