# FUNCTIONAL_REGISTRY.md

## 1. Краткое резюме
- **Общее количество найденных функций:** 78 (48 существующих + 30 планируемых)
- **Количество доменов:** 11 (Университет, ОФС, MatrixGin, Сотрудники, Аналитика, AI, Магазин, Геймификация, Производство, ERP/WMS, Юридический/Compliance)
- **Состояние реестра:** Смешанное (Existing / Planned).
- **Явные пробелы / хаос:** 
  - Разрыв между реализованным ядром (Phase 1-3) и глубоко проработанной документацией ERP-блока (Phase 5).
  - Функции «Эмоционального контура» (Emotional Analytics, Passport) описаны в стратегии, но имеют минимальное присутствие в коде.
  - Модуль 33 (Personnel) и Модуль 29 (Archive) уже имеют реализацию в коде, но требуют интеграции в основное меню.

## 2. Полный реестр функций

| ID | Название | Тип | Домен | Состояние | Роль | FOUNDATION | Меню |
|----|----------|-----|-------|-----------|------|------------|------|
| **FOUNDATION** | | | | | | | |
| F01 | StartPage | Экран | Foundation | Existing | Все | Да | Скрытый |
| F02 | BlockPage | Экран | Foundation | Existing | Все | Да | Скрытый |
| F03 | DecisionPage | Экран | Foundation | Existing | Все | Да | Скрытый |
| F04 | ResultPage | Экран | Foundation | Existing | Все | Да | Скрытый |
| **UNIVERSITY** | | | | | | | |
| U01 | UniversityDashboard | Экран | Университет | Existing | Сотрудник | Нет | Основной |
| U02 | MyCourses | Экран | Университет | Existing | Сотрудник | Нет | Подпункт |
| U03 | CourseReader | Экран | Университет | Existing | Сотрудник | Нет | Скрытый |
| U04 | TrainerDashboard | Экран | Университет | Existing | Trainer | Нет | Основной |
| U05 | UniversitySecurity | Экран | Университет | Existing | Admin/HR | Нет | Подпункт |
| U06 | UniversityAnalytics | Экран | Университет | Existing | Admin/HR | Нет | Подпункт |
| U07 | AcademiesManagement | Сервис | Университет | Existing | Admin | Нет | Скрытый |
| U08 | ContentFactory | Модуль | Университет | **Planned** | Manager/Trainer | Нет | Подпункт |
| **OFS / STRUCTURE** | | | | | | | |
| O01 | OFS (Legacy) | Экран | ОФС | Existing | Руководитель | Нет | Основной |
| O02 | ExecutiveOFS | Экран | ОФС | Existing | Руководитель | Нет | Основной |
| O03 | DeptManagement | Модуль | ОФС | Existing | Admin/HR | Нет | Скрытый |
| O04 | RoleMatrix | Модуль | ОФС | Existing | Admin/HR | Нет | Подпункт |
| O05 | OrgChart | Сервис | ОФС | Existing | Все | Нет | Подпункт |
| O06 | Pyramid/Triangle | Сервис | ОФС | Existing | Все | Нет | Подпункт |
| O07 | RACIMatrix | Сервис | ОФС | Existing | Руководитель | Нет | Подпункт |
| O08 | BranchFeedback | Модуль | ОФС | **Planned** | Руководитель | Нет | Подпункт |
| **PERSONNEL / HR** | | | | | | | |
| E01 | EmployeesList | Экран | Сотрудники | Existing | Все | Нет | Основной |
| E02 | EmployeeProfile | Экран | Сотрудники | Existing | Все | Нет | Скрытый |
| E03 | RegistrationRequests | Модуль | Сотрудники | Existing | Admin/HR | Нет | Подпункт |
| E04 | HRDashboard | Экран | Сотрудники | Existing | HR_MANAGER | Нет | Основной |
| E05 | PersonnelFiles | Экран | Сотрудники | Existing | HR_MANAGER | Нет | Подпункт |
| E06 | Contracts/Orders List | Экран | Сотрудники | Existing | HR_MANAGER | Нет | Подпункт |
| E07 | turnoverPrediction | Сервис | Сотрудники | **Planned** | HR_MANAGER | Нет | Скрытый |
| E08 | Matrix360 (Reviews)| Модуль | Сотрудники | **Planned** | HR/Все | Нет | Подпункт |
| **ECONOMY / STORE** | | | | | | | |
| M01 | Store | Экран | Магазин | Existing | Сотрудник | Нет | Основной |
| M02 | Wallet | Экран | Магазин | Existing | Сотрудник | Нет | Подпункт |
| M03 | Transactions | Экран | Магазин | Existing | Сотрудник | Нет | Подпункт |
| M04 | EconomyDashboard | Экран | Магазин | Existing | Admin | Нет | Скрытый |
| M05 | Auctions | Модуль | Магазин | **Planned** | Сотрудник | Нет | Основной |
| **ANALYTICS & AI** | | | | | | | |
| A01 | PersonalAnalytics | Экран | Аналитика | Existing | Сотрудник | Нет | Подпункт |
| A02 | ExecutiveAnalytics | Экран | Аналитика | Existing | Admin | Нет | Основной |
| A03 | EmotionalAnalytics | Модуль | Аналитика | **Planned** | Руководитель | Нет | Скрытый |
| AI01| PersonalAIRecs | Экран | AI | Existing | Сотрудник | Нет | Подпункт |
| AI02| ExecutiveAIRecs | Экран | AI | Existing | Admin | Нет | Основной |
| AI03| AIFeedbackAnalytics| Экран | AI | Existing | Admin | Нет | Скрытый |
| AI04| RAG KnowledgeBase | Сервис | AI | **Planned** | Все | Нет | Подпункт |
| **ERP / OPERATIONS** | | | | | | | |
| P01 | ProductionSessions | Экран | Производство | Existing | Все | Нет | Основной |
| P02 | QualityControl | Модуль | Производство | **Planned** | Manager | Нет | Подпункт |
| W01 | WarehouseStructure | Модуль | ERP (WMS) | **Planned** | Admin | Нет | Основной |
| W02 | InventoryManagement| Сервис | ERP (WMS) | **Planned** | Admin/Manager | Нет | Подпункт |
| W03 | QR/Barcode Scanner| Сервис | ERP (WMS) | **Planned** | Сотрудник | Нет | Скрытый |
| PR01| PurchaseOrders | Модуль | ERP (Procurement)| **Planned** | Manager | Нет | Основной |
| PR02| SupplierManagement | Сервис | ERP (Procurement)| **Planned** | Manager | Нет | Подпункт |
| B01 | BudgetStructure | Модуль | ERP (Finance) | **Planned** | Executive | Нет | Основной |
| B02 | Forecasting | Сервис | ERP (Finance) | **Planned** | Executive | Нет | Скрытый |
| **LEGAL & SYSTEM** | | | | | | | |
| S01 | StatusManagement | Экран | MatrixGin | Existing | Admin | Нет | Основной |
| S02 | RegistryManagement | Экран | MatrixGin | Existing | Admin | Нет | Основной |
| S03 | Library & Archive | Модуль | MatrixGin | Existing | Все | Нет | Подпункт |
| S04 | Tasks | Экран | Система | Existing | Все | Нет | Основной |
| L01 | Consents/NDA | Модуль | Юридический | **Planned** | Все | Нет | Скрытый |
| L02 | ComplianceDash | Экран | Юридический | **Planned** | Admin | Нет | Подпункт |
| K01 | KaizenIdeas | Модуль | MatrixGin | **Planned** (Partial)| Все | Нет | Основной |

