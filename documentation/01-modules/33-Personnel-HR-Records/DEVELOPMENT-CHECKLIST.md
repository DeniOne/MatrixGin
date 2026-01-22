# 📋 Module 33: Personnel HR Records — Development Checklist

> **Статус:** 🔴 Не начат (0%)  
> **Приоритет:** HIGH  
> **Estimated effort:** 3-4 sprints

---

## 📊 Общий прогресс

| Секция | Прогресс | Статус |
|--------|----------|--------|
| Database | 0% | 🔴 |
| Backend API | 0% | 🔴 |
| Frontend | 0% | 🔴 |
| Integrations | 0% | 🔴 |
| Testing | 0% | 🔴 |
| **ИТОГО** | **0%** | 🔴 |

---

## 1. 🗄️ Database (Prisma)

### 1.1. Core Models
- [x] `PersonalFile` — личное дело
- [x] `PersonnelDocument` — документ в личном деле
- [x] `PersonnelOrder` — приказ по личному составу
- [x] `LaborContract` — трудовой договор
- [x] `ContractAmendment` — дополнительное соглашение
- [x] `DocumentTemplate` — шаблоны документов

### 1.2. Enums
- [x] `PersonalFileStatus` (ACTIVE, CLOSED, ARCHIVED)
- [x] `PersonnelDocumentType` (PASSPORT, SNILS, INN, ...)
- [x] `PersonnelOrderType` (HIRING, TRANSFER, VACATION, ...)
- [x] `OrderStatus` (DRAFT, PENDING_APPROVAL, APPROVED, SIGNED, CANCELLED)
- [x] `ContractType` (PERMANENT, FIXED_TERM, PART_TIME, ...)
- [x] `ContractStatus` (ACTIVE, SUSPENDED, TERMINATED)
- [x] `SalaryType` (MONTHLY, HOURLY, PIECEWORK)
- [x] `TemplateType` (LABOR_CONTRACT, ORDER_HIRING, ...)

### 1.3. Migrations
- [x] Создать миграцию `create_personnel_tables`
- [x] Добавить индексы (fileNumber, orderNumber, contractNumber)
- [x] Добавить FK constraints
- [ ] Seed: базовые шаблоны документов

### 1.4. Event Layer (CRITICAL — MatrixGin Requirement!)

> ⚠️ **Любое юридически значимое действие = неизменяемое событие**

#### HRDomainEvent Model
- [x] `HRDomainEvent` — таблица доменных событий
  - id (UUID)
  - eventType (enum HREventType)
  - aggregateType (enum HRAggregateType)
  - aggregateId (UUID)
  - actorId (FK Employee)
  - actorRole (string)
  - payload (JSON)
  - previousState (JSON, nullable)
  - newState (JSON, nullable)
  - legalBasis (string, nullable)
  - occurredAt (timestamp, immutable)

#### Event Types
- [x] `HREventType` enum:
  - EMPLOYEE_HIRED
  - EMPLOYEE_TRANSFERRED
  - EMPLOYEE_PROMOTED
  - EMPLOYEE_DEMOTED
  - EMPLOYEE_SUSPENDED
  - EMPLOYEE_DISMISSED
  - DOCUMENT_UPLOADED
  - DOCUMENT_VERIFIED
  - DOCUMENT_EXPIRED
  - ORDER_CREATED
  - ORDER_SIGNED
  - ORDER_CANCELLED
  - CONTRACT_SIGNED
  - CONTRACT_AMENDED
  - CONTRACT_TERMINATED
  - FILE_ARCHIVED

- [x] `HRAggregateType` enum:
  - PERSONAL_FILE
  - PERSONNEL_ORDER
  - LABOR_CONTRACT
  - PERSONNEL_DOCUMENT

#### Event Emission (обязательно!)
- [ ] Emit `EMPLOYEE_HIRED` при создании PersonalFile + подписании приказа о приёме
- [ ] Emit `CONTRACT_SIGNED` при подписании трудового договора
- [ ] Emit `ORDER_SIGNED` при подписании любого приказа
- [ ] Emit `EMPLOYEE_DISMISSED` при подписании приказа об увольнении
- [ ] Emit `CONTRACT_TERMINATED` при расторжении договора
- [ ] Emit `FILE_ARCHIVED` при передаче дела в Module 29
- [ ] Emit `DOCUMENT_UPLOADED` при загрузке документа в личное дело

#### Constraints
- [x] **NO UPDATE** на таблице `hr_domain_events` (только INSERT)
- [x] **NO DELETE** на таблице `hr_domain_events` (immutable)
- [x] Индекс на `aggregateId` + `eventType`
- [x] Индекс на `occurredAt` (для audit queries)

#### HRStatus FSM
- [x] `HRStatus` enum:
  - ONBOARDING
  - PROBATION
  - EMPLOYED
  - SUSPENDED
  - LEAVE
  - TERMINATED
  - ARCHIVED

