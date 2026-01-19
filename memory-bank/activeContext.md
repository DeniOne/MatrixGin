# Active Context: MatrixGin (2026-01-19)

## Current Project State
Проект находится в фазе **Трансформации мотивационной системы**.

## Current Focus
1.  **Motivational Organism**: Реализация стратегии MatrixGin Motivational Organism v2.0
2.  **Telegram Bot v2**: Добавление 16+ новых интентов для сотрудников и управленцев
3.  **Growth Matrix**: Визуализация "Матрица Роста" (RPG-style skill web)

## 🌱 КЛЮЧЕВОЙ СТРАТЕГИЧЕСКИЙ ДОКУМЕНТ

**Документ:** `documentation/00-strategic/matrixgin_motivational_organism.md` (v2.0)

### Суть

MatrixGin должен трансформироваться из **системы учёта** в **живой мотивационный организм** — среду роста, где сотрудник **хочет** (а не обязан) приходить на работу, быть эффективным и развиваться.

### 3 ортогональные оси мотивации

| Ось | Что даёт | Инструмент |
|-----|----------|------------|
| **Ось 1: Университет** | Компетенции → Коэффициент ЗП | Курсы, квалификации |
| **Ось 2: Статусы** | Признание → Привилегии | Фотон → Universe |
| **Ось 3: MC/GMC** | Героизм → Активы | Магазин, Аукционы |

### Ключевые принципы

- **Среда, не инструмент** — мотивация как следствие условий
- **Никаких KPI/штрафов/рейтингов людей**
- **Добровольность Оси 3** — режим тишины
- **Сравнение только с "собой вчера"**
- **Прозрачность алгоритмов**

## ⚔️ Active Changes
- **Motivational Organism (Sprint 5-8 Completion):**
  - **Employee Layer:** Bot intents (12), Morning Cron, Dashboard Widgets (Learning, Adaptation, Growth Matrix).
  - **Adaptation:** Mentorship and 1-on-1 tracking core implemented (DB + API).
  - **Visuals:** Custom SVG Radar Chart for personal progress (non-evaluative).
  - **Refactoring:** Analytics and MES Personal API converted to Express conventions.

## 🛑 Blockers & Risks
- **Frontend Modules:** Widgets for "My Learning", "Growth Matrix" are planned for Sprints 7-9.
- **PSEE Integration:** MES endpoints return demo data; need real integration with Production Session Execution Engine.
- **Telegram Binding:** Cron job simulates logic; requires actual Telegram User mapping and bot instance injection.

## ⚔️ Recent Changes
- **Sprint 9 Completed**: Implemented decoupled Reward Engine, Manager Hub, and Anti-Fraud limits.
- **Sprint 10 Completed**: PSEE Real Data Integration.
    - **Canonical Rates**: `mes-rates.ts` created.
    - **Shift Logic**: 08:00-23:00 explicit window in MesService.
    - **Quality**: Binary modifiers (PASS/FAIL) integrated.
    - **Growth Matrix**: Connected to real aggregated monthly earnings (Read-Only).

## Current Focus
- **Verification**: ✅ Sprint 10 automated tests passed (Quality Penalty, Shift Scope, Deterministic Forecast).
- **Next Steps**: Preparing for Sprint 11 (Telegram Bot v2 - Navigator).

## Active Files
- `backend/src/mes/services/mes.service.ts`: Core aggregation logic.
- `backend/src/mes/config/mes-rates.ts`: Canonical rates.
- `backend/src/services/growth-matrix.service.ts`: Read-only sync.

## 🔮 Next Steps
1. **PSEE Real Data**: Replace demo calculations in `/my-shift` and `/earnings-forecast` with real Production Engine logic.
2. **Growth Matrix Forecast**: Implementation of "What if?" mode in the Radar chart.
3. **Telegram Bot v2**: Closure of the 16+ intents GAP (Navigator expansion).

## GAP-анализ модулей

| Модуль | Требует доработки | Приоритет |
|--------|-------------------|-----------|
| 07 Telegram Bot | 🔴 16+ новых интентов | Sprint 5-6 |
| 06 Corporate University | ⚠️ Виджет "Моё обучение" | Sprint 7-8 |
| 02 Employee Management | ⚠️ Адаптация, 1-on-1 | Sprint 7-8 |
| 05 MES | ⚠️ Виджет "Моя смена" | Sprint 5-6 |
| Frontend | ⚠️ Radar Chart, Прогноз | Sprint 7-8 |

## Active Decisions
- MatrixCoin Economy (Module 08) = **CANONICAL** — НЕ ТРОГАТЬ
- Status System = **CANONICAL** — изменения только через Governance