## 3. Группировка по доменам (с учетом будущего)

### Университет (Развитие)
- **Dashboard / My Courses**: Текущее.
- **Content Factory [Planned]**: Инструментарий создания медиа-контента для курсов.
- **Certifications**: Система выдачи и верификации.

### ERP Блок [Planned Phase 5]
- **WMS (Склад)**: Управление остатками и зонами.
- **Procurement (Закупки)**: Работа с поставщиками и заказами.
- **Finance (Бюджеты)**: Планирование и контроль исполнения.

### Аналитика и AI
- **Emotional Passport [Planned]**: Надстройка над профилем для отслеживания состояния.
- **RAG Knowledge Base [Planned]**: Интеллектуальный поиск по документации системы.
- **Turnover Prediction [Planned]**: Предиктивная аналитика увольнений.

### MatrixGin (Canon)
- **Status & Ranks [Planned-Implementation Frozen]**: Каноническая система признания.
- **Kaizen Pipeline**: Система сбора и внедрения улучшений.

## 4. Функции, НЕ ДОЛЖНЫЕ быть в меню
- `Foundation/*` — Изолированный поток иммерсии.
- `QR Scanner` (WMS) — Сервисная функция, вызываемая из контекста.
- `Data Export/Deletion` (Legal) — Сервисные API в профиле пользователя.
- `BullMQ Monitor` [Internal] — Технический мониторинг очередей.

## 5. Предупреждения
1. **Сложность меню Admin:** Если вывести все "Planned" функции, меню администратора превысит 20+ пунктов. Требуется строгая группировка в "Панель управления корпусом" (ERP/Structure/Security).
2. **Перекрытие ролей:** В документации роли `HR_MANAGER` и `ADMIN` часто дублируются. Необходимо уточнить разделение: `ADMIN` (Система/Registry) vs `HR_MANAGER` (Люди/Personnel).
3. **Статус 09 (Ranks):** В коде отсутствует, в стратегии — заморожен. Важно не создать для него пустой пункт в меню.
4. **Library (Module 29):** Имеет мощный Backend, но во фронтенде представлен только в виде типов. Нужен полноценный проводник (Explorer).
