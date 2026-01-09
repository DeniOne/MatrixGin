# Чеклист разработки: ОФС – Организационно-Функциональная Схема

**Модуль:** 23-OFS-Organizational-Structure  
**Статус:** 🔴 Не начат  
**Прогресс:** 0/100

---

## 📅 ПЛАН РАЗРАБОТКИ

### Неделя 1: Database & Backend Core
- **Дни 1-2:** Database schema, migrations
- **Дни 3-4:** Core services (Department, Employee, Role Matrix)
- **День 5:** API endpoints (basic CRUD)

### Неделя 2: Advanced Features
- **Дни 1-2:** History & Audit, Reporting relationships
- **Дни 3-4:** Export functionality (PDF/Excel/Markdown)
- **День 5:** Analytics & Reports

### Неделя 3: Frontend
- **Дни 1-2:** Org-chart visualization
- **Дни 3-4:** Department/Employee management UI
- **День 5:** Testing & Bug fixes

---

## ✅ ЧЕКЛИСТ BACKEND

### 1. Database Schema (6 часов) 🔴

#### 1.1 Расширение существующих таблиц

- [ ] **1.1.1** Проверить текущую схему `departments`
  ```sql
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'departments';
  ```

- [ ] **1.1.2** Добавить поля в `departments`
  ```sql
  ALTER TABLE departments ADD COLUMN IF NOT EXISTS functions TEXT[];
  ALTER TABLE departments ADD COLUMN IF NOT EXISTS kpis JSONB;
  ALTER TABLE departments ADD COLUMN IF NOT EXISTS annual_goals TEXT;
  ```

- [ ] **1.1.3** Добавить поля в `employees`
  ```sql
  ALTER TABLE employees ADD COLUMN IF NOT EXISTS competencies JSONB;
  ALTER TABLE employees ADD COLUMN IF NOT EXISTS certifications JSONB;
  ALTER TABLE employees ADD COLUMN IF NOT EXISTS skills TEXT[];
  ```

- [ ] **1.1.4** Создать индексы
  ```sql
  CREATE INDEX IF NOT EXISTS idx_departments_path ON departments USING GIST(path);
  CREATE INDEX IF NOT EXISTS idx_departments_level ON departments(level);
  CREATE INDEX IF NOT EXISTS idx_employees_skills ON employees USING GIN(skills);
  ```

#### 1.2 Новые таблицы

- [ ] **1.2.1** Создать `role_competency_matrix`
  - role_name, department_id
  - required_competencies (JSONB)
  - responsibilities (TEXT[])
  - permissions (JSONB)
  - salary_min, salary_max

- [ ] **1.2.2** Создать `employee_roles`
  - employee_id, role_matrix_id
  - assigned_at, effective_from, effective_to
  - assigned_by, is_active

- [ ] **1.2.3** Создать `org_structure_history`
  - entity_type, entity_id
  - action (created/updated/deleted/moved)
  - changed_by
  - old_data, new_data (JSONB)
  - reason, ip_address, user_agent

- [ ] **1.2.4** Создать `reporting_relationships`
  - subordinate_id, supervisor_id
  - relationship_type (direct/functional/dotted_line)
  - effective_from, effective_to
  - is_active

- [ ] **1.2.5** Создать индексы для новых таблиц
  ```sql
  CREATE INDEX idx_role_matrix_dept ON role_competency_matrix(department_id);
  CREATE INDEX idx_employee_roles_employee ON employee_roles(employee_id);
  CREATE INDEX idx_org_history_entity ON org_structure_history(entity_type, entity_id);
  CREATE INDEX idx_reporting_active ON reporting_relationships(is_active);
  ```

- [ ] **1.2.6** Добавить комментарии к таблицам
- [ ] **1.2.7** Создать migration файл

**Файлы:**
```
database/migrations/20251123000001_create_ofs_tables.sql
```

**Статус:** 0% завершено

---

### 2. Prisma Schema Update (2 часа) 🔴

- [ ] **2.1** Обновить `prisma/schema.prisma`
  - Добавить модели RoleCompetencyMatrix
  - Добавить модели EmployeeRole
  - Добавить модели OrgStructureHistory
  - Добавить модели ReportingRelationship

- [ ] **2.2** Обновить существующие модели
  - Department: добавить functions, kpis, annual_goals
  - Employee: добавить competencies, certifications, skills

- [ ] **2.3** Настроить связи между моделями

- [ ] **2.4** Запустить `npx prisma generate`

- [ ] **2.5** Запустить `npx prisma db push` (или migrate)

**Статус:** 0% завершено

---

### 3. DTOs (5 часов) 🔴

#### 3.1 Department DTOs

- [ ] **3.1.1** `CreateDepartmentDto`
  ```typescript
  - name: string
  - code: string
  - description?: string
  - parent_id?: UUID
  - head_id?: UUID
  - functions?: string[]
  - kpis?: Record<string, any>
  - budget_annual?: number
  ```

- [ ] **3.1.2** `UpdateDepartmentDto`
  - Все поля опциональны

