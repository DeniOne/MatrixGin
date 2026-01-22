# MODULES-IN-SCOPE — MVP Learning Contour (v1.1)

## 0. Назначение документа

Данный документ фиксирует перечень модулей, разрешённых к эксплуатации в рамках MVP Learning Contour v1.1.

## 1. Разрешённые модули

### 1.1 Интерфейсы
- **Module 07 — Telegram Bot**: Операционное сопровождение, нотификации.
- **Web UI (Frontend)**: Глубокое обучение, личный кабинет, дашборды управления.

### 1.2 Прикладная логика
- **Module 13 — Corporate University**:
    - Quiz Engine (Автоматизированная аттестация).
    - Anti-Fraud Engine (Пассивная детекция аномалий).
    - Trainer Institute (Управление наставничеством).
- **Module 33 — Personnel Records**: Регистрация сотрудников и грейды.

### 1.3 Инфраструктура
- **Analytics Service**: Read-only дашборды для HR/Admin.
- **IntegrityActionService**: Интерфейс ручных решений и Audit Log.
- **Event Registry**: Единая шина событий.

## 2. Разрешённый AI-слой
В v1.1 разрешено использование **пассивных AI Engine**:
- **Anti-Fraud Engine**: Анализ паттернов поведения без права автоматической блокировки.
- **Reward Proxy**: Автоматическое начисление MC на основе канонических событий.

## 3. Статус документа
- **Статус**: Active / Canonical (Update v1.1)
- **Контур**: MVP Learning Contour
