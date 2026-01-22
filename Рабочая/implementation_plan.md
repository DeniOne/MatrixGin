# Module 33: Frontend + UX Phase — Implementation Plan

**Дата:** 2026-01-22  
**Фаза:** Frontend + UX  
**Цель:** Реализовать полноценный UI для Personnel HR Records module

---

## 📋 Порядок реализации

1. **UX Flows** — HR сценарии, lifecycle
2. **Page Map** — routing structure
3. **API Slice** — RTK Query integration
4. **Pages / Components** — UI implementation

---

## 🎯 Этап 1: UX Flows

### 1.1. HR Lifecycle Scenarios

**Файл:** `documentation/01-modules/33-Personnel-HR-Records/UX-FLOWS.md`

**Основные сценарии:**

#### Сценарий 1: Наём сотрудника (Employee Onboarding)
```
Actor: HR_MANAGER
Flow:
1. Получить уведомление о новом сотруднике (employee.hired event)
2. Открыть автоматически созданное PersonalFile
3. Проверить статус: ONBOARDING
4. Загрузить обязательные документы:
   - Паспорт
   - ИНН
   - СНИЛС
   - Медицинская книжка
5. Создать трудовой договор
6. Отправить приказ о приёме на подпись DIRECTOR
7. После подписи → изменить статус на ACTIVE
```

#### Сценарий 2: Подписание приказа (Order Signing)
```
Actor: DIRECTOR
Flow:
1. Получить уведомление о приказе на подпись
2. Открыть приказ
3. Проверить содержание
4. Подписать приказ (DIRECTOR-only action)
5. Приказ получает статус SIGNED
6. HR_MANAGER получает уведомление
```

#### Сценарий 3: Увольнение сотрудника (Employee Termination)
```
Actor: HR_MANAGER + DIRECTOR
Flow:
1. HR_MANAGER создаёт приказ об увольнении
2. DIRECTOR подписывает приказ
3. HR_MANAGER расторгает трудовой договор (DIRECTOR-only)
4. Изменить статус PersonalFile на TERMINATED
5. Архивировать PersonalFile (emit event → Library)
6. PersonalFile получает статус ARCHIVED
```

#### Сценарий 4: Управление документами (Document Management)
```
Actor: HR_SPECIALIST
Flow:
1. Открыть PersonalFile
2. Перейти на вкладку "Документы"
3. Загрузить новый документ (drag & drop)
4. Указать тип документа, срок действия
5. Документ сохраняется
6. Система показывает индикатор срока действия
7. При истечении срока → уведомление
```

---

### 1.2. User Roles & Permissions

**HR_SPECIALIST:**
- ✅ Просмотр PersonalFiles своего департамента
- ✅ Загрузка документов
- ❌ Создание приказов
- ❌ Изменение статуса

**HR_MANAGER:**
- ✅ Просмотр всех PersonalFiles
- ✅ Создание приказов
- ✅ Создание договоров
- ✅ Изменение статуса
- ❌ Подписание приказов

**DIRECTOR:**
- ✅ Полный доступ
- ✅ Подписание приказов
- ✅ Расторжение договоров

---

## 🎯 Этап 2: Page Map

### 2.1. Routing Structure

```
/personnel
├── /                          → PersonnelFilesListPage
├── /files/:id                 → PersonalFileDetailPage
│   ├── /documents             → DocumentsTab
│   ├── /orders                → OrdersTab
│   ├── /contracts             → ContractsTab
│   └── /history               → HistoryTab
├── /orders                    → OrdersListPage
├── /orders/new                → OrderCreatePage
├── /orders/:id                → OrderDetailPage
├── /contracts                 → ContractsListPage
├── /contracts/new             → ContractCreatePage
├── /contracts/:id             → ContractDetailPage
└── /dashboard                 → HRDashboardPage
```

### 2.2. Page Descriptions

**PersonnelFilesListPage** (`/personnel`)
- Список всех личных дел
- Фильтры: статус, департамент, дата создания
- Поиск по ФИО, номеру дела
- Быстрые действия: открыть, изменить статус

**PersonalFileDetailPage** (`/personnel/files/:id`)
- Карточка личного дела
- Табы: Документы, Приказы, Договоры, История
- Действия: изменить статус, архивировать

**OrdersListPage** (`/personnel/orders`)
- Реестр приказов
- Фильтры: тип, статус, дата
- Быстрые действия: подписать (DIRECTOR), отменить

**ContractsListPage** (`/personnel/contracts`)
- Список договоров
- Фильтры: тип, статус, срок
- Быстрые действия: создать доп. соглашение, расторгнуть

**HRDashboardPage** (`/personnel/dashboard`)
- Виджеты:
  - Истекающие документы
  - Приказы на подпись
  - Новые сотрудники без документов
  - Статистика по статусам

---

## 🎯 Этап 3: API Slice

### 3.1. RTK Query Setup

**Файл:** `frontend/src/api/personnelApi.ts`

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const personnelApi = createApi({
  reducerPath: 'personnelApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/personnel' }),
  tagTypes: ['PersonalFile', 'Order', 'Contract', 'Document'],
  endpoints: (builder) => ({
    // PersonalFiles
    getPersonalFiles: builder.query({
      query: (params) => ({ url: '/files', params }),
      providesTags: ['PersonalFile'],
    }),
    getPersonalFileById: builder.query({
      query: (id) => `/files/${id}`,
      providesTags: (result, error, id) => [{ type: 'PersonalFile', id }],
    }),
    createPersonalFile: builder.mutation({
      query: (body) => ({ url: '/files', method: 'POST', body }),
      invalidatesTags: ['PersonalFile'],
    }),
    updatePersonalFileStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/files/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'PersonalFile', id }],
    }),
    
    // Orders
    getOrders: builder.query({
      query: (params) => ({ url: '/orders', params }),
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Order'],
    }),
    signOrder: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}/sign`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }],
    }),
    
    // Contracts
    getContracts: builder.query({
      query: (params) => ({ url: '/contracts', params }),
      providesTags: ['Contract'],
    }),
    createContract: builder.mutation({
      query: (body) => ({ url: '/contracts', method: 'POST', body }),
      invalidatesTags: ['Contract'],
    }),
    terminateContract: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/contracts/${id}/terminate`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Contract', id }],
    }),
    
    // Documents
    getDocuments: builder.query({
      query: (params) => ({ url: '/documents', params }),
      providesTags: ['Document'],
    }),
    uploadDocument: builder.mutation({
      query: (formData) => ({
        url: '/documents',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Document'],
    }),
  }),
});