- [ ] **3.1.3** `MoveDepartmentDto`
  ```typescript
  - new_parent_id: UUID
  - reason: string
  ```

- [ ] **3.1.4** `DepartmentResponseDto`
  - С вложенной структурой children

#### 3.2 Role Matrix DTOs

- [ ] **3.2.1** `CreateRoleMatrixDto`
  ```typescript
  - role_name: string
  - department_id: UUID
  - required_competencies: Record<string, number>
  - responsibilities: string[]
  - permissions?: Record<string, any>
  - salary_min?: number
  - salary_max?: number
  ```

- [ ] **3.2.2** `AssignRoleDto`
  ```typescript
  - employee_id: UUID
  - effective_from: Date
  - reason?: string
  ```

#### 3.3 Employee DTOs (расширение)

- [ ] **3.3.1** `UpdateCompetenciesDto`
  ```typescript
  - competencies: Record<string, number>
  - certifications?: Certification[]
  - skills?: string[]
  ```

- [ ] **3.3.2** `TransferEmployeeDto`
  ```typescript
  - new_department_id: UUID
  - new_position: string
  - effective_date: Date
  - reason: string
  ```

#### 3.4 Reporting DTOs

- [ ] **3.4.1** `CreateReportingRelationshipDto`
  ```typescript
  - subordinate_id: UUID
  - supervisor_id: UUID
  - relationship_type: 'direct' | 'functional' | 'dotted_line'
  - effective_from: Date
  - reason?: string
  ```

#### 3.5 Export DTOs

- [ ] **3.5.1** `ExportPdfDto`
  ```typescript
  - department_id?: UUID
  - include_photos: boolean
  - include_contacts: boolean
  - format: 'portrait' | 'landscape'
  ```

**Файлы:**
```
src/dto/ofs/department.dto.ts
src/dto/ofs/role-matrix.dto.ts
src/dto/ofs/employee.dto.ts
src/dto/ofs/reporting.dto.ts
src/dto/ofs/export.dto.ts
```

**Статус:** 0% завершено

---

### 4. Department Service (8 часов) 🔴

- [ ] **4.1** Создать `OFSDepartmentService`

- [ ] **4.2** `getAllDepartments(format: 'tree' | 'flat', includeInactive)`
  ```typescript
  // Получить все департаменты
  // Формат tree: древовидная структура
  // Формат flat: плоский список
  // С подсчетом сотрудников
  ```

- [ ] **4.3** `getDepartmentById(id: string)`
  - С загрузкой head, parent, children
  - С подсчетом сотрудников

- [ ] **4.4** `createDepartment(dto: CreateDepartmentDto, userId: string)`
  - Валидация уникальности code
  - Расчет level на основе parent_id
  - Создание записи в history
  - Обновление path (ltree)

- [ ] **4.5** `updateDepartment(id: string, dto: UpdateDepartmentDto, userId: string)`
  - Валидация изменений
  - Создание записи в history
  - Аудит лог

- [ ] **4.6** `moveDepartment(id: string, dto: MoveDepartmentDto, userId: string)`
  - Проверка циклических зависимостей
  - Обновление path для всех дочерних департаментов
  - Создание записи в history с действием 'moved'

- [ ] **4.7** `deleteDepartment(id: string, userId: string)`
  - Soft delete (is_active = false)
  - Проверка наличия сотрудников
  - Проверка наличия дочерних департаментов
  - Создание записи в history

- [ ] **4.8** `getDepartmentHierarchy(departmentId: string, depth: number)`
  - Использовать ltree для быстрых запросов
  - Ограничение глубины

- [ ] **4.9** `getDepartmentStats()`
  ```typescript
  // Статистика по департаментам:
  // - Общее количество
  // - Количество по уровням
  // - Средний размер департамента
  // - Глубина иерархии
  ```

**Файл:**
```
src/services/ofs-department.service.ts
```

**Статус:** 0% завершено

---

### 5. Role Matrix Service (6 часов) 🔴

- [ ] **5.1** Создать `RoleMatrixService`

- [ ] **5.2** `getAllRoles(departmentId?: string)`
  - Список всех ролей
  - Фильтр по департаменту
  - С подсчетом текущих сотрудников в роли

- [ ] **5.3** `getRoleById(id: string)`
  - Детали роли
  - Список сотрудников с этой ролью

- [ ] **5.4** `createRole(dto: CreateRoleMatrixDto, userId: string)`
  - Валидация уникальности role_name + department_id
  - Создание записи в history

- [ ] **5.5** `updateRole(id: string, dto: UpdateRoleMatrixDto, userId: string)`
  - Обновление роли
  - History log

- [ ] **5.6** `assignRole(roleId: string, dto: AssignRoleDto, userId: string)`
  ```typescript
  // Назначить роль сотруднику:
  // - Деактивировать предыдущую роль (если есть)
  // - Создать новую запись в employee_roles
  // - Проверить соответствие компетенций
  // - Создать history record
  ```

