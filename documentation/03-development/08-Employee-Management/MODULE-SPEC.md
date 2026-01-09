# Модуль: Employee Management (Управление сотрудниками)

**Приоритет:** КРИТИЧНЫЙ (MVP Phase 1)  
**Срок:** Недели 3-4  
**Команда:** 1 Backend + 1 Frontend разработчик

---

## 📋 ОПИСАНИЕ

Система управления сотрудниками - основа всей платформы MatrixGin. Включает CRUD операции, организационную структуру, кадровые документы и базовую HR-аналитику.

### Основные функции

✅ **Управление профилями:**
- CRUD операций сотрудников
- Организационная структура (департаменты, подчинение)
- Фотографии и контактная информация
- Telegram интеграция

✅ **HR Документы:**
- Трудовые договоры
- Приказы (о приеме, увольнении)
- Личные карточки Т-2
- Табели учета рабочего времени
- График отпусков

✅ **Базовая аналитика:**
- Стаж работы
- Статус сотрудника (активный, в отпуске, уволен)
- Департаментальная структура
- История изменений

---

## 🗄️ БАЗА ДАННЫХ

### Таблицы

```sql
-- Сотрудники (основная таблица)
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    
    -- Личная информация
    employee_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(10),
    
    -- Контакты
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    telegram_username VARCHAR(100),
    telegram_id BIGINT,
    
    -- Место работы
    department_id UUID REFERENCES departments(id),
    position VARCHAR(255),
    manager_id UUID REFERENCES employees(id),
    location VARCHAR(255),
    
    -- Статус
    status VARCHAR(50) DEFAULT 'active', -- active, vacation, sick_leave, fired
    hire_date DATE NOT NULL,
    termination_date DATE,
    
    -- Дополнительно
    avatar_url TEXT,
    skills TEXT[],
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Департаменты
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES departments(id),
    head_id UUID REFERENCES employees(id),
    description TEXT,
    location VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Кадровые документы
CREATE TABLE employee_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    
    document_type VARCHAR(100) NOT NULL, -- contract, order, t2_card, etc.
    title VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50),
    
    -- Метаданные
    document_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    
    -- Подписи (КЭДО)
    signed_by_employee BOOLEAN DEFAULT false,
    signed_by_hr BOOLEAN DEFAULT false,
    signed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- История изменений сотрудников
CREATE TABLE employee_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    changed_by UUID REFERENCES users(id),
    
    action VARCHAR(50) NOT NULL, -- hired, promoted, transferred, fired
    field_name VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_departments_parent ON departments(parent_id);
CREATE INDEX idx_employee_docs_employee ON employee_documents(employee_id);
CREATE INDEX idx_employee_history_employee ON employee_history(employee_id);
```

---

## 🔌 API ENDPOINTS

### 1. GET `/api/employees`
Список всех сотрудников с фильтрацией

**Query Parameters:**
```
?department_id=uuid-123
&status=active
&position=Фотограф
&page=1
&limit=20
&search=Иван
&sort=hire_date
&order=desc
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "emp-uuid-1",
      "employeeNumber": "EMP-001",
      "firstName": "Иван",
      "lastName": "Иванов",
      "middleName": "Петрович",
      "email": "ivan@photomatrix.ru",
      "phone": "+79001234567",
      "department": {
        "id": "dept-1",
        "name": "Производство"
      },
      "position": "Фотограф",
      "manager": {
        "id": "mgr-1",
        "name": "Петр Петров"
      },
      "status": "active",
      "hireDate": "2024-01-15",
      "avatarUrl": "https://storage.../avatar.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

### 2. GET `/api/employees/{id}`
Детали конкретного сотрудника

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "emp-uuid-1",
    "employeeNumber": "EMP-001",
    "firstName": "Иван",
    "lastName": "Иванов",
    "middleName": "Петрович",
    "dateOfBirth": "1990-05-15",
    "gender": "male",
    "email": "ivan@photomatrix.ru",
    "phone": "+79001234567",
    "telegramUsername": "@ivan_photo",
    "department": {
      "id": "dept-1",
      "name": "Производство",
      "location": "Филиал Мира"
    },
    "position": "Фотограф",
    "manager": {
      "id": "mgr-1",
      "name": "Петр Петров",
      "position": "Руководитель производства"
    },
    "status": "active",
    "hireDate": "2024-01-15",
    "tenure": {
      "years": 0,
      "months": 10,
      "days": 7
    },
    "skills": ["фотография", "ретушь", "работа с клиентами"],
    "avatarUrl": "https://storage.../avatar.jpg",
    "statistics": {
      "tasksCompleted": 245,
      "kpiScore": 95.5,
      "mcBalance": 1250,
      "gmcBalance": 50
    }
  }
}
```

### 3. POST `/api/employees`
Создать нового сотрудника (Admin/HR only)

**Request:**
```json
{
  "firstName": "Мария",
  "lastName": "Сидорова",
  "middleName": "Ивановна",
  "dateOfBirth": "1995-08-20",
  "gender": "female",
  "email": "maria@photomatrix.ru",
  "phone": "+79007654321",
  "departmentId": "dept-uuid-2",
  "position": "Администратор",
  "managerId": "mgr-uuid-1",
  "hireDate": "2025-11-25",
  "skills": ["администрирование", "работа с клиентами"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "emp-uuid-new",
    "employeeNumber": "EMP-157",
    "firstName": "Мария",
    "lastName": "Сидорова",
    "status": "active",
    "createdAt": "2025-11-22T10:00:00Z"
  }
}
```

