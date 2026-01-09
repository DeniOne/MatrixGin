# Модуль: Budgeting & Planning

**Приоритет:** ERP  
**Срок:** Phase 3  
**Команда:** 1 Backend + 1 Frontend

---

## 📋 ОПИСАНИЕ

Система бюджетирования, финансового планирования и управления расходами.

### Основные функции

- **Budgets** - бюджеты по департаментам/проектам
- **Expense Tracking** - учет расходов
- **Forecasting** - прогнозирование на основе AI
- **Approvals** - workflow согласования бюджетов
- **Reports** - план-факт анализ

---

## 🗄️ DATABASE

```sql
CREATE TABLE budgets (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    department_id UUID,
    period VARCHAR(50),
    allocated_amount DECIMAL(15,2),
    spent_amount DECIMAL(15,2) DEFAULT 0,
    start_date DATE,
    end_date DATE
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY,
    budget_id UUID REFERENCES budgets(id),
    amount DECIMAL(15,2),
    category VARCHAR(100),
    description TEXT,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 API

- GET `/api/budgets`
- POST `/api/budgets`
- GET `/api/budgets/{id}/expenses`
- POST `/api/expenses`
- GET `/api/budgets/{id}/forecast`

---

## 📝 ЗАВИСИМОСТИ

- `08-Employee-Management` - department info
- `16-Procurement` - expense связь
