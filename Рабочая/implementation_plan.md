# План реализации: Открытая регистрация и Foundation Admission Gate

Данный документ описывает внедрение защищенного процесса регистрации и системы Foundation Admission Gate. 
**ОБНОВЛЕНИЕ**: Добавлена «Открытая регистрация» (Self-Registration), чтобы HR не ебался с ручным вводом ID каждого нового сотрудника.

## Обзор текущей реализации

### 1. Процесс регистрации (Personnel Module)
- **Приглашение**: HR инициирует `POST /api/registration/invite`.
- **Telegram бот**: [EmployeeRegistrationService](file:///f:/Matrix_Gin/backend/src/services/employee-registration.service.ts#62-913) управляет 11-шаговым визардом (фото, ФИО, адрес, паспорт и др.).
- **Одобрение**: `EmployeeRegistrationService.approveRegistration` создает записи [User](file:///f:/Matrix_Gin/frontend/src/features/auth/authApi.ts#3-13) и [Employee](file:///f:/Matrix_Gin/backend/src/controllers/employee-registration.controller.ts#8-44), после чего генерирует событие `employee.onboarded`.

### 2. Интеграция с Университетом (Module 13)
- **Onboarding Listener**: [UniversityOnboardingListener](file:///f:/Matrix_Gin/backend/src/services/university-onboarding.listener.ts#15-128) ловит событие `employee.onboarded`.
- **Инициализация**: Устанавливается грейд `INTERN` (Photon) и осуществляется автоматическая запись на `is_mandatory` курсы.

### 3. Foundation Admission Gate
- **Блокировка (Backend)**: [foundationMiddleware](file:///f:/Matrix_Gin/backend/src/middleware/foundation.middleware.ts#10-59) проверяет наличие записи в `foundationAcceptance` для всех маршрутов Университета.
- **Погружение (Frontend)**: Принудительный Flow через `/foundation/*` страницы (Constitution, Codex, и др.).
- **Доступ**: До завершения Foundation пользователь не может получить доступ к "Прикладным знаниям" (Applied courses).

## План действий (Next Steps)

### Компонент 1: Email-уведомления, Безопасность и Открытая регистрация
- [ ] **[MODIFY] Telegram Bot**: Позволить новым пользователям начинать регистрацию по кнопке `/start` (Self-Registration).
- [ ] **[MODIFY] Email Service**: Реализовать реальную отправку email с временным паролем.
- [ ] **[MODIFY] Password Reset**: Добавить флаг `must_reset_password` в модель [User](file:///f:/Matrix_Gin/frontend/src/features/auth/authApi.ts#3-13) и форсировать смену пароля.
- [ ] **[MODIFY] Admin Approval**: Позволить HR назначать Отдел/Локацию прямо в момент одобрения заявки.

### Компонент 2: Foundation UX & Logic
- [ ] **[VERIFY] Decision Flow**: Протестировать сквозной Flow от просмотра 5 блоков до записи в `foundationAcceptance`.
- [ ] **[MODIFY] Dashboard Integration**: Добавить виджет на главном экране, уведомляющий о необходимости прохождения Foundation, если он не пройден (в дополнение к блокировке в Университете).

### Компонент 3: Тестирование
- [ ] **[NEW] Integration Test**: Добавить тест, проверяющий, что после [approveRegistration](file:///f:/Matrix_Gin/backend/src/controllers/employee-registration.controller.ts#156-179) пользователь действительно заблокирован [foundationMiddleware](file:///f:/Matrix_Gin/backend/src/middleware/foundation.middleware.ts#10-59) в маршрутах Университета до момента отправки Decision.

## План верификации

### Автоматизированные тесты
- Запуск существующих тестов: `npm test backend/src/modules/personnel/__tests__/integration/employee-onboarding.test.ts`
- Создание нового теста: `backend/src/modules/university/__tests__/foundation-gate.test.ts`

### Ручная проверка
1. Создать приглашение для нового Telegram ID.
2. Пройти регистрацию в боте.
3. Одобрить регистрацию через Admin API.
4. Залогиниться под новым пользователем и убедиться в редиректе на `/foundation/start`.
5. Попытаться дернуть API `/api/university/courses/available` без принятого Foundation (должен быть 403).