- [x] Добавить `hrStatus` в `PersonalFile` model
- [ ] FSM transitions валидация (ONBOARDING → PROBATION/EMPLOYED → ... → ARCHIVED)


---

## 2. 🔧 Backend API

### 2.1. Services

#### PersonalFileService
- [x] `create(employeeId)` — создание личного дела при приёме
- [ ] `findAll(filter)` — список дел с фильтрацией
- [x] `findById(id)` — получение дела с документами
- [x] `updateStatus(id, newStatus, reason)` — обновление статуса с FSM validation
- [ ] `archive(id)` — передача в архив (Module 29)

#### PersonnelDocumentService
- [x] `upload(fileId, documentType, file)` — загрузка документа
- [x] `findByFile(fileId)` — документы в деле
- [ ] `download(id)` — скачивание файла
- [x] `delete(id)` — удаление с аудитом
- [x] `checkExpiring(days)` — поиск истекающих документов

#### PersonnelOrderService
- [x] `create(order)` — создание приказа
- [x] `generateNumber(type)` — автогенерация номера
- [ ] `approve(id)` — согласование
- [x] `sign(id, signerId)` — подписание
- [x] `cancel(id, reason)` — отмена
- [ ] `generatePdf(id)` — генерация PDF

#### LaborContractService
- [x] `create(contract)` — создание договора
- [x] `createAmendment(contractId, changes)` — доп. соглашение
- [x] `terminate(id, reason, date)` — расторжение
- [x] `findExpiring(days)` — истекающие срочные договоры

#### DocumentGeneratorService
- [ ] `generateFromTemplate(templateType, data)` — генерация документа
- [ ] `renderToPdf(html)` — конвертация в PDF
- [ ] `getVariables(templateType)` — получение переменных шаблона

#### HRDomainEventService (CRITICAL!)
- [x] `emit(eventType, aggregateId, actorId, payload)` — эмиссия событий
- [x] `getEventsByAggregate(aggregateId)` — получение событий для аудита
- [x] `replayEvents(aggregateId)` — воспроизведение событий (READ-ONLY)

### 2.2. Domain Logic (CRITICAL!)
- [x] `hr-status-fsm.ts` — FSM validation с каноническим transition map
- [x] `hr-event-validator.ts` — role-based event authorization
- [x] `validateHRStatusTransition()` — валидация переходов статусов
- [x] `validateActorRole()` — валидация ролей для событий

### 2.2. Controllers

#### PersonnelFilesController
- [ ] `GET /api/personnel/files`
- [x] `GET /api/personnel/files/:id`
- [x] `POST /api/personnel/files`
- [x] `PATCH /api/personnel/files/:id/status`
- [ ] `POST /api/personnel/files/:id/archive`

#### PersonnelDocumentsController
- [x] `GET /api/personnel/files/:fileId/documents`
- [x] `POST /api/personnel/files/:fileId/documents`
- [x] `GET /api/personnel/documents/:id`
- [x] `DELETE /api/personnel/documents/:id`
- [x] `GET /api/personnel/documents/expiring`

#### PersonnelOrdersController
- [ ] `GET /api/personnel/orders`
- [x] `POST /api/personnel/orders`
- [x] `GET /api/personnel/orders/:id`
- [x] `POST /api/personnel/orders/:id/sign` (DIRECTOR only)
- [x] `POST /api/personnel/orders/:id/cancel`
- [ ] `GET /api/personnel/orders/:id/pdf`

#### LaborContractsController
- [ ] `GET /api/personnel/contracts`
- [x] `POST /api/personnel/contracts`
- [ ] `GET /api/personnel/contracts/:id`
- [x] `POST /api/personnel/contracts/:id/amendments`
- [x] `POST /api/personnel/contracts/:id/terminate` (DIRECTOR only)
- [x] `GET /api/personnel/contracts/expiring`

#### DocumentGeneratorController
- [ ] `GET /api/personnel/templates`
- [ ] `POST /api/personnel/generate`
- [ ] `GET /api/personnel/certificates/:employeeId`

### 2.3. DTOs
- [x] `CreatePersonalFileDto`
- [x] `PersonalFileResponseDto`
- [x] `UploadDocumentDto`
- [x] `CreateOrderDto`
- [x] `OrderResponseDto`
- [x] `CreateContractDto`
- [x] `ContractResponseDto`
- [x] `UpdateStatusDto`
- [x] `SignOrderDto`
- [x] `CancelOrderDto`
- [x] `CreateAmendmentDto`
- [x] `TerminateContractDto`
- [x] `DocumentResponseDto`

### 2.4. Middleware & Guards
- [ ] `PersonnelAccessGuard` — проверка доступа к личному делу
- [ ] Интеграция с RBAC (роли HR, ADMIN, DIRECTOR)

---

## 3. 🖥️ Frontend

### 3.1. Pages

#### PersonnelListPage
- [ ] Таблица личных дел
- [ ] Фильтры (статус, подразделение, дата)
- [ ] Поиск по ФИО
- [ ] Кнопка создания дела

