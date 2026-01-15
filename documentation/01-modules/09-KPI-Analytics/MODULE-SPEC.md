# Модуль: KPI & Analytics

**Приоритет:** КРИТИЧНЫЙ (MVP Phase 1)  
**Срок:** Недели 7-8  
**Команда:** 1 Backend + 1 Frontend разработчик

---

## 📋 ОПИСАНИЕ

Система управления KPI с аналитикой, дашбордами и автоматическими отчетами.

### Основные функции

✅ **Personal KPI:**
- Персональные целевые показатели
- Прогресс tracking
- История изменений

✅ **Department KPI:**
- Командные показатели
- Сравнение департаментов
- Drill-down анализ

✅ **Analytics:**
- Тренды и прогнозы
- Аномалии detection
- Performance insights

✅ **Dashboards:**
- Роль-специфичные дашборды
- Real-time обновления
- Экспорт отчетов

---

## 🗄️ DATABASE SCHEMA

```sql
-- KPI Targets
CREATE TABLE kpi_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    metric_name VARCHAR(100) NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    period VARCHAR(50), -- daily, weekly, monthly, quarterly, yearly
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KPI Snapshots (daily tracking)
CREATE TABLE kpi_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_id UUID REFERENCES kpi_targets(id),
    current_value DECIMAL(10,2) NOT NULL,
    snapshot_date DATE NOT NULL,
    variance DECIMAL(10,2), -- target - current
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(target_id, snapshot_date)
);

-- Индексы
CREATE INDEX idx_kpi_targets_user ON kpi_targets(user_id);
CREATE INDEX idx_kpi_snapshots_target ON kpi_snapshots(target_id);
CREATE INDEX idx_kpi_snapshots_date ON kpi_snapshots(snapshot_date);
```

---

## 🔌 API ENDPOINTS

### GET `/api/kpi/my`
Мои KPI

### GET `/api/kpi/department/{id}`
KPI департамента

### POST `/api/kpi`
Создать KPI target

### PUT `/api/kpi/{id}`
Обновить текущее значение

### GET `/api/kpi/{id}/history`
История KPI

---

## 📊 CRON JOBS

```typescript
@Cron('0 0 * * *') // Ежедневно
async calculateDailyKPI() {
  // Snapshot всех KPI
}
```

---

## 📝 ЗАВИСИМОСТИ

- `20-Task-Management` - KPI из задач
- `08-Employee-Management` - данные сотрудников
