# Модуль: Emotional Analytics

**Приоритет:** POST-MVP  
**Срок:** Phase 2  
**Команда:** 1 Backend + AI Specialist

---

## 📋 ОПИСАНИЕ

Анализ эмоционального состояния команды через AI анализ текста, опросы и sentiment analysis.

### Основные функции

- **Sentiment Analysis** - анализ настроения из текстов
- **Pulse Surveys** - быстрые опросы настроения
- **Burnout Detection** - определение выгорания
- **Team Mood** - общее настроение команды
- **Alerts** - уведомления при негативных трендах
- **Recommendations** - рекомендации для улучшения

---

## 🗄️ DATABASE

```sql
CREATE TABLE mood_surveys (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 10),
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sentiment_analysis (
    id UUID PRIMARY KEY,
    text TEXT,
    sentiment VARCHAR(50),
    confidence DECIMAL(5,2),
    analyzed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 API

- POST `/api/analytics/mood`
- GET `/api/analytics/team-mood`
- GET `/api/analytics/burnout-risk`
- POST `/api/analytics/analyze-sentiment`

---

## 📝 ЗАВИСИМОСТИ

- AI/LLM - sentiment analysis
- `08-Employee-Management` - user data