#### PersonalFileDetailPage
- [ ] Хедер с информацией о сотруднике
- [ ] Табы: Документы, Приказы, Договоры, История
- [ ] Загрузка документов (drag & drop)
- [ ] Статусы документов (просрочен, скоро истекает)

#### OrdersListPage
- [ ] Реестр приказов
- [ ] Фильтры по типу, статусу, дате
- [ ] Быстрые действия (согласовать, подписать)

#### OrderCreatePage
- [ ] Форма создания приказа
- [ ] Выбор типа приказа
- [ ] Автозаполнение данных сотрудника
- [ ] Предпросмотр

#### ContractsListPage
- [ ] Список договоров
- [ ] Фильтры (статус, тип, срок)

#### HRDashboardPage
- [ ] Виджет: Истекающие документы
- [ ] Виджет: Приказы на подпись
- [ ] Виджет: Новые сотрудники (без документов)
- [ ] Виджет: Статистика

### 3.2. Components
- [ ] `PersonalFileCard` — карточка личного дела
- [ ] `DocumentUploader` — загрузчик документов
- [ ] `DocumentList` — список документов с иконками
- [ ] `OrderForm` — форма создания приказа
- [ ] `ContractForm` — форма создания договора
- [ ] `DocumentPreview` — предпросмотр PDF
- [ ] `ExpiryBadge` — индикатор срока действия

### 3.3. Redux/RTK Query
- [ ] `personnelApi` — API slice
- [ ] Кэширование списков
- [ ] Invalidation при изменениях

### 3.4. Routing
- [ ] `/personnel` — список личных дел
- [ ] `/personnel/:id` — карточка личного дела
- [ ] `/personnel/orders` — реестр приказов
- [ ] `/personnel/orders/new` — создание приказа
- [ ] `/personnel/contracts` — список договоров
- [ ] `/personnel/dashboard` — дашборд HR

---

## 4. 🔗 Integrations

### 4.1. Module 02 (Employee)
- [ ] Event listener: при создании Employee → создать PersonalFile
- [ ] Sync: изменения Employee → обновить PersonalFile

### 4.2. Module 04 (OFS)
- [ ] Получение списка должностей для договоров
- [ ] Получение структуры подразделений

### 4.3. Module 07 (Telegram Bot)
- [ ] Intent: "Сформируй справку с работы"
- [ ] Intent: "Мои документы"
- [ ] Quick action: Загрузка документа через бота

### 4.4. Module 23 (Legal Compliance)
- [ ] Применение retention policies
- [ ] Согласие на обработку ПД при приёме
- [ ] Audit log интеграция

### 4.5. Module 29 (Library Archive)
- [ ] API: `archive(personalFileId)` — передача в архив
- [ ] Метаданные для архивации
- [ ] Retention периоды (75 лет для кадровых)

---

## 5. 🧪 Testing

### 5.1. Unit Tests
- [ ] PersonalFileService tests
- [ ] PersonnelOrderService tests
- [ ] LaborContractService tests
- [ ] DocumentGeneratorService tests
- [ ] Order number generation tests

### 5.2. Integration Tests
- [ ] API endpoints tests
- [ ] File upload/download tests
- [ ] PDF generation tests
- [ ] Archive integration tests

### 5.3. Event Layer Tests (CRITICAL!)
- [ ] Event emission tests:
  - [ ] EMPLOYEE_HIRED emitted on hiring
  - [ ] CONTRACT_SIGNED emitted on contract signature
  - [ ] ORDER_SIGNED emitted on order signature
  - [ ] EMPLOYEE_DISMISSED emitted on dismissal
  - [ ] FILE_ARCHIVED emitted on archive
- [ ] Audit trail verification:
  - [ ] All events have actorId
  - [ ] All events have legalBasis (where required)
  - [ ] Events are immutable (no UPDATE/DELETE)
- [ ] Event replay tests:
  - [ ] Reconstruct PersonalFile state from events
  - [ ] Verify FSM transitions via events
  - [ ] Audit log completeness

### 5.4. E2E Tests
- [ ] Create personal file flow
- [ ] Upload document flow
- [ ] Create and sign order flow
- [ ] Generate certificate flow

---

## 6. 📝 Documentation

- [ ] API documentation (Swagger)
- [ ] Шаблоны документов (примеры)
- [ ] Инструкция для HR-специалистов
- [ ] Схема ролей и доступов

---

## 7. 🚀 Deployment

- [ ] Environment variables
- [ ] File storage configuration (MinIO)
- [ ] PDF generation service (Puppeteer)
- [ ] Database migrations in production

---

## 📅 Sprint Planning

### Sprint 1: Foundation
- Database models & migrations
- PersonalFile CRUD
- Document upload

### Sprint 2: Orders
- All order types
- Order workflow (draft → signed)
- PDF generation

### Sprint 3: Contracts
- Labor contracts
- Amendments
- Templates

### Sprint 4: Integrations & Polish
- Module 02 integration
- Module 29 integration
- HR Dashboard
- Testing

---

*Документ создан: 2026-01-22*