- [ ] **5.7** `unassignRole(employeeRoleId: string, userId: string)`
  - Установить is_active = false
  - Установить effective_to = NOW()
  - History log

- [ ] **5.8** `getEmployeeRoles(employeeId: string)`
  - Текущие активные роли
  - История ролей

- [ ] **5.9** `checkCompetencyMatch(employeeId: string, roleId: string)`
  ```typescript
  // Проверить соответствие компетенций сотрудника требованиям роли
  // Вернуть процент соответствия
  ```

**Файл:**
```
src/services/role-matrix.service.ts
```

**Статус:** 0% завершено

---

### 6. Employee Service Extension (5 часов) 🔴

Расширение существующего `EmployeeService`

- [ ] **6.1** `updateCompetencies(employeeId: string, dto: UpdateCompetenciesDto, userId: string)`
  ```typescript
  // Обновить компетенции сотрудника
  // Сохранить в history
  ```

- [ ] **6.2** `transferEmployee(employeeId: string, dto: TransferEmployeeDto, userId: string)`
  ```typescript
  // Перевести сотрудника в другой департамент:
  // - Обновить department_id
  // - Обновить position
  // - Создать history record с action 'moved'
  // - Уведомление старому и новому руководителю
  ```

- [ ] **6.3** `getEmployeeWithRoles(employeeId: string)`
  - Полная информация о сотруднике
  - Все активные роли
  - Компетенции и сертификаты
  - Reporting relationships

- [ ] **6.4** `searchEmployees(filters: EmployeeSearchFilters)`
  ```typescript
  // Поиск по:
  // - department_id
  // - role
  // - competencies (has_competencies array)
  // - skills
  // - status
  ```

**Файл:**
```
src/services/employee.service.ts (расширить существующий)
```

**Статус:** 0% завершено

---

### 7. Reporting Relationships Service (4 часа) 🔴

- [ ] **7.1** Создать `ReportingService`

- [ ] **7.2** `getReportingStructure(employeeId: string)`
  ```typescript
  // Получить:
  // - Кому подчиняется (все supervisor)
  // - Кто подчиняется (все subordinates)
  // - Типы отношений
  ```

- [ ] **7.3** `createReportingRelationship(dto: CreateReportingRelationshipDto, userId: string)`
  - Проверка на циклические зависимости
  - Валидация subordinate_id != supervisor_id
  - Создание записи
  - History log

- [ ] **7.4** `updateReportingRelationship(id: string, dto: UpdateReportingDto, userId: string)`

- [ ] **7.5** `endReportingRelationship(id: string, userId: string)`
  - Установить is_active = false
  - Установить effective_to = NOW()

- [ ] **7.6** `getOrganizationChart(rootDepartmentId: string, depth: number)`
  ```typescript
  // Построить org-chart для визуализации:
  // {
  //   id, name, type, head, children
  // }
  // Рекурсивная структура до указанной глубины
  ```

**Файл:**
```
src/services/reporting.service.ts
```

**Статус:** 0% завершено

---

### 8. History & Audit Service (5 часов) 🔴

- [ ] **8.1** Создать `OFSHistoryService`

- [ ] **8.2** `logChange(params: HistoryLogParams)`
  ```typescript
  interface HistoryLogParams {
    entity_type: 'department' | 'employee' | 'role';
    entity_id: string;
    action: 'created' | 'updated' | 'deleted' | 'moved' | 'assigned';
    changed_by: string;
    old_data?: any;
    new_data?: any;
    reason?: string;
    ip_address?: string;
    user_agent?: string;
  }
  ```

- [ ] **8.3** `getHistory(filters: HistoryFilters)`
  ```typescript
  // Фильтры:
  // - entity_type, entity_id
  // - action
  // - date_from, date_to
  // - changed_by
  // Пагинация
  ```

- [ ] **8.4** `getEntityHistory(entityType: string, entityId: string)`
  - Вся история изменений конкретной сущности
  - Сортировка по дате (DESC)

- [ ] **8.5** `getDepartmentChangeLog(departmentId: string, dateFrom?: Date, dateTo?: Date)`
  - История изменений департамента и всех вложенных

- [ ] **8.6** `exportHistoryReport(filters: HistoryFilters, format: 'csv' | 'excel')`
  - Экспорт истории в файл

**Middleware Integration:**

- [ ] **8.7** Создать `@HistoryLog()` декоратор
  ```typescript
  // Автоматическое логирование изменений
  // При вызове методов с этим декоратором
  ```

**Файл:**
```
src/services/ofs-history.service.ts
src/decorators/history-log.decorator.ts
```

**Статус:** 0% завершено

---

### 9. Export Service (8 часов) 🔴

- [ ] **9.1** Создать `OFSExportService`

#### PDF Export

- [ ] **9.2** `exportOrgChartToPDF(options: ExportPdfDto)`
  ```typescript
  // Использовать puppeteer или pdfmake
  // - Рендер org-chart в HTML
  // - Конвертация в PDF
  // - Сохранение в storage
  // - Возврат download URL
  ```

