КАНОНИЧНАЯ МАТРИЦА ВОЗМОЖНОСТЕЙ

Telegram-бот MatrixGin — это универсальный интерфейс доступа к системе,
предоставляющий разные проекции личного кабинета (LK)
в зависимости от роли, уровня ответственности и контекста.

I. ОСЕВАЯ МОДЕЛЬ (база)

Матрица строится по 3 осям:

Ось 1 — Роль пользователя

R1 — Кандидат / Новый сотрудник

R2 — Рядовой сотрудник

R3 — Руководитель тактического звена

R4 — Руководитель стратегического звена

Ось 2 — Тип функции

Access / Identity

Operations

Information

Analytics

AI-Support

Communication

Compliance & Documents

Ось 3 — Уровень воздействия

Read-only

Action (с подтверждением)

Advisory

Forbidden

II. МАТРИЦА ФУНКЦИОНАЛЬНЫХ ПРОЕКЦИЙ
1. REGISTRATION & IDENTITY PROJECTION

(Auth / Onboarding Layer)

Функция	Роль	Уровень	Канон
Регистрация в MatrixGin	R1	Action	Telegram = точка входа
Привязка Telegram ID	R1–R4	Action	Через Auth Service
Первичное согласие (consent)	R1	Mandatory	Этика MG
Онбординг (шаги, подсказки)	R1	Advisory	Без давления

❌ Запрещено: хранить персональные данные в Telegram

2. EMPLOYEE LK — STRUCTURE (OFS PROJECTION)
Функция	Роль	Уровень	Канон
Моё место в ОФС	R2+	Read-only	Проекция OFS
Подчинённость	R2+	Read-only	Без редактирования
Связи по функциям	R2+	Read-only	Агрегировано

❌ Запрещено: видеть персональные данные других сотрудников

3. EMPLOYEE LK — SHIFT & ATTENDANCE
Функция	Роль	Уровень	Канон
Начало смены	R2	Action	С явным consent
Завершение смены	R2	Action	
Геолокация	R2	Action	Только при согласии
Фото/селфи-подтверждение	R2	Action	Прозрачные правила
Проверка опозданий	R2	Advisory	Не наказание
История смен	R2	Read-only	Личное зеркало

⚠️ Telegram = терминал фиксации, не система учёта

4. EMPLOYEE LK — DASHBOARD & STATISTICS
Функция	Роль	Уровень
План / факт	R2+	Read-only
Онлайн-статус	R2+	Read-only
История KPI	R2	Read-only
Личная динамика	R2	Advisory

❌ Запрещено: сравнение с другими сотрудниками

5. TASKS & OPERATIONS
Функция	Роль	Уровень
Задачи на смену	R2	Read-only
Постановка личных задач	R2	Action
Отметка выполнения	R2	Action
Напоминания	R2+	Advisory
6. AI-ASSISTANT (EMPLOYEE MODE)
Функция	Роль	Уровень
Ответы на вопросы	R2	Advisory
Помощь в планировании	R2	Advisory
Объяснение статистик	R2	Advisory
Напоминания	R2	Advisory
Психоэмоциональная поддержка	R2	Advisory

❌ Жёстко запрещено:

оценки личности

диагнозы

управленческие решения

давление KPI

7. MANAGER LK — TACTICAL PROJECTION
Функция	Роль	Уровень
Срезы по подразделению	R3	Read-only
План / факт команды	R3	Read-only
Алерты отклонений	R3	Advisory
Тактические подсказки	R3	Advisory
Постановка задач	R3	Action

❌ Нет raw-данных без прав

8. EXECUTIVE LK — STRATEGIC SNAPSHOT
Функция	Роль	Уровень
Ключевые показатели	R4	Read-only
Алерты	R4	Advisory
Ответы на вопросы	R4	Advisory

⚠️ Telegram ≠ основной стратегический интерфейс

9. DOCUMENTS & COMPLIANCE (КРИТИЧЕСКИ ВАЖНО)

ТВОЯ КЛЮЧЕВАЯ ИДЕЯ — ПРИНЯТА И КАНОНИЗИРОВАНА

Функция	Роль	Уровень	Канон
Запрос документов (HR)	R2	Action	Через Telegram
Отправка документов	R2	Action	Фото / PDF
Временное хранение	—	Sandbox only	❌ не в TG
Проверка / аппрув	HR / R3	Action	Human-approved
Загрузка в реестр БД	Core	Action	После approval
Просмотр статуса	R2	Read-only	Прозрачно

Архитектурный поток:

TG → Sandbox → Document Service → Approval → Secure Registry


❌ Запрещено:

автоматический аппрув

хранение документов в Telegram

доступ AI к raw-документам

10. CORPORATE CHAT & COMMUNITY
Функция	Роль	Уровень
Корпоративные каналы	All	Read
Объявления	All	Read
Опросы	All	Action
Сбор идей	All	Action

AI:

модератор

навигатор

❌ не субъект власти

11. SUPPORT & HELPDESK
Функция	Роль	Уровень
IT-запросы	R2+	Action
HR-вопросы	R2+	Advisory
Статус заявок	R2+	Read-only
III. ЖЁСТКИЕ ЗАПРЕТЫ (для MODULE-SPEC)

Telegram не принимает решений

Telegram не хранит персональные данные

Telegram не имеет прямого доступа к БД

AI в Telegram — advisory only

Любые действия — через Sandbox и Core