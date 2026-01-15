# Модуль: Psychological Support

**Приоритет:** POST-MVP  
**Срок:** Phase 2

---

## 📋 ОПИСАНИЕ

Система психологической поддержки сотрудников с консультациями и ресурсами.

### Функции

- **Consultations** - запись на консультации
- **Anonymous Chat** - анонимный чат с психологом
- **Resources** - база статей и материалов
- **Crisis Support** - экстренная поддержка
- **Mood Tracking** - отслеживание эмоционального состояния

---

## 🗄️ DATABASE

```sql
CREATE TABLE psy_consultations (
    id UUID PRIMARY KEY,
    employee_id UUID REFERENCES users(id),
    psychologist_id UUID,
    scheduled_at TIMESTAMPTZ,
    is_anonymous BOOLEAN DEFAULT true,
    status VARCHAR(50)
);
```

---

## 🔌 API

- POST `/api/psychological/consultations`
- GET `/api/psychological/resources`
- POST `/api/psychological/crisis-support`