### 4. PUT `/api/employees/{id}`
Обновить данные сотрудника

**Request:**
```json
{
  "position": "Старший фотограф",
  "departmentId": "dept-uuid-3",
  "skills": ["фотография", "ретушь", "обучение новичков"]
}
```

### 5. DELETE `/api/employees/{id}`
Уволить сотрудника (soft delete)

**Request:**
```json
{
  "terminationDate": "2025-12-31",
  "reason": "По собственному желанию"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Employee terminated successfully",
  "data": {
    "status": "fired",
    "terminationDate": "2025-12-31"
  }
}
```

### 6. GET `/api/employees/{id}/analytics`
HR-аналитика сотрудника

**Response (200):**
```json
{
  "success": true,
  "data": {
    "employeeId": "emp-1",
    "tenure": {
      "years": 1,
      "months": 5,
      "days": 12
    },
    "performance": {
      "tasksCompleted": 245,
      "tasksOnTime": 220,
      "onTimeRate": 89.8,
      "avgTaskCompletionDays": 2.5
    },
    "kpi": {
      "current": 95.5,
      "target": 100,
      "trend": "improving"
    },
    "economy": {
      "mcEarned": 2450,
      "mcSpent": 1200,
      "mcBalance": 1250,
      "gmcBalance": 50
    },
    "attendance": {
      "workDays": 250,
      "sickDays": 5,
      "vacationDays": 15
    }
  }
}
```

### 7. GET `/api/employees/{id}/documents`
Кадровые документы сотрудника

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "doc-1",
      "type": "contract",
      "title": "Трудовой договор №123",
      "documentNumber": "TD-123-2024",
      "issueDate": "2024-01-15",
      "status": "active",
      "signedByEmployee": true,
      "signedByHr": true,
      "fileUrl": "https://storage.../contract.pdf"
    },
    {
      "id": "doc-2",
      "type": "t2_card",
      "title": "Личная карточка Т-2",
      "issueDate": "2024-01-15",
      "status": "active",
      "fileUrl": "https://storage.../t2_card.pdf"
    }
  ]
}
```

### 8. POST `/api/employees/{id}/documents`
Загрузить документ (multipart/form-data)

**Request:**
```
Form Data:
- file: [PDF file]
- documentType: "contract"
- title: "Трудовой договор №456"
- documentNumber: "TD-456-2025"
- issueDate: "2025-11-22"
```

### 9. GET `/api/departments`
Список департаментов с иерархией

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "dept-1",
      "name": "Производство",
      "head": {
        "id": "emp-1",
        "name": "Петр Петров"
      },
      "employeeCount": 45,
      "children": [
        {
          "id": "dept-1-1",
          "name": "Филиал Мира",
          "employeeCount": 15
        },
        {
          "id": "dept-1-2",
          "name": "Филиал Центр",
          "employeeCount": 30
        }
      ]
    }
  ]
}
```

### 10. GET `/api/departments/{id}/employees`
Сотрудники департамента

---

## 🛠️ ТЕХНОЛОГИЧЕСКИЙ СТЕК

### Backend
- **Nest.js** - framework ✅
- **Prisma ORM** - БД ✅
- **Multer** - загрузка файлов
- **Sharp** - обработка изображений (аватары)
- **MinIO/S3** - хранение документов

### Frontend
- **React 18** ✅
- **Redux Toolkit** ✅
- **React Hook Form** - формы
- **React Table** - таблицы сотрудников
- **Drag & Drop** - организационная диаграмма

---

## 📊 МЕТРИКИ УСПЕХА

- [ ] 100% сотрудников загружены в систему
- [ ] CRUD операции работают без ошибок
- [ ] Организационная структура корректно отображается
- [ ] Документы загружаются и хранятся безопасно
- [ ] Покрытие тестами >80%
- [ ] Response time <300ms

---

## 🧪 ТЕСТИРОВАНИЕ

### Unit Tests
- ✅ CRUD операции сотрудников
- ✅ Валидация данных (email, phone, дата рождения)
- ✅ Расчет стажа
- ✅ Иерархия департаментов

### Integration Tests
- ✅ E2E: Создание сотрудника → Назначение в департамент → Загрузка документа
- ✅ E2E: Изменение статуса → Увольнение
- ✅ Организационная структура

---

## 📝 ЗАВИСИМОСТИ

### От других модулей
- `02-Authentication-Authorization` - user accounts
- `13-Legal-Compliance` - согласия на обработку ПДн

### Используется модулями
- `20-Task-Management` - назначение задач
- `12-KPI-Analytics` - KPI сотрудников
- `10-HR-Analytics-Matrix360` - HR аналитика
- `07-Emotional-Analytics` - мониторинг настроения

---

## 🔐 БЕЗОПАСНОСТЬ

### RBAC Permissions
- **Просмотр:** Employee+ (свой профиль), Manager+ (своего отдела), HR/Admin (все)
- **Редактирование:** HR/Admin only
- **Увольнение:** Admin only
- **Документы:** HR/Admin (загрузка), Employee+ (просмотр своих)

### 152-ФЗ Compliance
- ✅ Согласие на обработку ПДн при приеме
- ✅ Хранение данных на серверах РФ
- ✅ Шифрование персональных данных
- ✅ Audit log всех операций
- ✅ Право на удаление данных (GDPR-like)
