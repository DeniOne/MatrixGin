STORE-API.md

Module: MatrixCoin Economy
Submodule: Store (MC)
Status: Canonical Contract
Scope: Frontend ↔ Backend API

0. Общие принципы
0.1 Протокол

Transport: HTTPS

Format: JSON

Auth: JWT (Bearer)

Base path: /api/store

0.2 Идемпотентность

Все write-операции ОБЯЗАНЫ поддерживать idempotency.

Заголовок:

Idempotency-Key: <uuid>

0.3 Валюта

Store работает ТОЛЬКО с MC

GMC, RUB, иные активы — вне этого API

1. Store Items (каталог)
1.1 Получить список товаров
GET /api/store/items

Query params (optional)
param	type	description
category	string	Фильтр по категории
active	boolean	По умолчанию true
Response 200
{
  "items": [
    {
      "id": "store_item_001",
      "title": "Дополнительный выходной",
      "description": "1 дополнительный оплачиваемый выходной",
      "priceMC": 500,
      "category": "time",
      "active": true,
      "stock": null,
      "purchaseLimit": 1,
      "metadata": {
        "requiresApproval": true
      }
    }
  ]
}

Инварианты

stock = null → товар бесконечный

purchaseLimit = null → без ограничений

Frontend НЕ вычисляет доступность — только отображает

1.2 Получить товар по ID
GET /api/store/items/{itemId}

Response 200
{
  "id": "store_item_001",
  "title": "Дополнительный выходной",
  "description": "1 дополнительный оплачиваемый выходной",
  "priceMC": 500,
  "category": "time",
  "active": true,
  "stock": null,
  "purchaseLimit": 1,
  "metadata": {
    "requiresApproval": true
  }
}

Errors
code	meaning
404	Item not found
410	Item inactive
2. Purchase (покупка)
2.1 Создать покупку
POST /api/store/purchase

Headers
Authorization: Bearer <JWT>
Idempotency-Key: <uuid>

Request body
{
  "itemId": "store_item_001"
}

Response 201 — SUCCESS
{
  "purchaseId": "purchase_789",
  "itemId": "store_item_001",
  "priceMC": 500,
  "status": "COMPLETED",
  "wallet": {
    "balanceBefore": 1200,
    "balanceAfter": 700
  },
  "createdAt": "2026-01-18T12:00:00Z"
}

Возможные статусы покупки
status	meaning
COMPLETED	Покупка завершена
PENDING_APPROVAL	Требует ручного подтверждения
REJECTED	Отклонена
ROLLED_BACK	Откат после ошибки
Errors
HTTP	code	meaning
400	INVALID_ITEM	itemId некорректен
402	INSUFFICIENT_FUNDS	Недостаточно MC
403	PURCHASE_LIMIT_EXCEEDED	Превышен лимит
404	ITEM_NOT_FOUND	Товар не найден
409	IDEMPOTENCY_CONFLICT	Повтор с другим payload
410	ITEM_INACTIVE	Товар отключён
422	BUSINESS_RULE_VIOLATION	Инвариант нарушен
500	INTERNAL_ERROR	Сработал rollback
3. Purchases (история)
3.1 Получить мои покупки
GET /api/store/purchases

Response 200
{
  "purchases": [
    {
      "id": "purchase_789",
      "itemId": "store_item_001",
      "title": "Дополнительный выходной",
      "priceMC": 500,
      "status": "COMPLETED",
      "createdAt": "2026-01-18T12:00:00Z"
    }
  ]
}

3.2 Получить покупку по ID
GET /api/store/purchases/{purchaseId}

Response 200
{
  "id": "purchase_789",
  "itemId": "store_item_001",
  "title": "Дополнительный выходной",
  "priceMC": 500,
  "status": "COMPLETED",
  "audit": {
    "transactionId": "tx_456",
    "rollback": false
  },
  "createdAt": "2026-01-18T12:00:00Z"
}

4. Error format (единый)
{
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Not enough MatrixCoin balance",
    "details": {}
  }
}

5. Жёсткие правила (NON-NEGOTIABLE)

Frontend НЕ:

считает баланс

проверяет лимиты

симулирует покупку

Backend ОБЯЗАН:

быть транзакционным

поддерживать rollback

логировать purchase как экономическое событие

Если эндпоинта нет в этом файле — его не существует

6. Связанные документы

STORE-FLOW.md — бизнес-логика покупки

STORE-UX.md — пользовательский интерфейс

STORE-TECH.md — сущности и инварианты

STORE-API.md — источник истины для интеграции.