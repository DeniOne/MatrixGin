# Модуль: Fixed Assets Management

**Приоритет:** ERP  
**Срок:** Phase 3  
**Команда:** 1 Backend + 1 Frontend

---

## 📋 ОПИСАНИЕ

Учет основных средств (ОС) с амортизацией, инвентаризацией и lifecycle management.

### Основные функции

- **Asset Registry** - реестр ОС
- **Depreciation** - расчет амортизации
- **Inventory** - инвентаризация
- **Maintenance** - обслуживание оборудования
- **Disposal** - списание ОС
- **QR Codes** - маркировка активов

---

## 🗄️ DATABASE

```sql
CREATE TABLE fixed_assets (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    asset_number VARCHAR(100) UNIQUE,
    category VARCHAR(100),
    purchase_date DATE,
    purchase_cost DECIMAL(15,2),
    depreciation_rate DECIMAL(5,2),
    current_value DECIMAL(15,2),
    location VARCHAR(255),
    status VARCHAR(50),
    qr_code VARCHAR(255)
);

CREATE TABLE asset_maintenance (
    id UUID PRIMARY KEY,
    asset_id UUID REFERENCES fixed_assets(id),
    maintenance_date DATE,
    description TEXT,
    cost DECIMAL(10,2)
);
```

---

## 🔌 API

- GET `/api/assets`
- POST `/api/assets`
- PUT `/api/assets/{id}`
- GET `/api/assets/{id}/depreciation`
- POST `/api/assets/{id}/maintenance`
- POST `/api/assets/{id}/dispose`

---

## 📝 ЗАВИСИМОСТИ

- `04-Budgeting-Planning` - asset costs
- QR code generation library
