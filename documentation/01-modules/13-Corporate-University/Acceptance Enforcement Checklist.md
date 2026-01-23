Acceptance Enforcement Checklist
Назначение

Контроль реальной, а не декларативной блокировки.

1. Global Guards

 FoundationAcceptance проверяется в backend

 Нет UI-only проверок

 Нет feature flags для bypass

2. Role Management

 RoleContract не создаётся без ACCEPTED

 Trainee ≠ bypass

 Нет auto-assign

3. KPI & Analytics

 KPI Engine проверяет acceptance

 Нет расчётов для NOT_ACCEPTED

 Нет исторических «хвостов»

4. Economy & Motivation

 Начисления блокируются без acceptance

 Нет «временных» выплат

 Все операции логируются

5. University

 APPLIED скрыт без acceptance

 FOUNDATIONAL неделим

 Version mismatch → re-immersion

6. Security & Audit

 FoundationAuditLog включён

 Revoke поддержан

 Versioning enforced

7. Red Flags (STOP SHIP)

❌ Человек работает без acceptance
❌ KPI считаются «потом подтянем»
❌ Стажёр — особый случай
❌ «Разрешили временно»

Любой пункт = архитектурный брак.