# Модуль: Content Factory

**Приоритет:** POST-MVP  
**Срок:** Phase 2  
**Команда:** 1 Backend + 1 Frontend

---

## 📋 ОПИСАНИЕ

Система управления контентом с AI-генерацией, версионированием и публикацией.

### Основные функции

- **Content Management** - статьи, посты, документы
- **AI Generation** - генерация контента через LLM
- **Versioning** - история изменений
- **Approval Workflow** - согласование контента
- **Publishing** - multi-channel publishing
- **Templates** - шаблоны контента

---

## 🗄️ DATABASE

```sql
CREATE TABLE content_items (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    type VARCHAR(50),
    status VARCHAR(50),
    author_id UUID REFERENCES users(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE content_versions (
    id UUID PRIMARY KEY,
    content_id UUID REFERENCES content_items(id),
    version INTEGER,
    content_snapshot TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 API

- GET `/api/content`
- POST `/api/content`
- PUT `/api/content/{id}`
- POST `/api/content/{id}/publish`
- POST `/api/content/generate` (AI)

---

## 📝 ЗАВИСИМОСТИ

- AI/LLM module - генерация контента
- `02-Authentication-Authorization` - author tracking
