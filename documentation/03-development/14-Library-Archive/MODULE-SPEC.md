# Модуль: Library & Archive

**Приоритет:** POST-MVP  
**Срок:** Phase 2

---

## 📋 ОПИСАНИЕ

Корпоративная библиотека документов, знаний и архив с поиском и версионированием.

### Функции

- **Document Management** - хранение документов
- **Search** - полнотекстовый поиск
- **Versioning** - версии документов
- **Access Control** - права доступа
- **Tags & Categories** - организация
- **Archive** - архивирование старых документов

---

## 🗄️ DATABASE

```sql
CREATE TABLE library_documents (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    file_url TEXT,
    category VARCHAR(100),
    tags TEXT[],
    version INTEGER DEFAULT 1,
    is_archived BOOLEAN DEFAULT false
);
```

---

## 🔌 API

- GET `/api/library/documents`
- POST `/api/library/documents`
- GET `/api/library/search?q=`
- GET `/api/library/documents/{id}/versions`