export const {
  useGetPersonalFilesQuery,
  useGetPersonalFileByIdQuery,
  useCreatePersonalFileMutation,
  useUpdatePersonalFileStatusMutation,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useSignOrderMutation,
  useGetContractsQuery,
  useCreateContractMutation,
  useTerminateContractMutation,
  useGetDocumentsQuery,
  useUploadDocumentMutation,
} = personnelApi;
```

---

## 🎯 Этап 4: Pages & Components

### 4.1. Components Hierarchy

```
components/personnel/
├── PersonalFileCard.tsx          → Карточка личного дела
├── PersonalFileStatusBadge.tsx   → Индикатор статуса
├── DocumentUploader.tsx          → Drag & drop загрузчик
├── DocumentList.tsx              → Список документов
├── DocumentCard.tsx              → Карточка документа
├── ExpiryBadge.tsx               → Индикатор срока действия
├── OrderForm.tsx                 → Форма создания приказа
├── OrderCard.tsx                 → Карточка приказа
├── ContractForm.tsx              → Форма создания договора
├── ContractCard.tsx              → Карточка договора
└── HRDashboardWidget.tsx         → Виджет для dashboard
```

### 4.2. Key Components

#### PersonalFileCard
```typescript
interface PersonalFileCardProps {
  file: PersonalFile;
  onStatusChange?: (newStatus: HRStatus) => void;
  onArchive?: () => void;
}

// Features:
// - Отображение основной информации
// - Статус badge
// - Быстрые действия
// - Навигация к деталям
```

#### DocumentUploader
```typescript
interface DocumentUploaderProps {
  personalFileId: string;
  onUploadComplete?: () => void;
}

// Features:
// - Drag & drop
// - File type validation
// - Progress indicator
// - Multiple files support
```

#### OrderForm
```typescript
interface OrderFormProps {
  personalFileId: string;
  onSubmit?: (order: Order) => void;
}

// Features:
// - Order type selection
// - Auto-fill employee data
// - Preview
// - Validation
```

---

### 4.3. Pages Implementation

#### PersonnelFilesListPage
```typescript
// Features:
// - Data table с фильтрами
// - Search bar
// - Status filters
// - Department filters
// - Pagination
// - Быстрые действия
```

#### PersonalFileDetailPage
```typescript
// Features:
// - Tabs: Documents, Orders, Contracts, History
// - Status change dialog
// - Archive confirmation
// - Event timeline
```

#### HRDashboardPage
```typescript
// Features:
// - Expiring documents widget
// - Pending orders widget
// - New employees widget
// - Statistics charts
```

---

## 🎨 Design System

### Colors
- **Primary:** `#2563eb` (Blue)
- **Success:** `#10b981` (Green)
- **Warning:** `#f59e0b` (Orange)
- **Danger:** `#ef4444` (Red)
- **Info:** `#3b82f6` (Light Blue)

### Status Colors
- **ONBOARDING:** `#f59e0b` (Orange)
- **ACTIVE:** `#10b981` (Green)
- **SUSPENDED:** `#6b7280` (Gray)
- **TERMINATED:** `#ef4444` (Red)
- **ARCHIVED:** `#9ca3af` (Light Gray)

### Typography
- **Font:** Inter
- **Headings:** 600 weight
- **Body:** 400 weight

---

## ✅ Acceptance Criteria

### UX Flows:
- [ ] Все 4 основных сценария документированы
- [ ] User roles и permissions определены
- [ ] Edge cases описаны

### Page Map:
- [ ] Routing structure определена
- [ ] Все страницы описаны
- [ ] Navigation flows понятны

### API Slice:
- [ ] RTK Query setup завершён
- [ ] Все endpoints определены
- [ ] Cache invalidation настроена

### Pages & Components:
- [ ] Все компоненты реализованы
- [ ] Все страницы реализованы
- [ ] Responsive design
- [ ] Accessibility (WCAG 2.1)

---

## 📊 План реализации

### Этап 1: UX Flows (1 час)
1. ✅ Документировать HR lifecycle scenarios
2. ✅ Определить user roles & permissions
3. ✅ Описать edge cases

### Этап 2: Page Map (30 мин)
1. ✅ Создать routing structure
2. ✅ Описать все страницы
3. ✅ Определить navigation flows

### Этап 3: API Slice (1 час)
1. ✅ Setup RTK Query
2. ✅ Определить endpoints
3. ✅ Настроить cache invalidation

### Этап 4: Components (3 часа)
1. ✅ Создать базовые компоненты
2. ✅ Создать формы
3. ✅ Создать карточки

### Этап 5: Pages (4 часа)
1. ✅ PersonnelFilesListPage
2. ✅ PersonalFileDetailPage
3. ✅ OrdersListPage
4. ✅ ContractsListPage
5. ✅ HRDashboardPage

---

**Автор:** Antigravity AI  
**Дата:** 2026-01-22  
**Статус:** Ready for implementation
