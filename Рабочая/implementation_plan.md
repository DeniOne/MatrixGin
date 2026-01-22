# Implementation Plan: Phase 4 - Trainer Accreditation & Mentorship

Этот этап фокусируется на "Институте Тренерства". Мы превращаем квалифицированных сотрудников в наставников, внедряем систему аккредитации и удобный дашборд для управления обучением новичков.

## User Review Required

> [!IMPORTANT]
> **Авторизация**: Доступ к Trainer Dashboard будет ограничен только сотрудникам со статусом `TRAINER`, `ACCREDITED` и выше.
> 
> **Награды**: За успешное доведение стажера до конца испытательного срока (60 дней) тренер получает автоматическую награду в MC. GMC награды заблокированы на уровне канонов.

## Proposed Changes

### 1. Backend Refinements

#### [MODIFY] [trainer.service.ts](file:///f:/Matrix_Gin/backend/src/services/trainer.service.ts)
- Добавление метода `getTrainerDashboardData(trainerId)`: агрегация статистики (NPS, доход, список активных учеников) в один DTO.
- Усиление логики [assignTrainer](file:///f:/Matrix_Gin/backend/src/services/trainer.service.ts#164-209): автоматическая отправка уведомления ученику о назначении наставника.

#### [MODIFY] [university.controller.ts](file:///f:/Matrix_Gin/backend/src/controllers/university.controller.ts)
- Новые эндпоинты:
  - `GET /api/university/trainers/dashboard` — данные для личного кабинета тренера.
  - `GET /api/university/trainers/candidates` — список заявок на аккредитацию (для HR/Admin).

### 2. Frontend (Trainer UI)

#### [NEW] [TrainerDashboardPage.tsx](file:///f:/Matrix_Gin/frontend/src/pages/university/TrainerDashboardPage.tsx)
- Статистические карточки (Рейтинг, Успешные стажеры, NPS).
- Таблица "Мои подопечные" с прогресс-барами их курсов.
- Кнопка "Завершить наставничество" с формой оценки результата.

#### [NEW] [TrainerApplicationModal.tsx](file:///f:/Matrix_Gin/frontend/src/features/university/components/TrainerApplicationModal.tsx)
- Форма выбора специализации (Фотограф, Продажи, Дизайнер).
- Справка о требованиях к кандидату.

### 3. Management UI

#### [MODIFY] [UniversityPage.tsx](file:///f:/Matrix_Gin/frontend/src/pages/UniversityPage.tsx)
- Добавление вкладки "Управление" (только для HR/Admin).
- Список кандидатов с кнопками "Аккредитовать" / "Отклонить".

## Verification Plan

### Automated Tests
1. Проверка [assignTrainer](file:///f:/Matrix_Gin/backend/src/services/trainer.service.ts#164-209): убедиться, что `trainees_total` инкрементируется.
2. Проверка [createTrainingResult](file:///f:/Matrix_Gin/backend/src/services/trainer.service.ts#210-279): симуляция 61 дня ретеншена и проверка начисления MC.

### Manual Verification
1. Зайти под обычным пользователем, подать заявку на тренера.
2. Под админом подтвердить заявку (Accredit).
3. Убедиться, что у пользователя появилась вкладка "Дашборд тренера".
4. Назначить тренера стажеру, убедиться что в дашборде тренера появился новый ученик.