- [ ] **9.3** Установить зависимости
  ```bash
  npm install puppeteer pdfmake
  ```

- [ ] **9.4** Создать HTML template для org-chart

#### Excel Export

- [ ] **9.5** `exportDepartmentsToExcel(departmentId?: string)`
  ```typescript
  // Использовать xlsx
  // Листы:
  // - Departments (список всех департаментов)
  // - Employees (все сотрудники с департаментами)
  // - Roles (матрица ролей)
  ```

- [ ] **9.6** `exportEmployeesToExcel(filters: EmployeeFilters)`
  ```typescript
  // Экспорт списка сотрудников
  // С фильтрацией по департаменту, роли, статусу
  ```

- [ ] **9.7** Установить зависимости
  ```bash
  npm install xlsx
  ```

#### Markdown Export

- [ ] **9.8** `exportOrgChartToMarkdown(departmentId: string)`
  ```typescript
  // Генерация Markdown документа с org-chart
  // Древовидная структура с indent
  ```

**Файл:**
```
src/services/ofs-export.service.ts
```

**Статус:** 0% завершено

---

### 10. Analytics Service (4 часа) 🔴

- [ ] **10.1** Создать `OFSAnalyticsService`

- [ ] **10.2** `getStructureStatistics()`
  ```typescript
  // Общая статистика:
  // - Общее количество департаментов
  // - Общее количество сотрудников
  // - Средний размер департамента
  // - Глубина иерархии
  // - Департаменты по уровням
  ```

- [ ] **10.3** `getDepartmentAnalytics(departmentId: string)`
  ```typescript
  // Аналитика по департаменту:
  // - Headcount
  // - Headcount breakdown (по позициям)
  // - Tenure distribution
  // - Competency coverage
  // - Reporting relationships count
  ```

- [ ] **10.4** `getCompetencyGapAnalysis(departmentId?: string)`
  ```typescript
  // Gap analysis:
  // - Требуемые компетенции (из role matrix)
  // - Текущие компетенции (из employees)
  // - Пробелы (gaps)
  // - Рекомендации по обучению
  ```

- [ ] **10.5** `getTurnoverAnalysis(dateFrom: Date, dateTo: Date)`
  ```typescript
  // Анализ движения персонала:
  // - Количество hired
  // - Количество terminated
  // - Transfers между департаментами
  // - Turnover rate
  ```

**Файл:**
```
src/services/ofs-analytics.service.ts
```

**Статус:** 0% завершено

---

### 11. Controllers (8 часов) 🔴

#### 11.1 OFS Department Controller

- [ ] **11.1.1** Создать `OFSDepartmentController`

- [ ] **11.1.2** `GET /api/ofs/departments`
  - Query: format, include_inactive, with_stats

- [ ] **11.1.3** `GET /api/ofs/departments/:id`

- [ ] **11.1.4** `POST /api/ofs/departments`
  - Auth: HR Manager, Admin
  - Validation: CreateDepartmentDto

- [ ] **11.1.5** `PUT /api/ofs/departments/:id`
  - Auth: HR Manager, Admin

- [ ] **11.1.6** `DELETE /api/ofs/departments/:id`
  - Auth: Admin only

- [ ] **11.1.7** `POST /api/ofs/departments/:id/move`
  - Auth: HR Manager, Admin

#### 11.2 Role Matrix Controller

- [ ] **11.2.1** Создать `RoleMatrixController`

- [ ] **11.2.2** `GET /api/ofs/role-matrix`

- [ ] **11.2.3** `GET /api/ofs/role-matrix/:id`

- [ ] **11.2.4** `POST /api/ofs/role-matrix`
  - Auth: HR Manager, Admin

- [ ] **11.2.5** `PUT /api/ofs/role-matrix/:id`

- [ ] **11.2.6** `POST /api/ofs/role-matrix/:roleId/assign`
  - Назначение роли сотруднику

#### 11.3 Employee Controller (расширение)

- [ ] **11.3.1** `GET /api/ofs/employees`
  - С расширенными фильтрами

- [ ] **11.3.2** `PUT /api/ofs/employees/:id/competencies`
  - Обновление компетенций

- [ ] **11.3.3** `POST /api/ofs/employees/:id/transfer`
  - Перевод в другой департамент

#### 11.4 Reporting Controller

- [ ] **11.4.1** Создать `ReportingController`

- [ ] **11.4.2** `GET /api/ofs/reporting/:employeeId`
  - Все линии отчетности

- [ ] **11.4.3** `POST /api/ofs/reporting`
  - Создание reporting relationship

- [ ] **11.4.4** `DELETE /api/ofs/reporting/:id`
  - Завершение reporting relationship

#### 11.5 Org Chart Controller

- [ ] **11.5.1** Создать `OrgChartController`

- [ ] **11.5.2** `GET /api/ofs/org-chart`
  - Query: department_id, depth, include_photos

#### 11.6 History Controller

- [ ] **11.6.1** Создать `OFSHistoryController`

- [ ] **11.6.2** `GET /api/ofs/history`
  - Фильтры + пагинация

