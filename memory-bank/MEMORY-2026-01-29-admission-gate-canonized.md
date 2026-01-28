# MEMORY: 2026-01-29 — Admission Gate (Base-First) Canonized

### Context
Реализован критический архитектурный уровень — **Admission Gate**. Система теперь гарантирует, что ни один пользователь не может предоставить персональные данные или получить доступ к функционалу MatrixGin без предварительного принятия Базовых Принципов (Конституция, Кодекс и т.д.).

### Architectural Changes
1.  **AdmissionStatus FSM**:
    - `PENDING_BASE`: Нулевой доступ, только чтение Базы.
    - `BASE_ACCEPTED`: Разрешен ввод анкетных данных.
    - `PROFILE_COMPLETE`: Ожидание проверки HR.
    - `ADMITTED`: Полный доступ (RBAC).
2.  **Security Layers**:
    - **JWT Scopes**: Динамическая выдача прав. Токены теперь содержат `scopes` (напр. `foundation:read`, `profile:write`), которые проверяются API-гардами.
    - **Bot Guard**: Глобальный перехват команд в Telegram. Бот игнорирует всё, кроме этапов регистрации, пока статус не станет `ADMITTED`.
    - **Frontend Guard**: Многоуровневый редирект в зависимости от статуса.
3.  **Documentation Canon**:
    - Создан единственный источник правды: `documentation/00-strategic/ADMISSION_FLOW.md`.
    - Все руководства (`USER-MANUAL-REGISTRATION.md`, `EMPLOYEE-REGISTRATION-PROCESS.md`) синхронизированы.
    - Принято первое архитектурное решение в `documentation/07-FOUNDATION/DECISIONS.log` (**ADR-001**).

### Files Modified/Added
- `backend/src/auth/auth.service.ts` (Dynamic scopes)
- `backend/src/services/foundation.service.ts` (FSM transitions)
- `backend/src/services/telegram.service.ts` (ensureAdmissionGuard)
- `frontend/src/components/guards/FoundationGuard.tsx` (Logic expansion)
- `documentation/00-strategic/ADMISSION_FLOW.md` (New Canon)
- `documentation/07-FOUNDATION/DECISIONS.log` (Decision record)

### Verification
- API блокирует вызовы без нужного scope (403).
- Бот блокирует команды до допуска.
- Фронтенд принудительно ведет по воронке Admission.

**Статус Фазы: КРИТИЧЕСКИ ЗАВЕРШЕНО.**
