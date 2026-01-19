# System Patterns: MatrixGin

## Architectural Philosophy
MatrixGin — это **Registry-Driven** система. Весь проект строится вокруг Системного Реестра (Registry), который является единым источником правды для метаданных, схем сущностей и прав доступа.

## Key Patterns

### 1. Registry-Driven Architecture
- Все сущности описываются через дескрипторы (JSON) в Реестре.
- Логика взаимодействия (relationships) и жизненные циклы (FSM) определяются метаданными.
- AI потребляет Реестр как канонический граф знаний.

### 2. Bounded Contexts (Vertical Domain Modules)
- Каждый модуль (например, PSEE, MES, Store) автономен.
- Модули общаются через события или read-only проекции.
- Пример: PSEE (PhotoSession Economic Engine) — это источник операционной истины, MatrixGin потребляет его события.

### 3. FSM (Finite State Machine)
- Переходы между состояниями сущностей строго валидируются на уровне сервисов.
- История каждого перехода (кто, когда, зачем) записывается в `history` или `auditLog`.

### 4. Canonical Guards (GMC Philosophy)
- Каждое действие проверяется на соответствие Канону (МАСТЕР-РЕГЛАМЕНТ).
- GMC (Golden Matrix Coin) — это "физика" системы, обеспечивающая баланс и прозрачность.

## Security & Ethics Patterns
- **Secure Core**: Критически важные модули находятся во внутреннем контуре.
- **Explainability**: Все рекомендации AI должны иметь логическое обоснование.
- **Human-in-the-loop**: Решения, влияющие на людей, требуют человеческого подтверждения.

## Reference Documents
- [ARCHITECTURE.md](file:///f:/Matrix_Gin/documentation/ARCHITECTURE.md)
- [MASTER_CHECKLIST.md](file:///f:/Matrix_Gin/documentation/MASTER_CHECKLIST.md)
