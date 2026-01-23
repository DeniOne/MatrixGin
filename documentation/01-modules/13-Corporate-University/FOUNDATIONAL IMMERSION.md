FOUNDATIONAL IMMERSION
Implementation Specification (Canon-compatible)

Scope: Corporate University / ERP Admission
Canon: Architectural Canon v2.2
Status: REQUIRED FOR IMPLEMENTATION
Bypass: PROHIBITED

1. Назначение спека

Этот документ описывает КАК именно реализуется FOUNDATIONAL IMMERSION,
не изменяя и не расширяя Architectural Canon.

Цель:

формализовать admission-контур,

исключить импровизации,

обеспечить enforceable-допуск на уровне backend.

2. Термины и определения
2.1 FOUNDATIONAL IMMERSION

Детерминированный admission-процесс принятия законов, роли и мотивации
как условия допуска человека в ERP-систему.

2.2 FOUNDATION CORE

Минимально достаточная версия Foundation, обязательная для всех без исключений.

Характеристики:

одинаковый scope

одинаковые последствия

одинаковый acceptance

различается только глубина объяснения

2.3 FOUNDATION EXPANDED

Образовательный контур углубления понимания.

НЕ admission

НЕ prerequisite

НЕ влияет на ACCEPTED / NOT_ACCEPTED

3. Архитектурные инварианты (НЕИЗМЕНЯЕМЫЕ)
AcceptanceType: BINARY
AcceptanceScope: BUNDLE_ONLY
AcceptanceResult: ACCEPTED | NOT_ACCEPTED
EnforcementLevel: BACKEND


Запрещено:

частичное принятие

временные допуски

role-based auto-accept

UI-only блокировки

4. Состав FOUNDATIONAL IMMERSION (логический)

IMMERSION состоит из 5 обязательных блоков
(не курсов, не уроков, не дисциплин).

#	Блок	Тип
1	Внутренняя Конституция	LAW
2	Кодекс / Антифрод	LAW
3	ЗСФ — Golden Standard CORE	VALUE
4	МДР — Role Model CORE	CONTRACT
5	Мотивация Роли CORE	ECONOMY

⚠️ Все 5 блоков обязательны.
⚠️ Отсутствие любого = NOT_ACCEPTED.

5. Admission Flow (State Machine)
5.1 Состояния
DRAFT
→ IN_PROGRESS
→ REVIEW
→ DECISION
→ ACCEPTED | NOT_ACCEPTED

5.2 Переходы
START

инициируется системой при:

создании сотрудника

смене версии Foundation

IN_PROGRESS

пользователь проходит все 5 блоков

прогресс НЕ даёт прав

REVIEW

подтверждение, что все блоки просмотрены

без тестов «на память»

DECISION (ключевое)

Пользователь делает осознанный выбор:

I UNDERSTAND:
- laws
- role logic
- motivation logic

I ACCEPT:
- evaluation rules
- consequences
- responsibility


Или отказывается.

6. Acceptance Rules (жёстко)
6.1 Условия ACCEPTED
accepted_blocks == 5/5
decision == ACCEPT

6.2 Условия NOT_ACCEPTED

отказ пользователя

прерывание процесса

истечение времени (optional)

откат версии Foundation

7. Persistence Model (обязательно)
7.1 FoundationAcceptance (entity)
FoundationAcceptance {
  id
  person_id
  foundation_version
  acceptance_type: FOUNDATIONAL
  accepted_blocks: 5
  decision: ACCEPTED | NOT_ACCEPTED
  accepted_at
  source: IMMERSION
}

7.2 FoundationAuditLog
FoundationAuditLog {
  id
  person_id
  foundation_version
  event_type
  timestamp
  metadata
}


Фиксируются:

старт

прохождение блоков

decision

version mismatch

revoke (если применимо)

8. Enforcement Logic (BACKEND)
8.1 Глобальное правило
IF NOT FoundationAcceptance.ACCEPTED
THEN
- deny role assignment
- deny KPI calculation
- deny motivation accrual
- deny applied learning


⚠️ Проверка — не в UI, а:

в сервисах

в guards

в domain logic

9. Версионирование Foundation
9.1 FoundationVersion
FoundationVersion {
  version
  effective_from
  status: ACTIVE | DEPRECATED
}

9.2 Поведение при обновлении версии
IF foundation_version_changed
THEN
- invalidate previous acceptance
- require re-immersion


(полная или delta — решается отдельно)

10. FOUNDATION CORE vs EXPANDED (чётко)
Параметр	CORE	EXPANDED
Admission	✅	❌
Acceptance	✅	❌
Блокировка	✅	❌
Глубина	Базовая	Углублённая
Кейсы	Минимум	Да
Связь с Applied	Нет	Да
11. Связь с ролями (важно)

FOUNDATIONAL IMMERSION:

НЕ назначает роль

НЕ определяет специализацию

Но:

без ACCEPTED → невозможно создать RoleContract

12. Ошибки архитектуры (блокирующие)

❌ Allow work before acceptance
❌ Auto-accept for trainees
❌ Partial acceptance
❌ Soft-block via UI
❌ Different laws for beginners
❌ “Temporary” Foundation

Любой из пунктов = NON-COMPLIANT IMPLEMENTATION.

13. Минимальный MVP Scope

Для MVP достаточно:

1 сценарий IMMERSION

FOUNDATION CORE only

ACCEPT / DECLINE

AuditLog

Backend enforcement

EXPANDED — может быть добавлен позже.

14. Критерий успешной реализации

Система должна гарантировать:

Ни один человек не участвует в экономике,
не приняв законы, роль и мотивацию осознанно.

15. Статус спека

READY FOR IMPLEMENTATION
Canon-safe
Scalable