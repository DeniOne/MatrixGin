# Модуль: Advanced Gamification

**Приоритет:** POST-MVP  
**Срок:** Phase 2  
**Команда:** 1 Backend + 1 Frontend

---

## 📋 ОПИСАНИЕ

Расширенная система геймификации с достижениями, лидербордами, квестами и событиями.

### Основные функции

- **Achievements** - значки, награды, коллекции
- **Leaderboards** - рейтинги по MC, GMC, задачам
- **Quests** - серии связанных задач
- **Events** - временные турниры
- **Ranks** - система статусов и рангов
- **Rewards** - MC/GMC rewards

---

## 🗄️ DATABASE

```sql
CREATE TABLE achievements (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    icon_url TEXT,
    criteria JSONB,
    reward_mc INTEGER
);

CREATE TABLE user_achievements (
    user_id UUID REFERENCES users(id),
    achievement_id UUID REFERENCES achievements(id),
    unlocked_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, achievement_id)
);

CREATE TABLE leaderboards (
    id UUID PRIMARY KEY,
    metric VARCHAR(100),
    period VARCHAR(50),
    top_users JSONB
);
```

---

## 🔌 API

- GET `/api/gamification/achievements`
- GET `/api/gamification/leaderboard`
- GET `/api/gamification/my-rank`
- POST `/api/gamification/quests/{id}/start`

---

## 📝 ЗАВИСИМОСТИ

- `15-MatrixCoin-Economy` - rewards
- `20-Task-Management` - task completion triggers