#### 11.7 Export Controller

- [ ] **11.7.1** Создать `OFSExportController`

- [ ] **11.7.2** `POST /api/ofs/export/pdf`
  - Генерация PDF

- [ ] **11.7.3** `POST /api/ofs/export/excel`
  - Генерация Excel

- [ ] **11.7.4** `POST /api/ofs/export/markdown`
  - Генерация Markdown

#### 11.8 Analytics Controller

- [ ] **11.8.1** Создать `OFSAnalyticsController`

- [ ] **11.8.2** `GET /api/ofs/reports/structure`
  - Общая статистика

- [ ] **11.8.3** `GET /api/ofs/reports/department/:id`
  - Аналитика департамента

- [ ] **11.8.4** `GET /api/ofs/reports/competency-gap`
  - Gap analysis

**Файлы:**
```
src/controllers/ofs-department.controller.ts
src/controllers/role-matrix.controller.ts
src/controllers/reporting.controller.ts
src/controllers/org-chart.controller.ts
src/controllers/ofs-history.controller.ts
src/controllers/ofs-export.controller.ts
src/controllers/ofs-analytics.controller.ts
```

**Статус:** 0% завершено

---

### 12. Routes & Middleware (3 часа) 🔴

- [ ] **12.1** Создать роутеры для всех контроллеров

- [ ] **12.2** Настроить RBAC middleware
  ```typescript
  // Только HR Manager и Admin могут:
  // - Создавать/редактировать департаменты
  // - Создавать/редактировать роли
  // - Переводить сотрудников
  // - Создавать reporting relationships
  ```

- [ ] **12.3** Добавить валидационный middleware
  - Валидация всех DTOs с помощью class-validator

- [ ] **12.4** Добавить rate limiting для export endpoints
  ```typescript
  // Ограничение: 10 export запросов в час
  ```

- [ ] **12.5** Зарегистрировать роутеры в main app

**Файлы:**
```
src/routes/ofs.routes.ts
```

**Статус:** 0% завершено

---

## ✅ ЧЕКЛИСТ FRONTEND

### 13. Redux Store (6 часов) 🔴

- [ ] **13.1** Создать `ofsSlice`
  ```typescript
  // State:
  // - departments: Department[]
  // - selectedDepartment: Department | null
  // - employees: Employee[]
  // - roleMatrix: RoleMatrix[]
  // - orgChart: OrgChartNode | null
  // - history: HistoryRecord[]
  // - loading, error
  ```

- [ ] **13.2** Создать `ofsApi` (RTK Query)
  ```typescript
  // Endpoints:
  // - getDepartments
  // - createDepartment
  // - updateDepartment
  // - moveDepartment
  // - getOrgChart
  // - getRoleMatrix
  // - assignRole
  // - getHistory
  // - exportPDF
  ```

- [ ] **13.3** Создать actions и reducers

**Файлы:**
```
frontend/src/features/ofs/ofsSlice.ts
frontend/src/features/ofs/ofsApi.ts
```

**Статус:** 0% завершено

---

### 14. Org Chart Visualization (12 часов) 🔴

#### 14.1 Библиотека визуализации

- [ ] **14.1.1** Выбрать библиотеку
  - Вариант 1: React Flow (рекомендуется)
  - Вариант 2: @antv/g6
  - Вариант 3: GoJS (commercial)

- [ ] **14.1.2** Установить зависимости
  ```bash
  npm install reactflow
  # или
  npm install @antv/g6
  ```

#### 14.2 OrgChart Component

- [ ] **14.2.1** Создать `OrgChart` компонент
  ```typescript
  interface OrgChartProps {
    data: OrgChartNode;
    onNodeClick?: (node: OrgChartNode) => void;
    onNodeDragEnd?: (node: OrgChartNode, newParent: OrgChartNode) => void;
    editable?: boolean;
  }
  ```

- [ ] **14.2.2** Реализовать рендеринг узлов
  - Department узлы (прямоугольники)
  - Employee узлы (круги с аватарами)
  - Линии связи

- [ ] **14.2.3** Добавить drag & drop
  ```typescript
  // Перемещение департаментов в иерархии
  // Валидация перед drop (не создавать циклы)
  ```

- [ ] **14.2.4** Добавить zoom & pan

- [ ] **14.2.5** Добавить minimap

- [ ] **14.2.6** Добавить поиск по org-chart
  ```typescript
  // Поиск департамента/сотрудника
  // Highlight найденного узла
  ```

- [ ] **14.2.7** Добавить экспорт в PNG
  ```typescript
  // Export текущего view в PNG
  ```

- [ ] **14.2.8** Стилизация узлов
  - Tailwind CSS
  - Разные цвета по уровню иерархии
  - Hover эффекты

**Файл:**
```
frontend/src/features/ofs/OrgChart.tsx
frontend/src/features/ofs/OrgChartNode.tsx
```

**Статус:** 0% завершено

---

### 15. Department Management UI (8 часов) 🔴

#### 15.1 Department List

