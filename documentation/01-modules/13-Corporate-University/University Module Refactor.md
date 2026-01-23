University Module Refactor
FOUNDATIONAL / APPLIED Split
Цель

Привести модуль University в строго каноническое состояние.

1. Новая структура University
University
├── Foundational
│   ├── Immersion (CORE)
│   └── Expanded (optional)
└── Applied
    ├── Faculties
    ├── Disciplines
    └── Programs

2. FOUNDATIONAL (особые правила)

❌ нет факультетов

❌ нет курсов

❌ нет «прогресса»

❌ нет геймификации

Есть:

один admission-контур

одна версия

один результат

3. APPLIED (после acceptance)

Только здесь:

ЗСФ приложения

МДР по должностям

навыки

специализации

экономика, продажи, менеджмент

4. Ключевое правило маршрутизации
IF NOT FOUNDATION_ACCEPTED
THEN
- University shows ONLY Foundational

5. Запрещённые пересечения

❌ ЗСФ Core в факультетах
❌ Мотивация как дисциплина
❌ Applied-курсы без acceptance
❌ «Вводные курсы» вместо Foundation