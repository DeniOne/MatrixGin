# Development Checklist: Corporate University

**Модуль:** 13-Corporate-University  
**Статус:** 🟡 Ready for Implementation  
**Версия:** 1.0 PRODUCTION

> [!NOTE]
> Чеклист соответствует [implementation_plan.md](file:///C:/Users/DeniOne/.gemini/antigravity/brain/d119139d-6a71-4d50-89ff-9f1c906ac0e0/implementation_plan.md) и [MODULE-SPEC.md](./MODULE-SPEC.md)

---

## Component 1: Database Schema
- [x] Добавить enum `TargetMetric`
- [x] Добавить enum `CourseScope`
- [x] Обновить модель `Course`
- [x] Создать модель `QualificationSnapshot`
- [x] Создать миграцию `add_course_photocompany_fields`
- [x] Обновить существующие курсы

---

## Component 2: Backend Services
- [x] University Service: `getStudentDashboard`, `getVisibilityLevel`, `getRecommendedCourses`, `calculateProgressToNext`
- [x] Enrollment Service: `completeCourse` refactored (registerRecognition, event emit)
- [x] Qualification Service: `proposeQualificationUpgrade`, `applyApprovedUpgrade`, etc.
- [x] Trainer Service: RBAC checks added

---

## Component 3: Event Flow
- [x] Создать `events/course-completed.handler.ts`
- [x] Создать `events/photocompany-result.handler.ts`
- [x] Создать `events/university-event.dispatcher.ts`
- [x] Подключить dispatcher в `index.ts` (startWorker)
- [/] PhotoCompany integration (handlers ready, event emission integrated into EnrollmentService)
- [ ] Manual verification scenarios for Event Flow

---

## Component 4: Telegram Bot Integration
- [x] Добавить интент `my_training`
  - [x] Показать dashboard с учётом visibility level
  - [x] Показать активные курсы
  - [x] Показать прогресс до следующего уровня
- [x] Добавить интент `recommend_course`
  - [x] Показать рекомендации на основе target_metric
  - [x] Показать expected_effect
- [x] Добавить интент `quick_quiz`
  - [x] Простой тест для самопроверки
  - [x] Без влияния на деньги
- [x] Создать NotificationService
  - [x] sendCourseCompletedNotification
  - [x] sendQualificationProposedNotification
- [x] Создать NotificationHandler (regular event handler)
- [x] Интегрировать с UniversityEventDispatcher
- [x] Создать QUALIFICATION_PROPOSED event emission

### Bot Commands
- [x] `/my_training` — мой путь обучения (implemented as `show_my_training` action)
- [x] `/recommend` — рекомендации курсов (integrated in dashboard)
- [x] `/quiz` — быстрый тест (stub for future implementation)

---

## Component 5: Anti-Fraud Mechanisms
- [x] Создать `anti-fraud/university-fraud-detector.ts`
- [x] Реализовать флаг: `NO_RESULT_IMPROVEMENT` (MEDIUM)
- [x] Реализовать флаг: `NO_PRODUCTION_ACTIVITY` (HIGH)
- [x] Реализовать флаг: `EXCESSIVE_RETESTS` (MEDIUM)
- [x] Реализовать флаг: `ROLE_METRIC_MISMATCH` (HIGH)
- [x] Реализовать `AntiFraudSignalWriter` (append-only persistence)
- [x] **КРИТИЧЕСКОЕ:** Определить severity для каждого флага
  - [x] INFO — только логируем
  - [x] WARNING — добавляем в review queue (MEDIUM)
  - [x] CRITICAL — требует manual approval для qualification (HIGH)
- [x] **КАНОН:** Флаги = ADVISORY ONLY (не блокируют, только влияют на Approval)

### Integration
- [x] Интеграция с `enrollment.service.ts` (non-blocking)
- [x] **NO** интеграция с `qualification.service.ts` (no coupling)
- [x] Signals reviewed OUTSIDE service (ops/review dashboard)

### Architectural Invariants
- [x] Detector = pure function (separate from persistence)
- [x] Signals are append-only, immutable
- [x] No automatic punishment
- [x] Separation of detection and action

---

## Component 6: RBAC Enforcement

### Middleware
- [ ] Обновить `middleware/rbac.middleware.ts`
- [ ] Добавить `trainerPermissions` объект
- [ ] Реализовать `checkTrainerPermissions(action, userId, targetUserId)`
- [ ] Добавить проверку trainer assignment

### Permissions Matrix
- [ ] Trainer: `course:read` ✅
- [ ] Trainer: `material:create` ✅
- [ ] Trainer: `enrollment:read` ✅
- [ ] Trainer: `module:update_progress` ✅ (только свои стажёры)
- [ ] Trainer: `user_grade:update` ❌
- [ ] Trainer: `wallet:update` ❌
- [ ] Trainer: `kpi:write` ❌
- [ ] Trainer: `qualification:approve` ❌
- [ ] Trainer: `qualification:propose` ❌ **КРИТИЧЕСКОЕ**
  - [ ] Qualification proposal создаётся ТОЛЬКО системой
  - [ ] На основе PhotoCompany metrics, НЕ по инициативе Trainer

---

## Testing

### Unit Tests
- [ ] `university.service.spec.ts`
  - [ ] `getStudentDashboard()` возвращает корректные данные
  - [ ] `getVisibilityLevel()` работает для всех грейдов
  - [ ] `getRecommendedCourses()` учитывает target_metric
- [ ] `qualification.service.spec.ts`
  - [ ] `proposeQualificationUpgrade()` требует PhotoCompany metrics
  - [ ] `applyApprovedUpgrade()` создаёт snapshot
  - [ ] Нельзя применить неодобренный proposal
- [ ] `enrollment.service.spec.ts`
  - [ ] `completeCourse()` НЕ меняет квалификацию напрямую
  - [ ] `completeCourse()` вызывает `registerRecognition()`
- [ ] `university-fraud-detector.spec.ts`
  - [ ] Детектор выявляет рост без результата
  - [ ] Детектор выявляет частые ретесты
  - [ ] Детектор выявляет несоответствие роли

### Integration Tests
- [ ] `events/course-completed.spec.ts`
  - [ ] Event вызывает правильные handlers
  - [ ] MC начисляется корректно
- [ ] `events/photocompany-result.spec.ts`
  - [ ] Проверка стабильности работает
  - [ ] Proposal создаётся при достижении порога

### E2E Tests
- [ ] Полный цикл: Enrollment → Course → Practice → Result → Qualification
- [ ] RBAC: Trainer не может обновить user_grade
- [ ] Anti-Fraud: Флаги появляются при подозрительной активности

---

## Manual Verification

### Учебный процесс
- [ ] Записаться на курс через Telegram
- [ ] Пройти модуль
- [ ] Проверить начисление recognition_mc
- [ ] Убедиться, что квалификация НЕ изменилась сразу

### Квалификационный процесс
- [ ] Завершить курс
- [ ] Работать в production (PhotoCompany)
- [ ] Достичь стабильных метрик (6 смен)
- [ ] Проверить появление proposal в Approval Workflow
- [ ] Одобрить proposal (Admin)
- [ ] Проверить изменение квалификации

### RBAC проверки
- [ ] Войти как Trainer
- [ ] Попытка обновить user_grade → 403 Forbidden
- [ ] Попытка обновить wallet → 403 Forbidden
- [ ] Обновить progress своего стажёра → Success

### Anti-Fraud
- [ ] Завершить курс без практики → флаг `NO_PRODUCTION_ACTIVITY`
- [ ] Пересдать тест 4 раза → флаг `EXCESSIVE_RETESTS`

### Dashboard Visibility
- [ ] Стажёр: видит только "что делать дальше"
- [ ] Специалист: видит свои метрики
- [ ] Эксперт: видит сравнительные данные

### Негативный сценарий (доверие системы)
- [ ] Завершить курс
- [ ] Работать в production
- [ ] **Показатели ухудшились**
- [ ] Проверить:
  - [ ] Qualification proposal НЕ создаётся
  - [ ] Recognition (MC) остаётся
  - [ ] Система НЕ "наказывает"
  - [ ] Пользователь видит поддержку, не санкции

---

## Deployment

- [ ] Запустить миграцию `add_course_photocompany_fields`
- [ ] Обновить все существующие курсы (добавить обязательные поля)
- [ ] Переименовать `reward_mc` → `recognition_mc` в UI
- [ ] Настроить RBAC для Trainer роли
- [ ] Включить Anti-Fraud детектор
- [ ] Обновить Telegram Bot с новыми интентами
- [ ] Провести все тесты
- [ ] Обучить команду новому процессу квалификации

---

## Rollback Plan

- [ ] Подготовить скрипт отката миграции
- [ ] Подготовить feature flags для новых endpoint'ов
- [ ] Документировать процедуру отката

---

**Прогресс:** 0% (Ready to Start)  
**Следующий шаг:** Component 1 — Database Schema