- [ ] **15.1.1** Создать `DepartmentList` компонент
  ```typescript
  // Список всех департаментов
  // View modes: tree, flat
  // Фильтры: status, search
  ```

- [ ] **15.1.2** Древовидное отображение
  - Expandable/collapsible tree
  - Иконки для expand/collapse
  - Indent для уровней вложенности

- [ ] **15.1.3** Плоский список с таблицей
  - Колонки: Name, Code, Head, Employees, Level, Actions
  - Сортировка по колонкам
  - Pagination

#### 15.2 Department Form

- [ ] **15.2.1** Создать `DepartmentForm` компонент
  ```typescript
  // Форма создания/редактирования департамента
  // React Hook Form + Zod validation
  ```

- [ ] **15.2.2** Поля формы
  - Name (required)
  - Code (required, uppercase)
  - Description
  - Parent department (select)
  - Head (employee select)
  - Functions (multi-input)
  - KPIs (JSON editor or form)
  - Annual goals
  - Budget

- [ ] **15.2.3** Валидация
  ```typescript
  // Zod schema:
  // - name: min 3 chars
  // - code: uppercase, unique
  // - budget: positive number
  ```

#### 15.3 Department Details

- [ ] **15.3.1** Создать `DepartmentDetails` компонент
  ```typescript
  // Детальная информация о департаменте
  // Tabs: Overview, Employees, Sub-departments, History
  ```

- [ ] **15.3.2** Overview tab
  - Основная информация
  - Статистика (headcount, budget utilization)
  - KPIs progress

- [ ] **15.3.3** Employees tab
  - Список сотрудников департамента
  - Фильтр по позиции, статусу

- [ ] **15.3.4** Sub-departments tab
  - Список дочерних департаментов

- [ ] **15.3.5** History tab
  - История изменений департамента

**Файлы:**
```
frontend/src/features/ofs/DepartmentList.tsx
frontend/src/features/ofs/DepartmentForm.tsx
frontend/src/features/ofs/DepartmentDetails.tsx
```

**Статус:** 0% завершено

---

### 16. Employee Management UI (6 часов) 🔴

#### 16.1 Employee Profile (расширение)

- [ ] **16.1.1** Расширить существующий `EmployeeProfile`
  - Добавить вкладку "Компетенции"
  - Добавить вкладку "Роли"
  - Добавить вкладку "Reporting"

#### 16.2 Competencies Tab

- [ ] **16.2.1** Отображение компетенций
  ```typescript
  // Radar chart или bar chart
  // Сравнение текущих vs требуемых (из role matrix)
  ```

- [ ] **16.2.2** Форма редактирования компетенций
  ```typescript
  // Slider для каждой компетенции (1-10)
  // Список сертификатов
  // Список навыков (tags input)
  ```

#### 16.3 Roles Tab

- [ ] **16.3.1** Текущие роли сотрудника
  - Список активных ролей
  - История ролей

- [ ] **16.3.2** Форма назначения роли
  - Select роли из role matrix
  - Effective from date
  - Reason

#### 16.4 Reporting Tab

- [ ] **16.4.1** Визуализация reporting relationships
  ```typescript
  // Mini org-chart показывающий:
  // - Кому подчиняется (вверх)
  // - Кто подчиняется (вниз)
  // - Типы линий (direct/functional/dotted)
  ```

- [ ] **16.4.2** Форма создания reporting relationship

#### 16.5 Transfer Form

- [ ] **16.5.1** Создать `TransferEmployeeForm`
  ```typescript
  // Форма перевода сотрудника:
  // - New department (select)
  // - New position
  // - Effective date
  // - Reason
  ```

**Файлы:**
```
frontend/src/features/ofs/EmployeeProfile.tsx (расширить)
frontend/src/features/ofs/CompetenciesTab.tsx
frontend/src/features/ofs/RolesTab.tsx
frontend/src/features/ofs/ReportingTab.tsx
frontend/src/features/ofs/TransferEmployeeForm.tsx
```

**Статус:** 0% завершено

---

### 17. Role Matrix UI (4 часа) 🔴

- [ ] **17.1** Создать `RoleMatrixList` компонент
  ```typescript
  // Таблица всех ролей
  // Фильтр по департаменту
  // Поиск по названию роли
  ```

- [ ] **17.2** Создать `RoleMatrixForm` компонент
  ```typescript
  // Форма создания/редактирования роли:
  // - Role name
  // - Department
  // - Required competencies (JSON editor or form)
  // - Responsibilities (multi-line input)
  // - Salary range
  ```

- [ ] **17.3** Создать `RoleMatrixDetails` компонент
  ```typescript
  // Детали роли:
  // - Требуемые компетенции (chart)
  // - Обязанности (list)
  // - Текущие сотрудники с этой ролью
  // - Gap analysis (кто соответствует, кто нет)
  ```

**Файлы:**
```
frontend/src/features/ofs/RoleMatrixList.tsx
frontend/src/features/ofs/RoleMatrixForm.tsx
frontend/src/features/ofs/RoleMatrixDetails.tsx
```

**Статус:** 0% завершено

