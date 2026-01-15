# Модуль: Branch Feedback System

**Приоритет:** POST-MVP  
**Срок:** Phase 2  
**Команда:** 1 Backend + 1 Frontend

---

## 📋 ОПИСАНИЕ

Система обратной связи от филиалов с рейтингами, отзывами и анализом удовлетворенности.

### Основные функции

- **Feedback Collection** - сбор отзывов о работе офиса
- **Ratings** - оценки по критериям (чистота, сервис, оборудование)
- **Analytics** - анализ трендов NPS
- **Action Items** - автосоздание задач из негативных отзывов
- **Reports** - отчеты по филиалам

---

## 🗄️ DATABASE

```sql
CREATE TABLE branch_feedback (
    id UUID PRIMARY KEY,
    branch_id UUID REFERENCES branches(id),
    author_id UUID REFERENCES users(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    category VARCHAR(50),
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE feedback_actions (
    id UUID PRIMARY KEY,
    feedback_id UUID REFERENCES branch_feedback(id),
    task_id UUID REFERENCES tasks(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 API

- POST `/api/feedback/branch/{id}`
- GET `/api/feedback/branch/{id}/stats`
- GET `/api/feedback/trends`

---

## 📝 ЗАВИСИМОСТИ

- `20-Task-Management` - создание action items
- Branch management module
