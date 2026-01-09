# Модуль: HR Analytics & Matrix360

**Приоритет:** POST-MVP  
**Срок:** Phase 2

---

## 📋 ОПИСАНИЕ

360-градусная оценка сотрудников с peer reviews, self-assessment и аналитикой HR.

### Функции

- **360° Reviews** - оценка от коллег, руководителей, подчиненных
- **Self-Assessment** - самооценка
- **Competency Matrix** - матрица компетенций
- **Performance Reviews** - регулярные оценки
- **Reports** - HR analytics

---

## 🗄️ DATABASE

```sql
CREATE TABLE performance_reviews (
    id UUID PRIMARY KEY,
    employee_id UUID REFERENCES users(id),
    reviewer_id UUID REFERENCES users(id),
    review_type VARCHAR(50),
    scores JSONB,
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 API

- POST `/api/hr/reviews`
- GET `/api/hr/reviews/{userId}`
- GET `/api/hr/360-report/{userId}`
