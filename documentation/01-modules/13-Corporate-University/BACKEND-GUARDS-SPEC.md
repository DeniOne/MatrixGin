Backend Guards Specification
Foundation Acceptance Enforcement

Scope: Core Backend (Auth / Roles / KPI / Economy / University)
Canon: v2.2
Failure Mode: HARD BLOCK
Bypass: FORBIDDEN

1. Цель guards

Гарантировать на уровне backend, что:

ни один пользователь без FoundationAcceptance = ACCEPTED
не может участвовать в ролях, KPI, экономике и APPLIED-обучении

UI считается недоверенной зоной.

2. Базовый принцип (инвариант)
FOUNDATION_ACCEPTED
≠ permission
≠ role
≠ feature flag

FOUNDATION_ACCEPTED
= prerequisite for entering the system economy

3. Центральный Guard (обязательный)
3.1 FoundationGuard (global)

Уровень: middleware / guard / interceptor
Применение: ко всем защищённым endpoint’ам

Псевдокод
function FoundationGuard(req, res, next) {
  const userId = req.auth.userId

  const acceptance = FoundationAcceptanceRepo
    .getActiveByUser(userId)

  if (!acceptance || acceptance.status !== 'ACCEPTED') {
    audit.log('FOUNDATION_BLOCK', {
      userId,
      endpoint: req.path,
      reason: 'FOUNDATION_NOT_ACCEPTED'
    })

    return res.status(403).json({
      error: 'FOUNDATION_NOT_ACCEPTED',
      message: 'Foundation acceptance required'
    })
  }

  next()
}

3.2 Где guard ОБЯЗАТЕЛЕН
Контур	Обязательно
RoleContract creation	✅
KPI Engine	✅
Economy / Wallet	✅
University (APPLIED)	✅
Gamification (non-cosmetic)	✅
Analytics (personal / exec)	✅
4. Исключения (строго ограничены)
4.1 Разрешено БЕЗ acceptance
Endpoint	Причина
/auth/*	вход
/foundational/*	immersion
/profile/read-only	базовая инфо
/logout	безопасность

❗ Список закрытый.
Любое добавление = архитектурное нарушение.

5. Guard на уровне сервисов (второй контур)
5.1 Service-level assert

Даже если middleware пропущен — сервис обязан проверить.

function assertFoundationAccepted(userId) {
  if (!FoundationAcceptanceRepo.isAccepted(userId)) {
    throw new FoundationViolationError(userId)
  }
}


Используется в:

RoleService

KPIService

EconomyService

UniversityAppliedService

6. Role Management Guards
6.1 RoleContract creation
createRoleContract(userId, roleType) {
  assertFoundationAccepted(userId)

  // no auto-assign
  // no trainee bypass
}


❌ Запрещено:

auto-create roles on user creation

manual DB insert

“temporary roles”

7. University Guards
7.1 Router-level split
/university/foundational/** → NO guard
/university/applied/**      → FoundationGuard

7.2 Enrollment protection
enrollInCourse(userId, courseId) {
  assertFoundationAccepted(userId)
}

8. KPI & Analytics Guards
8.1 KPI calculation
calculateKPI(userId) {
  assertFoundationAccepted(userId)
}


❌ KPI не считаются “впрок”
❌ Нет silent skip
❌ Нет partial data

9. Economy Guards (критично)
9.1 Wallet operations
creditWallet(userId, amount) {
  assertFoundationAccepted(userId)
}

9.2 Forbidden patterns

❌ manual credit

❌ migration-based payouts

❌ “задним числом после acceptance”

10. Versioning Guard
10.1 Version mismatch
if (acceptance.version !== activeFoundationVersion) {
  throw new ReImmersionRequiredError()
}


Поведение:

блок

redirect to immersion

audit log

11. Audit Requirements

Каждый блок фиксируется:

FOUNDATION_BLOCK {
  userId
  endpoint
  service
  timestamp
  foundationVersion
}


❌ Удаление логов запрещено
❌ Override без причины запрещён

12. Negative Scenarios (обязательные)

Backend должен гарантировать:

NOT_ACCEPTED:

403 на любой protected endpoint

ACCEPTED → OK

Version mismatch → BLOCK

Trainee → BLOCKED without acceptance

Admin → НЕ bypass

13. Definition of Done (Guards)

Guards считаются реализованными, если:

 middleware подключён глобально

 service-level asserts есть

 все protected endpoints покрыты

 audit пишет события

 bypass невозможен даже для admin

 negative tests FAIL as expected

14. Архитектурный вывод

Guards — это закон в коде.
Если guard можно обойти — закона нет.