---

### 18. History & Audit UI (3 часа) 🔴

- [ ] **18.1** Создать `HistoryLog` компонент
  ```typescript
  // Лог изменений:
  // - Timeline view
  // - Фильтры (entity type, action, date range, user)
  // - Diff view (показать что изменилось)
  ```

- [ ] **18.2** Diff viewer
  ```typescript
  // Визуальное сравнение old_data vs new_data
  // Highlight изменений
  ```

- [ ] **18.3** Экспорт истории
  ```typescript
  // Кнопка "Export to CSV/Excel"
  ```

**Файл:**
```
frontend/src/features/ofs/HistoryLog.tsx
frontend/src/features/ofs/DiffViewer.tsx
```

**Статус:** 0% завершено

---

### 19. Analytics Dashboards (6 часов) 🔴

- [ ] **19.1** Создать `StructureDashboard` компонент
  ```typescript
  // KPI cards:
  // - Total departments
  // - Total employees
  // - Average department size
  // - Hierarchy depth
  
  // Charts:
  // - Departments by level (bar chart)
  // - Headcount by department (pie chart)
  // - Hierarchy visualization (tree map)
  ```

- [ ] **19.2** Создать `DepartmentDashboard` компонент
  ```typescript
  // Дашборд конкретного департамента:
  // - Headcount trend (line chart)
  // - Position breakdown (pie chart)
  // - Tenure distribution (histogram)
  // - Competency coverage (radar chart)
  ```

- [ ] **19.3** Создать `CompetencyGapDashboard`
  ```typescript
  // Gap analysis visualization:
  // - Required vs actual competencies (grouped bar chart)
  // - Training recommendations
  // - High-priority gaps
  ```

- [ ] **19.4** Установить chart библиотеку
  ```bash
  npm install recharts
  # или
  npm install chart.js react-chartjs-2
  ```

**Файлы:**
```
frontend/src/features/ofs/StructureDashboard.tsx
frontend/src/features/ofs/DepartmentDashboard.tsx
frontend/src/features/ofs/CompetencyGapDashboard.tsx
```

**Статус:** 0% завершено

---

### 20. Export UI (2 часа) 🔴

- [ ] **20.1** Создать `ExportDialog` компонент
  ```typescript
  // Modal для экспорта:
  // - Format selection (PDF/Excel/Markdown)
  // - Options:
  //   - Include photos
  //   - Include contacts
  //   - Department scope
  // - Export button
  ```

- [ ] **20.2** Показывать progress при генерации
  ```typescript
  // Loading indicator
  // Progress bar (если API поддерживает)
  ```

- [ ] **20.3** Download link после генерации
  ```typescript
  // Показать ссылку на скачивание
  // Автоматический download
  ```

**Файл:**
```
frontend/src/features/ofs/ExportDialog.tsx
```

**Статус:** 0% завершено

---

### 21. Pages & Routing (3 часа) 🔴

- [ ] **21.1** Создать `/ofs` страницу (главная)
  ```typescript
  // Tabs:
  // - Org Chart
  // - Departments
  // - Employees
  // - Role Matrix
  // - History
  // - Analytics
  ```

- [ ] **21.2** Создать `/ofs/org-chart` страницу
  - OrgChart компонент
  - Toolbar (zoom, search, export)

- [ ] **21.3** Создать `/ofs/departments` страницу
  - DepartmentList
  - Create button

- [ ] **21.3** Создать `/ofs/departments/:id` страницу
  - DepartmentDetails

- [ ] **21.4** Создать `/ofs/role-matrix` страницу
  - RoleMatrixList

- [ ] **21.5** Создать `/ofs/analytics` страницу
  - StructureDashboard

- [ ] **21.6** Настроить роутинг в `App.tsx`

**Файлы:**
```
frontend/src/pages/OFS/OFSPage.tsx
frontend/src/pages/OFS/OrgChartPage.tsx
frontend/src/pages/OFS/DepartmentsPage.tsx
frontend/src/pages/OFS/DepartmentDetailsPage.tsx
frontend/src/pages/OFS/RoleMatrixPage.tsx
frontend/src/pages/OFS/AnalyticsPage.tsx
```

**Статус:** 0% завершено

---

## ✅ ТЕСТИРОВАНИЕ

### 22. Backend Unit Tests (10 часов) 🔴

- [ ] **22.1** Тесты для `OFSDepartmentService`
  - CRUD операции
  - Move department (с проверкой циклов)
  - Hierarchy calculation
  - Soft delete

- [ ] **22.2** Тесты для `RoleMatrixService`
  - CRUD ролей
  - Assign/unassign роли
  - Competency match calculation

- [ ] **22.3** Тесты для `ReportingService`
  - Создание reporting relationships
  - Проверка циклических зависимостей
  - Org chart generation

- [ ] **22.4** Тесты для `OFSHistoryService`
  - Логирование изменений
  - Фильтрация истории
  - Diff calculation

- [ ] **22.5** Тесты для `OFSExportService`
  - PDF generation
  - Excel generation
  - Markdown generation

