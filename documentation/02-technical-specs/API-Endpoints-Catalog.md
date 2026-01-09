# MatrixGin v2.0 - Полный каталог API эндпоинтов (120+)

> **Версия:** 2.0.0  
> **Дата:** 2025-11-21  
> **Статус:** Production Ready

---

## 📋 Оглавление

1. [Authentication & Authorization (10)](#1-authentication--authorization)
2. [Employee Resource (15)](#2-employee-resource)
3. [Task Resource (10)](#3-task-resource)
4. [Department Resource (12)](#4-department-resource)
5. [Economy Resource (14)](#5-economy-resource)
6. [Gamification Resource (7)](#6-gamification-resource)
7. [Legal & Compliance Resource (15)](#7-legal--compliance-resource)
8. [Strategy & Management Resource (8)](#8-strategy--management-resource)
9. [Feedback Resource (9)](#9-feedback-resource)
10. [Learning & Education Resource (7)](#10-learning--education-resource)
11. [Emotional Analytics Resource (4)](#11-emotional-analytics-resource)
12. [Self-Learning Resource (5)](#12-self-learning-resource)
13. [Executive Dashboard Resource (4)](#13-executive-dashboard-resource)
14. [HR Analytics Resource (5)](#14-hr-analytics-resource)
15. [Ethics Manager Resource (4)](#15-ethics-manager-resource)
16. [Knowledge Resource (5)](#16-knowledge-resource)
17. [Content Resource (5)](#17-content-resource)
18. [Kaizen Resource (7)](#18-kaizen-resource)
19. [Cabinet Resource (6)](#19-cabinet-resource)
20. [Social Monitoring Resource (3)](#20-social-monitoring-resource)

**Итого:** 155 эндпоинтов

---

## 1. Authentication & Authorization

### Базовая аутентификация

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/auth/register` | Регистрация нового пользователя | ❌ | - |
| POST | `/api/auth/login` | Вход в систему (получение JWT) | ❌ | - |
| POST | `/api/auth/logout` | Выход из системы | ✅ | - |
| POST | `/api/auth/refresh` | Обновление access token | ❌ | - |
| POST | `/api/auth/forgot-password` | Восстановление пароля | ❌ | - |
| POST | `/api/auth/reset-password` | Сброс пароля | ❌ | - |

### Информация о пользователе

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/auth/me` | Текущий пользователь | ✅ | - |
| GET | `/api/auth/permissions` | Мои права доступа | ✅ | - |

---

## 2. Employee Resource

### CRUD операции

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/employees` | Список сотрудников | ✅ | `employees.read` |
| GET | `/api/employees/{id}` | Детали сотрудника | ✅ | `employees.read` |
| POST | `/api/employees` | Создать сотрудника | ✅ | `employees.create` |
| PUT | `/api/employees/{id}` | Обновить сотрудника | ✅ | `employees.update` |
| PATCH | `/api/employees/{id}` | Частичное обновление | ✅ | `employees.update` |
| DELETE | `/api/employees/{id}` | Удалить сотрудника | ✅ | `employees.delete` |

### Аналитика и KPI

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/employees/{id}/analytics` | Аналитика сотрудника | ✅ | `employees.read` |
| GET | `/api/employees/{id}/kpi` | KPI сотрудника | ✅ | `kpi.read_own` |
| GET | `/api/employees/{id}/emotional-state` | Эмоциональное состояние | ✅ | `emotional.read` |

### Скрининг и мониторинг

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/employees/{id}/screening` | Pre-hire скрининг соцсетей | ✅ | `hr_manager` |
| GET | `/api/employees/{id}/social-mood` | Настроение через соцсети | ✅ | `social.read` |
| GET | `/api/employees/{id}/ethics-violations` | Нарушения этики | ✅ | `ethics.read` |

### Статусы и ранги

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/employees/{id}/status` | Текущий статус и ранг | ✅ | - |
| GET | `/api/employees/{id}/status/progress` | Прогресс до следующего статуса | ✅ | - |
| POST | `/api/employees/{id}/status/upgrade` | Повышение статуса | ✅ | `hr_manager` |

---

## 3. Task Resource

### CRUD операции

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/tasks` | Список задач | ✅ | `tasks.read` |
| GET | `/api/tasks/{id}` | Детали задачи | ✅ | `tasks.read` |
| POST | `/api/tasks` | Создать задачу | ✅ | `tasks.create` |
| PUT | `/api/tasks/{id}` | Обновить задачу | ✅ | `tasks.update` |
| DELETE | `/api/tasks/{id}` | Удалить задачу | ✅ | `tasks.delete` |

### Управление задачами

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/tasks/{id}/assign` | Назначить задачу | ✅ | `tasks.assign` |
| POST | `/api/tasks/{id}/complete` | Отметить как выполненную | ✅ | `tasks.update` |
| POST | `/api/tasks/{id}/comment` | Добавить комментарий | ✅ | `tasks.comment` |
| GET | `/api/tasks/volunteer-opportunities` | Задачи для волонтерства | ✅ | - |
| POST | `/api/tasks/{id}/volunteer` | Взять задачу волонтером (+MC) | ✅ | - |

### NLP парсинг

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/tasks/natural-language` | Создать задачу из текста (NLP) | ✅ | `tasks.create` |

---

## 4. Department Resource

### Базовые операции

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/departments` | Список всех департаментов | ✅ | - |
| GET | `/api/departments/{id}` | Детали департамента | ✅ | - |
| GET | `/api/departments/{id}/employees` | Сотрудники департамента | ✅ | `employees.read` |

### Аналитика

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/departments/{id}/kpi` | KPI департамента | ✅ | `kpi.read_team` |
| GET | `/api/departments/{id}/muda` | Анализ потерь (8 типов Muda) | ✅ | `department_head` |
| GET | `/api/departments/{id}/kaizen` | Предложения улучшений | ✅ | - |
| GET | `/api/departments/{id}/emotional-climate` | Эмоциональный климат | ✅ | `department_head` |

### Специфичные департаменты

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/departments/commercial/leads` | Лиды (Коммерческий) | ✅ | `commercial` |
| GET | `/api/departments/finance/pnl-live` | P&L в реальном времени | ✅ | `finance` |
| GET | `/api/departments/finance/alerts` | Финансовые алерты | ✅ | `finance` |
| GET | `/api/departments/production/feedback` | Операционные фидбэки | ✅ | `production` |
| GET | `/api/departments/production/quality-check` | Контроль качества | ✅ | `production` |
| GET | `/api/departments/education/recommendations` | Рекомендации обучения | ✅ | `education` |
| POST | `/api/departments/education/quiz-gen` | Генерация тестов | ✅ | `education` |
| GET | `/api/departments/development/trends` | Тренды рынка | ✅ | `development` |
| POST | `/api/departments/development/ideas` | Генерация идей | ✅ | `development` |

---

## 5. Economy Resource

### Кошелек

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/economy/balance/{userId}` | Баланс (MC + GMC) | ✅ | `economy.read_own` |
| GET | `/api/economy/transactions` | История транзакций | ✅ | `economy.read_own` |
| POST | `/api/economy/transactions` | Создать транзакцию (перевод MC/GMC) | ✅ | `economy.transfer` |
| POST | `/api/economy/safe/activate` | Активировать "Сейф" (заморозка MC) | ✅ | - |
| GET | `/api/economy/safe/status/{userId}` | Статус сейфа | ✅ | - |

### Аукционы

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/economy/auction` | Активные аукционы | ✅ | - |
| GET | `/api/economy/auction/{id}` | Детали аукциона | ✅ | - |
| POST | `/api/economy/auction/{id}/bid` | Сделать ставку | ✅ | - |
| GET | `/api/economy/auction/{id}/history` | История ставок | ✅ | - |

### Магазин

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/economy/store` | Товары в магазине (GMC/MC) | ✅ | - |
| POST | `/api/economy/store/buy` | Купить товар | ✅ | - |
| GET | `/api/economy/store/{itemId}` | Детали товара | ✅ | - |

### Платежи (Российские системы)

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/economy/payment/sberbank` | Оплата через СберБанк | ✅ | - |
| POST | `/api/economy/payment/tinkoff` | Оплата через Тинькофф | ✅ | - |
| POST | `/api/economy/payment/yookassa` | Оплата через ЮКасса | ✅ | - |
| GET | `/api/economy/payment/{transactionId}` | Статус платежа | ✅ | - |

---

## 6. Gamification Resource

### Статусы

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/gamification/status/my` | Мой статус и привилегии | ✅ | - |
| GET | `/api/gamification/status/leaderboard` | Рейтинг по статусам | ✅ | - |
| POST | `/api/gamification/status/claim-reward` | Получить награду за ранг | ✅ | - |

### Лидерборды

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/gamification/leaderboard` | Общий лидерборд (MC) | ✅ | - |
| GET | `/api/gamification/leaderboard/department/{id}` | Лидерборд департамента | ✅ | - |

### Достижения

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/gamification/achievements/{userId}` | Достижения пользователя | ✅ | - |
| POST | `/api/gamification/achievements/{userId}/award` | Наградить достижением | ✅ | `admin` |

### Расчеты

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/gamification/status/calc` | Пересчет статуса/ранга (Cron) | ✅ | `system` |

---

## 7. Legal & Compliance Resource

### Юридические документы

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/legal/documents/templates` | Шаблоны документов | ✅ | `legal.read` |
| POST | `/api/legal/documents/generate` | Генерация документа (AI) | ✅ | `legal.create` |
| GET | `/api/legal/documents/{id}` | Скачать документ | ✅ | `legal.read` |
| POST | `/api/legal/nda/accept` | Принять NDA (при регистрации) | ❌ | - |
| GET | `/api/legal/nda/content` | Текст NDA | ❌ | - |

### Комплаенс

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/compliance/calendar` | Календарь налоговых дедлайнов | ✅ | `finance` |
| POST | `/api/compliance/gdpr/consent` | Управление согласиями GDPR/152-ФЗ | ✅ | - |
| GET | `/api/compliance/risk/audit-log` | Журнал аудита | ✅ | `admin` |
| GET | `/api/compliance/checklist` | Чеклист соответствия | ✅ | `compliance` |

### Российская специфика

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/compliance/labor-law` | Статус соответствия ТК РФ | ✅ | `hr_manager` |
| GET | `/api/compliance/tax-report` | Налоговые отчеты | ✅ | `finance` |
| POST | `/api/compliance/1c-sync` | Синхронизация с 1С | ✅ | `admin` |
| GET | `/api/compliance/evotor-fiscal` | Фискальные данные Evotor | ✅ | `finance` |
| POST | `/api/compliance/152fz-consent` | Согласие 152-ФЗ | ✅ | - |
| GET | `/api/compliance/gov-reporting` | Отчеты в гос. органы | ✅ | `finance` |

### Проверки

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/legal/check-action` | Проверка действия на законность (AI) | ✅ | - |
| GET | `/api/legal/updates` | Изменения в законодательстве | ✅ | `legal.read` |
| GET | `/api/legal/risks` | Дашборд правовых рисков | ✅ | `admin` |

---

## 8. Strategy & Management Resource

### Стратегия

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/strategy/okr` | OKR (Objectives & Key Results) | ✅ | `strategy.read` |
| POST | `/api/strategy/okr` | Создать OKR | ✅ | `strategy.create` |
| PUT | `/api/strategy/okr/{id}` | Обновить OKR | ✅ | `strategy.update` |
| GET | `/api/strategy/okr/{id}/progress` | Прогресс по OKR | ✅ | `strategy.read` |

### Управление трансформацией

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/strategy/ctm/dashboard` | Дашборд ЦУТ | ✅ | `admin` |
| GET | `/api/strategy/ctm/roadmap` | Roadmap трансформации | ✅ | `admin` |

### Аудиты

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/strategy/audit/zsf` | Аудит Золотого Стандарта | ✅ | `admin` |
| GET | `/api/strategy/audit/zsf/results` | Результаты аудита | ✅ | `admin` |

### Совещания

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/strategy/meetings/protocol` | Загрузить протокол (AI парсинг) | ✅ | `manager` |
| GET | `/api/strategy/meetings/{id}/tasks` | Задачи из совещания | ✅ | - |

---

## 9. Feedback Resource

### Ежедневные фидбэки

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/feedback/plan/daily` | Авто-план на день | ✅ | - |
| POST | `/api/feedback/morning` | Утренний фидбэк (фото готовности) | ✅ | - |
| POST | `/api/feedback/evening` | Вечерний фидбэк (План vs Факт) | ✅ | - |
| GET | `/api/feedback/reports` | Агрегированные отчеты | ✅ | `manager` |

### SMART анализ

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/feedback/smart-report` | SMART-отчет с AI-подсказками | ✅ | - |
| GET | `/api/feedback/quality-report` | Оценка качества фидбэков | ✅ | `manager` |

### Челленджи

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/feedback/vkp-challenge` | Челлендж ЦКП на день (+50 MC) | ✅ | - |
| POST | `/api/feedback/vkp-challenge/complete` | Завершить челлендж | ✅ | - |

### Уровни взаимодействия

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/feedback/interaction-level/{userId}` | Текущий уровень | ✅ | - |
| POST | `/api/feedback/interaction-level/{userId}` | Установить уровень | ✅ | `admin` |

---

## 10. Learning & Education Resource

### Курсы и материалы

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/education/courses` | Список курсов | ✅ | - |
| GET | `/api/education/courses/{id}` | Детали курса | ✅ | - |
| POST | `/api/education/courses/{id}/enroll` | Записаться на курс | ✅ | - |
| GET | `/api/education/my-courses` | Мои курсы | ✅ | - |

### Рекомендации

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/education/recommendations/{userId}` | Персональные рекомендации | ✅ | - |

### Тесты

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/education/quiz-gen` | Генерация теста (AI) | ✅ | `education` |
| POST | `/api/education/quiz/{id}/submit` | Отправить ответы | ✅ | - |
| GET | `/api/education/quiz/{id}/results` | Результаты теста | ✅ | - |

---

## 11. Emotional Analytics Resource

### Мониторинг

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/emotional/employee/{id}` | Эмоциональный тон сотрудника (0.0-4.0) | ✅ | `emotional.read` |
| GET | `/api/emotional/company-mood` | Средний тон компании | ✅ | `manager` |
| GET | `/api/emotional/burnout-risks` | Список сотрудников с риском выгорания | ✅ | `hr_manager` |

### История

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/emotional/employee/{id}/history` | История эмоционального тона | ✅ | `emotional.read` |

---

## 12. Self-Learning Resource

### Версионирование знаний

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/learning/knowledge-version` | Текущая версия базы знаний | ✅ | `admin` |
| POST | `/api/learning/knowledge-version/rollback` | Откатить версию | ✅ | `admin` |
| GET | `/api/learning/knowledge-version/history` | История версий | ✅ | `admin` |

### Валидация

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/learning/validate` | Валидация ответа (Anti-Hallucination) | ✅ | `system` |

### Оптимизация

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/learning/optimize-prompts` | ML-оптимизация промптов | ✅ | `admin` |

---

## 13. Executive Dashboard Resource

### Дашборды

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/executive/dashboard` | Главный дашборд (роль-специфичный) | ✅ | `executive` |
| GET | `/api/executive/insights` | Стратегические инсайты (Multi-LLM) | ✅ | `executive` |
| GET | `/api/executive/anomalies` | Детекция аномалий | ✅ | `executive` |
| GET | `/api/executive/predictions` | AI-прогнозы (выручка, риски) | ✅ | `executive` |

---

## 14. HR Analytics Resource

### Аналитика

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/hr/network-analysis` | Анализ сети коммуникаций | ✅ | `hr_manager` |
| GET | `/api/hr/informal-leaders` | Неформальные лидеры (PageRank) | ✅ | `hr_manager` |
| GET | `/api/hr/isolated-employees` | Изолированные сотрудники | ✅ | `hr_manager` |

### Опросы

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/hr/micro-survey` | Запустить микро-опрос (10% сотрудников) | ✅ | `hr_manager` |
| GET | `/api/hr/micro-survey/{id}/results` | Результаты опроса | ✅ | `hr_manager` |

---

## 15. Ethics Manager Resource

### Мониторинг

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/ethics/violations` | Нарушения Конституции | ✅ | `ethics` |
| GET | `/api/ethics/conflicts` | Обнаруженные конфликты | ✅ | `ethics` |

### Медиация

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/ethics/mediate-conflict` | Запустить AI-медиацию | ✅ | `ethics` |
| POST | `/api/ethics/support/{userId}` | Отправить поддержку (тон < 1.5) | ✅ | `system` |

---

## 16. Knowledge Resource

### Поиск

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/knowledge/search` | RAG-поиск по базе знаний | ✅ | - |
| POST | `/api/knowledge/update` | Обновить базу знаний | ✅ | `admin` |

### Эволюция

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/knowledge/industry-insights` | Отраслевые инсайты | ✅ | `manager` |
| GET | `/api/knowledge/competitor-analysis` | Анализ конкурентов | ✅ | `executive` |
| GET | `/api/knowledge/legal-updates` | Правовые изменения | ✅ | `legal.read` |
| GET | `/api/knowledge/weekly-digest` | Еженедельная сводка | ✅ | `executive` |

---

## 17. Content Resource

### Генерация

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/content/generate` | Генерация контента (текст/изображение/видео) | ✅ | `content.create` |
| GET | `/api/content/personalized/{userId}` | Персонализированный контент | ✅ | - |
| GET | `/api/content/mood-based` | Контент на основе настроения компании | ✅ | - |

### Аналитика

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/content/engagement-stats` | Статистика вовлеченности | ✅ | `content.read` |
| POST | `/api/content/ab-test` | A/B тестирование контента | ✅ | `content.create` |

---

## 18. Kaizen Resource

### Улучшения

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/kaizen/improvement` | Подать предложение улучшения (+50 MC) | ✅ | - |
| GET | `/api/kaizen/improvements` | Список улучшений | ✅ | - |
| POST | `/api/kaizen/improvements/{id}/vote` | Проголосовать | ✅ | - |
| POST | `/api/kaizen/improvements/{id}/implement` | Внедрить (+200 MC) | ✅ | `manager` |

### Геймификация

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/kaizen/leaderboard` | Лидерборд по улучшениям | ✅ | - |
| GET | `/api/kaizen/achievements/{userId}` | Достижения Кайдзен | ✅ | - |
| GET | `/api/kaizen/engagement-index` | Индекс вовлеченности (30/квартал) | ✅ | `manager` |

### Челленджи

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/kaizen/challenges` | Еженедельные челленджи | ✅ | - |
| POST | `/api/kaizen/challenges/{id}/participate` | Участвовать | ✅ | - |

---

## 19. Cabinet Resource

### Личный кабинет

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/cabinet/me` | Мои данные | ✅ | - |
| GET | `/api/cabinet/dashboard` | Персональный дашборд | ✅ | - |
| GET | `/api/cabinet/notifications` | Уведомления | ✅ | - |

### HR секция

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| GET | `/api/cabinet/hr/documents` | Кадровые документы | ✅ | - |
| POST | `/api/cabinet/hr/documents/{id}/sign` | Подписать документ (КЭДО) | ✅ | - |
| GET | `/api/cabinet/hr/vacation-schedule` | График отпусков | ✅ | - |
| POST | `/api/cabinet/hr/request-certificate` | Заказать справку | ✅ | - |

---

## 20. Social Monitoring Resource

### Скрининг

| Method | Endpoint | Description | Auth | RBAC |
|--------|----------|-------------|------|------|
| POST | `/api/social/screen-candidate` | Скрининг кандидата (соцсети) | ✅ | `hr_manager` |
| GET | `/api/social/employee-mood/{id}` | Настроение через соцсети | ✅ | `social.read` |
| GET | `/api/social/ethics-violations` | Нарушения этики | ✅ | `ethics` |

---

## 📊 Статистика

### По модулям

| Модуль | Эндпоинтов | Статус |
|--------|-----------|--------|
| Authentication & Authorization | 8 | ✅ MVP |
| Employee Resource | 15 | ✅ MVP |
| Task Resource | 11 | ✅ MVP |
| Department Resource | 16 | ✅ MVP |
| Economy Resource | 17 | ✅ MVP |
| Gamification Resource | 8 | ✅ MVP |
| Legal & Compliance Resource | 18 | ✅ MVP |
| Strategy & Management Resource | 10 | ⏳ Phase 2 |
| Feedback Resource | 10 | ✅ MVP |
| Learning & Education Resource | 8 | ⏳ Phase 2 |
| Emotional Analytics Resource | 4 | ✅ MVP |
| Self-Learning Resource | 5 | ⏳ Phase 2 |
| Executive Dashboard Resource | 4 | ⏳ Phase 2 |
| HR Analytics Resource | 5 | ⏳ Phase 2 |
| Ethics Manager Resource | 4 | ⏳ Phase 2 |
| Knowledge Resource | 6 | ⏳ Phase 2 |
| Content Resource | 5 | ⏳ Phase 2 |
| Kaizen Resource | 9 | ⏳ Phase 2 |
| Cabinet Resource | 7 | ✅ MVP |
| Social Monitoring Resource | 3 | ⏳ Phase 2 |
| **ИТОГО** | **155** | **MVP: 93** |

### По HTTP методам

| Метод | Количество | % |
|-------|-----------|---|
| GET | 89 | 57% |
| POST | 56 | 36% |
| PUT | 3 | 2% |
| PATCH | 1 | 1% |
| DELETE | 6 | 4% |

### По требованиям аутентификации

| Тип | Количество | % |
|-----|-----------|---|
| Требуется JWT | 148 | 95% |
| Публичные | 7 | 5% |

---

## 🔐 RBAC Permissions

### Список разрешений

```typescript
const permissions = [
  // Employees
  'employees.read',
  'employees.create',
  'employees.update',
  'employees.delete',
  'employees.read_all',
  
  // Tasks
  'tasks.read',
  'tasks.create',
  'tasks.update',
  'tasks.delete',
  'tasks.assign',
  'tasks.assign_any',
  'tasks.comment',
  
  // Economy
  'economy.read_own',
  'economy.read_all',
  'economy.transfer',
  'economy.admin',
  
  // KPI
  'kpi.read_own',
  'kpi.read_team',
  'kpi.read_all',
  'kpi.update_own',
  'kpi.update_any',
  
  // Legal
  'legal.read',
  'legal.create',
  'legal.update',
  
  // Strategy
  'strategy.read',
  'strategy.create',
  'strategy.update',
  
  // Content
  'content.read',
  'content.create',
  
  // Social
  'social.read',
  'social.screen',
  
  // Emotional
  'emotional.read',
  
  // Ethics
  'ethics.read',
  'ethics.manage',
  
  // Admin
  'admin.users',
  'admin.roles',
  'admin.settings',
  'admin.audit_logs',
];
```

---

## 🎯 Следующие шаги

1. ✅ Создать полную OpenAPI 3.1 спецификацию
2. ✅ Определить все Request/Response схемы
3. ✅ Добавить валидацию для всех полей
4. ✅ Документировать коды ошибок
5. ⏳ Сгенерировать TypeScript типы
6. ⏳ Создать Postman коллекцию
7. ⏳ Написать интеграционные тесты

---

**Версия:** 2.0.0  
**Дата:** 2025-11-21  
**Статус:** Ready for Implementation
