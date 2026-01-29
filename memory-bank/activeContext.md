# Active Context: MatrixGin (2026-01-29)

## Current Project State
Проект находится в фазе **Трансформации мотивационной системы**.

## Current Focus
1.  **Motivational Organism**: Реализация стратегии MatrixGin Motivational Organism v2.0
2.  **Module 09**: Governance и автоматизация статусов/рангов (Завершено)
3.  **Growth Matrix**: Визуализация прогресса

## 🌱 КЛЮЧЕВОЙ СТРАТЕГИЧЕСКИЙ ДОКУМЕНТ

**Документ:** `documentation/00-strategic/matrixgin_motivational_organism.md` (v2.0)

### Суть

MatrixGin должен трансформироваться из **системы учёта** в **живой мотивационный организм** — среду роста.

## ⚔️ Recent Changes
- **Sprint 9-12 Completed**: Decoupled Reward Engine, PSEE Integration, Bot v2, Growth Web 3D.
- **Sprint- [2026-01-29] **Foundation Loop & Canon**: Fixed infinite redirect, enforced hard canon for Bot texts, and fixed registration request visibility. See `MEMORY-2026-01-29-foundation-loop-and-canon.md`.
- **Sprint 14 Completed**: **Module 09 (Status & Ranks)** implementation.
  - **Backend**: Managed statuses (MANUAL) and automated Ranks (GMC-based).
  - **Frontend**: Status Management Admin UI and Profile badges.
- **Language Migration (Docs)**: ✅ **COMPLETED 2026-01-25**.
  - All documents in `FOUNDATIONAL` directory translated to Russian.
  - Terms standardized: `ФУНДАМЕНТАЛЬНЫЙ УРОВЕНЬ`, `Контур Допуска`, `Красные Правила`.
- **Module 13: Corporate University (Foundation Layer)**: ✅ **COMPLETED 2026-01-26**.
  - Implemented 5 blocks of the admission contour.
  - Defined `FOUNDATION_ACCEPTANCE_PRINCIPLES.md` (metaphysics of the law).
  - Research document `FOUNDATION_ACCEPTANCE_RESEARCH1.md` refactored and translated.
  - **Seeding**: `seed-foundation-gate.ts` implemented with hash-audit logic (v2.2-canon).
- **Backend & UI Stabilization**: ✅ **COMPLETED 2026-01-27**.
  - **Backend**: Resolved 500 error on login by eliminating duplicate Node.js processes.
  - **UI (Dashboard)**: Refactored `StartGrowthWeb3D.tsx` to align with Geist Canon (glassmorphism, premium typography, optimized SVG).
- **Stabilization & Polling Fixes**: ✅ **COMPLETED 2026-01-29**.
  - **StartPage**: Implemented self-healing admission logic for legacy data (Prisma + AuthService).
  - **Loop**: Resolved infinite redirect loop between `FoundationGuard` and `StartPage`.
- **Admission Gate (Base-First)**: ✅ **COMPLETED 2026-01-29**.
  - **Security Core**: Implemented `AdmissionStatus` FSM (Pending -> Accepted -> Profile -> Admitted).
  - **JWT Scopes**: Dynamic access control based on admission status (Layer 0/1 enforcement).
  - **Bot Guard**: Global command filtering in Telegram until `ADMITTED`.
  - **Frontend Gate**: `FoundationGuard` multi-stage redirection.
  - **Documentation**: Consolidated `ADMISSION_FLOW.md` and synchronized all manual/process docs.
  - **Canon**: Architectural decision recorded in `DECISIONS.log` (ADR-001).
- **Foundation UI Refinement & Terminology Sync**: ✅ **COMPLETED 2026-01-29**.
  - **Terminology Migration**: "Immersion" -> "Base" across all layers (UI, Routes, Bot).
  - **UI Canon**: Enforced MatrixGin Light (Geist) across the Foundation module.
  - **Review Access**: Admitted users can now review Base blocks without restrictions.
  - **Architect View**: Implementation of technical data reflection for Superuser (ADR-002).

## GAP-анализ модулей (Updated 2026-01-25)

| Модуль | Статус | Приоритет |
|--------|--------|-----------|
| 13 Corporate University (Foundation) | ✅ CLOSED | DONE (Охуенно) |
| 09 Status & Ranks | ✅ CLOSED | DONE |
| 33 Personnel HR Records | 🟡 Database Layer ✅ | Sprint 1 (Backend Services next) |
| 29 Library & Archive | 📋 Spec готов | Sprint 2-3 |
| 07 Telegram Bot | 🔴 16+ новых интентов | Sprint 5-6 |
| 06 Corporate University (Applied) | ⚠️ Виджет "Моё обучение" | Sprint 7-8 |

## Active Decisions
- MatrixCoin Economy (Module 08) = **CANONICAL** — НЕ ТРОГАТЬ
- Status System = **CANONICAL** — изменения только через Governance
- **Foundation Admission Gate** = **SCRIPT-ONLY** — редактирование через UI запрещено. Markdown в `FOUNDATIONAL` папке — единственный источник истины. Все материалы Базы (Base) жестко закреплены в каноне v2.2.
- **MatrixGin UI Design Canon** = **MANDATORY** — все новые компоненты и рефакторинг старых должны следовать шрифту Geist и теме MatrixGin Light.

## 🛡️ CANON COMPLIANCE
Перед реализацией любой функции **ОБЯЗАТЕЛЬНО**:
1. Проверить папку `documentation/00-strategic/`.
2. Если в `ADMISSION_FLOW.md` или `UI_DESIGN_CANON.md` есть жесткие требования (тексты, цвета, логика) — следовать им БУКВАЛЬНО.
3. Отсебятина в текстах интерфейса/бота запрещена. Тексты брать только из документации.