- [ ] **22.6** Тесты для `OFSAnalyticsService`
  - Statistics calculation
  - Gap analysis
  - Turnover calculation

**Coverage target:** >80%

**Статус:** 0% завершено

---

### 23. Integration Tests (8 часов) 🔴

- [ ] **23.1** E2E: Create department → Assign head → Add employees
- [ ] **23.2** E2E: Move department → Verify hierarchy updated
- [ ] **23.3** E2E: Create role → Assign to employee → Check competency match
- [ ] **23.4** E2E: Transfer employee → Verify history logged
- [ ] **23.5** E2E: Create reporting relationship → Verify in org chart
- [ ] **23.6** E2E: Export org chart to PDF → Verify file created
- [ ] **23.7** E2E: Get analytics → Verify calculations

**Статус:** 0% завершено

---

### 24. Frontend Tests (6 часов) 🔴

- [ ] **24.1** Component tests
  - OrgChart rendering
  - DepartmentForm validation
  - EmployeeProfile tabs

- [ ] **24.2** Redux slice tests
  - Actions
  - Reducers
  - Selectors

- [ ] **24.3** RTK Query tests
  - API endpoints
  - Cache invalidation

**Статус:** 0% завершено

---

## ✅ ДОКУМЕНТАЦИЯ

### 25. API Documentation (3 часа) 🔴

- [ ] **25.1** OpenAPI спецификация
  - Все endpoints с examples
  - Request/Response schemas

- [ ] **25.2** Postman collection
  - Все endpoints
  - Environment variables

- [ ] **25.3** Developer guide
  - Как использовать API
  - Примеры запросов

**Статус:** 0% завершено

---

## ✅ ДЕПЛОЙ

### 26. Environment Setup (2 часа) 🔴

- [ ] **26.1** Environment variables
  ```bash
  EXPORT_STORAGE_PATH=/var/ofs/exports
  EXPORT_URL_BASE=https://storage.matrixgin.ru/ofs
  PDF_GENERATION_TIMEOUT=30000
  ```

- [ ] **26.2** S3/Storage для экспортов
  - Bucket для PDF/Excel файлов
  - Lifecycle rules (автоудаление через 7 дней)

**Статус:** 0% завершено

---

### 27. Мониторинг (2 часа) 🔴

- [ ] **27.1** Метрики:
  - Количество департаментов
  - Количество сотрудников
  - Частота изменений структуры
  - Export requests per day
  - Org chart load time

- [ ] **27.2** Алерты:
  - Org chart load time >5 секунд
  - Export failed
  - Циклическая зависимость создана

**Статус:** 0% завершено

---

## 📊 DEFINITION OF DONE

- [ ] ✅ Все CRUD операции для департаментов работают
- [ ] ✅ Org-chart визуализация работает (drag & drop)
- [ ] ✅ Role matrix система работает
- [ ] ✅ История изменений логируется полностью
- [ ] ✅ Экспорт в PDF/Excel/Markdown работает
- [ ] ✅ Reporting relationships работают
- [ ] ✅ Аналитические дашборды отображаются
- [ ] ✅ RBAC права настроены (только HR/Admin редактируют)
- [ ] ✅ Unit tests coverage >80%
- [ ] ✅ Integration tests проходят
- [ ] ✅ Frontend полностью функционален
- [ ] ✅ Product Owner принял модуль

---

## 📈 ПРОГРЕСС ПО СЕКЦИЯМ

| Секция | Прогресс | Статус |
|--------|----------|--------|
| Database Schema | 0% | 🔴 |
| Backend Services | 0% | 🔴 |
| Controllers & Routes | 0% | 🔴 |
| Export Functionality | 0% | 🔴 |
| Frontend Components | 0% | 🔴 |
| Org Chart Visualization | 0% | 🔴 |
| Testing | 0% | 🔴 |
| Documentation | 0% | 🔴 |
| **ОБЩИЙ ПРОГРЕСС** | **0%** | 🔴 |

---

**Последнее обновление:** 2025-11-23  
**Ответственный:** OFS Module Team Lead  
**Приоритет:** ВЫСОКИЙ (по запросу владельца)  
**Статус:** Ready to start - Готов к началу разработки

---

## 📝 ПРИМЕЧАНИЯ

### Существующая инфраструктура (используется)
- ✅ Таблицы `departments`, `employees` уже существуют
- ✅ Базовые API endpoints для departments существуют
- ✅ RBAC система существует
- ✅ Audit log система существует

### Что нужно добавить
- 🆕 Расширить departments и employees дополнительными полями
- 🆕 Создать 4 новые таблицы (role_competency_matrix, employee_roles, org_structure_history, reporting_relationships)
- 🆕 Создать все OFS-specific сервисы и контроллеры
- 🆕 Создать полноценный frontend с org-chart визуализацией

### Технические особенности
- **ltree** для иерархических запросов (уже используется)
- **JSONB** для хранения компетенций и KPI
- **Soft delete** для безопасного удаления
- **Full audit** всех изменений
