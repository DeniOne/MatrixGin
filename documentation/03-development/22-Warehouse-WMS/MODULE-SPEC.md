# Модуль: Warehouse WMS

**Приоритет:** ERP  
**Срок:** Phase 3

---

## 📋 ОПИСАНИЕ

Warehouse Management System с inventory, движением товаров и отчетами.

### Функции

- **Inventory** - учет товаров на складе
- **Stock Movements** - приход/расход
- **Locations** - адресное хранение
- **Barcode Scanning** - сканирование штрихкодов
- **Stock Levels** - min/max уровни
- **Reports** - складские отчеты

---

## 🗄️ DATABASE

```sql
CREATE TABLE warehouse_products (
    id UUID PRIMARY KEY,
    sku VARCHAR(100) UNIQUE,
    name VARCHAR(255),
    quantity INTEGER DEFAULT 0,
    location VARCHAR(100),
    min_stock INTEGER,
    max_stock INTEGER
);

CREATE TABLE stock_movements (
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES warehouse_products(id),
    movement_type VARCHAR(50),
    quantity INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 API

- GET `/api/warehouse/inventory`
- POST `/api/warehouse/movements`
- GET `/api/warehouse/stock-levels`
- POST `/api/warehouse/scan` (barcode)
