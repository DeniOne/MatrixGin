# Модуль: Procurement

**Приоритет:** ERP  
**Срок:** Phase 3

---

## 📋 ОПИСАНИЕ

Система закупок с заявками, согласованиями и поставщиками.

### Функции

- **Purchase Requests** - заявки на закупку
- **Approvals** - multi-level согласование
- **Suppliers** - база поставщиков
- **RFQ** - запросы коммерческих предложений
- **Orders** - заказы поставщикам
- **Delivery Tracking** - отслеживание поставок

---

## 🗄️ DATABASE

```sql
CREATE TABLE purchase_requests (
    id UUID PRIMARY KEY,
    requester_id UUID REFERENCES users(id),
    item_name VARCHAR(255),
    quantity INTEGER,
    estimated_cost DECIMAL(15,2),
    status VARCHAR(50),
    approved_by UUID REFERENCES users(id)
);

CREATE TABLE suppliers (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    contact_info JSONB,
    rating DECIMAL(3,2)
);
```

---

## 🔌 API

- POST `/api/procurement/requests`
- POST `/api/procurement/requests/{id}/approve`
- GET `/api/procurement/suppliers`
- POST `/api/procurement/orders`
