# MEMORY: 2026-01-23 — PHASE 2: Course Management & Enrollment

**Task ID:** `MVP-LEARNING-PHASE-2`
**Objective:** Реализовать Phase 2 из MVP-LEARNING-CONTOUR: Сотрудник может записаться на курс и видеть свои курсы.
**Status:** IN PROGRESS
**User:** DeniOne
**Assistant (TECHLEAD):** Antigravity AI

## Context
Phase 1 (Onboarding) is complete. Phase 2 focuses on the core university lifecycle: course catalog and enrollment.

## Goal Description
1.  **Backend:**
    *   Создать `EnrollmentService` (обновить существующий) с поддержкой записи, получения деталей и отмены.
    *   Создать `EnrollmentController` для API.
    *   Обновить `UniversityService` для фильтрации доступных курсов по грейду.
2.  **Frontend:**
    *   Обновить страницу университета (каталог и мои курсы).
    *   Создать компоненты `CourseCard` и `MyCoursesList`.

## Requirements (MVP Scope)
- Прямая зависимость видимости курсов от квалификации (`required_grade`).
- Проверка обязательных курсов.
- Запись на курс инициируется сотрудником.

## Progress Tracking
- [x] Initial research & context analysis
- [/] Implementation Plan draft
- [ ] Backend: EnrollmentService updates
- [ ] Backend: EnrollmentController implementation
- [ ] Backend: UniversityService updates
- [ ] Backend: Routes refactoring
- [ ] Frontend: implementation (Phase 2.2)
- [ ] Verification
