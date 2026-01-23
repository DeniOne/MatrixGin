FOUNDATIONAL IMMERSION / TRAINEE / UNIVERSITY

Scope: MVP
Canon: Architectural Canon v2.2
Compliance: MANDATORY
Result: ACCEPT / REJECT MVP

0. Meta-check (обязательный старт)

 Architectural Canon v2.2 зафиксирован и не изменялся

 FOUNDATIONAL IMMERSION Spec утверждён

 Trainee RoleContract Spec утверждён

 University FOUNDATIONAL / APPLIED split утверждён

 Нет альтернативных документов с конфликтной логикой

❌ Любой “нет” → STOP

1. Foundation Data Model

 Есть FoundationVersion

 Есть FoundationAcceptance

 Есть FoundationAuditLog

 Acceptance привязан к person_id, а не к роли

 Acceptance бинарный (ACCEPTED / NOT_ACCEPTED)

❌ Отсутствует сущность → REJECT

2. Admission Flow (FOUNDATIONAL IMMERSION)

 IMMERSION запускается автоматически при первом входе

 Нет доступа к системе до DECISION

 Все 5 блоков обязательны

 Нельзя “проскроллить и принять”

 Есть явный ACCEPT / DECLINE

 Decision логируется

 Decline не даёт никаких прав

❌ Есть обход → REJECT

3. Backend Enforcement (ключевой пункт)

 Все критические сервисы проверяют FoundationAcceptance

 Нет UI-only блокировок

 Guards / middleware работают на backend

 Нельзя вызвать protected API без acceptance

 Нет feature-flags для bypass

❌ Любой обход → REJECT

4. Role Management

 RoleContract нельзя создать без ACCEPTED

 Trainee создаётся только после acceptance

 Trainee имеет реальные ограничения

 Нет auto-assign ролей

 Нет “временных” ролей

❌ Роль без acceptance → REJECT

5. KPI & Analytics

 KPI Engine проверяет acceptance

 KPI для NOT_ACCEPTED не считаются

 Нет ручного пересчёта без audit

 Исторические KPI не “подтягиваются”

 Нет silent-fallback логики

❌ KPI без допуска → REJECT

6. Economy / Motivation

 Начисления блокируются без acceptance

 Нет “временных выплат”

 Trainee-мотивация ограничена

 Все начисления логируются

 Антифрод работает для Trainee

❌ Деньги без допуска → REJECT

7. University Module

 University разделён на FOUNDATIONAL / APPLIED

 FOUNDATIONAL неделим

 APPLIED недоступен без acceptance

 ЗСФ CORE отсутствует в факультетах

 Мотивация не оформлена как курс

❌ Обучение без допуска → REJECT

8. Versioning & Re-immersion

 Foundation имеет версию

 Смена версии инвалидирует acceptance

 Re-immersion обязателен

 Старые acceptance не работают

 Version mismatch логируется

❌ Старые допуски → REJECT

9. Audit & Security

 AuditLog пишется для всех решений

 Нет удаления acceptance без следа

 Нет ручных override без причины

 Security guards соответствуют архитектуре

 Нет прямого доступа к данным acceptance

❌ Нет аудита → REJECT

10. Negative Scenarios (обязательное тестирование)

Проверить вручную:

 NOT_ACCEPTED пользователь:

не работает

не получает KPI

не получает деньги

не видит Applied

 Trainee:

не может делать критические действия

не влияет на финальные KPI

 Попытка bypass через API → FAIL

 Попытка admin-override → FAIL

❌ Любой сценарий успешен → REJECT

11. Definition of Done (MVP)

MVP СЧИТАЕТСЯ ГОТОВЫМ, если:

 Все пункты выше = OK

 Нет архитектурных обходов

 Foundation реально блокирует систему

 Acceptance — юридический факт

 Trainee — не особый случай

12. Финальный вердикт
IF all_checks == PASS
→ MVP ACCEPTED
ELSE
→ MVP REJECTED


Без “почти”. Без “потом поправим”.

13. Архитектурное резюме

Если этот чеклист выполняется —
система честная.
Если нет — она притворяется.