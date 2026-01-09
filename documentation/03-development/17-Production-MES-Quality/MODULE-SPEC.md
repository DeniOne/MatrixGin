# Модуль: Production MES & Quality

**Приоритет:** ERP  
**Срок:** Phase 3

---

## 📋 ОПИСАНИЕ

Manufacturing Execution System с контролем качества и production planning.

### Функции

- **Production Orders** - производственные заказы
- **Work Orders** - наряды на работу
- **Quality Control** - контроль качества
- **Defects Tracking** - учет брака
- **Equipment Management** - управление оборудованием
- **Production Reports** - отчеты производства

---

## 🗄️ DATABASE

```sql
CREATE TABLE production_orders (
    id UUID PRIMARY KEY,
    product_name VARCHAR(255),
    quantity INTEGER,
    status VARCHAR(50),
    start_date DATE,
    completion_date DATE
);

CREATE TABLE quality_checks (
    id UUID PRIMARY KEY,
    production_order_id UUID REFERENCES production_orders(id),
    inspector_id UUID REFERENCES users(id),
    result VARCHAR(50),
    defects_found INTEGER DEFAULT 0
);
```

---

## 🔌 API

- POST `/api/production/orders`
- GET `/api/production/orders/{id}`
- POST `/api/quality/check`
- GET `/api/production/reports`
