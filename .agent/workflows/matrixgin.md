---
description: MEMORY BANK WORKFLOW
---

MEMORY BANK WORKFLOW

**ОБЯЗАТЕЛЬНО при начале новой сессии:**

1. **READ memory-bank** — TECHLEAD должен прочитать все файлы в `f:\Matrix_Gin\memory-bank\`:
   - `projectbrief.md` — общее описание проекта
   - `techContext.md` — технический контекст
   - `systemPatterns.md` — архитектурные паттерны
   - `activeContext.md` — текущий контекст работы
   - `progress.md` — прогресс реализации
   - `PHASE_*.md` — документация завершённых фаз

2. **WRITE after logical action** — После завершения каждого логического действия (фаза, модуль, критическое решение):
   - CODER создаёт/обновляет файл в `memory-bank/`
   - Формат: `PHASE_X.Y_НАЗВАНИЕ.md` или обновление существующих файлов
   - Содержание: архитектурные решения, паттерны, ключевые файлы, API endpoints

3. **PUSH to GitHub** — После записи в memory-bank:
   - CODER выполняет `git add .`
   - CODER выполняет `git commit -m "docs: update memory-bank with [описание]"`
   - CODER выполняет `git push origin main`

**Что записывать в memory-bank:**
- ✅ Архитектурные паттерны и решения
- ✅ Ключевые файлы и их назначение
- ✅ API endpoints с примерами
- ✅ Database schema changes
- ✅ Критические design decisions
- ❌ НЕ записывать: мелкие фиксы, рефакторинг, UI tweaks

**Цель:** Каждая новая сессия должна начинаться с полного контекста проекта.

сохраняй в memory-bank, когда я прошу фразами: "сохрани в память", "сохрани в банк", "запомни" и другие логические обороты связанные с сохранением контекста