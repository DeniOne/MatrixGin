# Модуль: RAG Knowledge Base

**Приоритет:** POST-MVP  
**Срок:** Phase 2

---

## 📋 ОПИСАНИЕ

RAG (Retrieval-Augmented Generation) база знаний для AI-ассистента.

### Функции

- **Knowledge Ingestion** - загрузка документов
- **Vector Embeddings** - векторизация текстов
- **Semantic Search** - семантический поиск
- **AI Answering** - ответы на вопросы через LLM + RAG
- **Context Management** - управление контекстом

---

## 🗄️ DATABASE

```sql
CREATE TABLE knowledge_documents (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    embedding VECTOR(1536),
    source VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON knowledge_documents USING ivfflat (embedding vector_cosine_ops);
```

---

## 🔌 API

- POST `/api/knowledge/ingest`
- POST `/api/knowledge/query`
- GET `/api/knowledge/search?q=`
