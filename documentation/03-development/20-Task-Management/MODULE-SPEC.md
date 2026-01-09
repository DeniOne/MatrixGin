# Модуль: Task Management (Умное управление задачами)

**Приоритет:** КРИТИЧНЫЙ (MVP Phase 1)  
**Срок:** Недели 3-4  
**Команда:** 1 Backend + 1 Frontend разработчик

---

## 📋 ОПИСАНИЕ

Интеллектуальная система управления задачами с NLP-парсингом, автоназначением по МДР (Матрице Делегирования Ролей) и системой волонтерства.

### Основные функции

✅ **Smart Task Creation:**
- NLP парсинг текста задачи ("Проверить принтеры на Мира завтра")
- Автоматическое извлечение: действие, объект, локация, дедлайн
- Создание структурированной задачи

✅ **Auto-Assignment:**
- Назначение по МДР (Матрица Делегирования Ролей)
- Автоматический подбор ответственного
- Fallback на систему волонтерства

✅ **Mini-Democracy System:**
- Задачи доступные для волонтерства
- Подбор по навыкам и загрузке
- Начисление MC за волонтерство (+50 MC)

✅ **Workflow Management:**
- Статусы: Pending, In Progress, Review, Done, Cancelled
- Комментарии и обсуждения
- История изменений
- Уведомления (Telegram, Email, Push)

---

## 🗄️ БАЗА ДАННЫХ

### Таблицы

```sql
-- Задачи
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    
    -- Назначение
    creator_id UUID REFERENCES users(id),
    assignee_id UUID,
    department_id UUID REFERENCES departments(id),
    
    -- Локация и время
    location VARCHAR(255),
    deadline TIMESTAMPTZ,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    
    -- Волонтерство
    is_volunteer_opportunity BOOLEAN DEFAULT false,
    volunteer_reward_mc INTEGER DEFAULT 50,
    
    -- NLP метаданные
    parsed_action VARCHAR(100),
    parsed_object VARCHAR(100),
    parsed_location VARCHAR(100),
    
    -- Timestamps
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Комментарии к задачам
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- История задач
CREATE TABLE task_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- created, assigned, status_changed, completed
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Теги задач
CREATE TABLE task_tags (
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (task_id, tag)
);

-- Индексы
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_creator ON tasks(creator_id);
CREATE INDEX idx_tasks_department ON tasks(department_id);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_volunteer ON tasks(is_volunteer_opportunity) WHERE is_volunteer_opportunity = true;
```

---

## 🔌 API ENDPOINTS

### 1. GET `/api/tasks`
Список всех задач с фильтрацией

**Query Parameters:**
```
?status=pending,in_progress
&assignee_id=uuid-123
&department_id=uuid-456
&priority=high,critical
&page=1
&limit=20
&sort=deadline
&order=asc
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "task-uuid-1",
      "title": "Проверить принтеры на филиале Мира",
      "description": "Провести диагностику всех принтеров",
      "status": "pending",
      "priority": "high",
      "creator": {
        "id": "user-1",
        "name": "Иван Иванов"
      },
      "assignee": {
        "id": "user-2",
        "name": "Петр Петров"
      },
      "location": "Филиал Мира",
      "deadline": "2025-11-23T18:00:00Z",
      "estimatedHours": 2,
      "createdAt": "2025-11-22T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### 2. GET `/api/tasks/{id}`
Детали конкретной задачи

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "task-uuid-1",
    "title": "Проверить принтеры на филиале Мира",
    "description": "Провести диагностику всех принтеров...",
    "status": "in_progress",
    "priority": "high",
    "creator": { "id": "user-1", "name": "Иван Иванов" },
    "assignee": { "id": "user-2", "name": "Петр Петров" },
    "department": { "id": "dept-1", "name": "Производство" },
    "location": "Филиал Мира",
    "deadline": "2025-11-23T18:00:00Z",
    "estimatedHours": 2,
    "actualHours": 1.5,
    "tags": ["техника", "срочно"],
    "comments": [
      {
        "id": "comment-1",
        "user": { "name": "Петр Петров" },
        "content": "Начал проверку, 2 из 5 принтеров в порядке",
        "createdAt": "2025-11-22T14:00:00Z"
      }
    ],
    "history": [
      {
        "action": "created",
        "user": { "name": "Иван Иванов" },
        "timestamp": "2025-11-22T10:00:00Z"
      },
      {
        "action": "status_changed",
        "oldValue": "pending",
        "newValue": "in_progress",
        "user": { "name": "Петр Петров" },
        "timestamp": "2025-11-22T13:00:00Z"
      }
    ]
  }
}
```

### 3. POST `/api/tasks`
Создать новую задачу (структурированная)

**Request:**
```json
{
  "title": "Проверить принтеры на филиале Мира",
  "description": "Провести диагностику всех принтеров",
  "assigneeId": "user-uuid-2",
  "departmentId": "dept-uuid-1",
  "priority": "high",
  "location": "Филиал Мира",
  "deadline": "2025-11-23T18:00:00Z",
  "estimatedHours": 2,
  "tags": ["техника", "срочно"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "task-uuid-new",
    "title": "Проверить принтеры на филиале Мира",
    "status": "pending",
    "createdAt": "2025-11-22T10:00:00Z"
  }
}
```

### 4. POST `/api/tasks/natural-language`
Создать задачу из текста (NLP)

**Request:**
```json
{
  "text": "Проверить принтеры на Мира завтра до 18:00"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "task-uuid-new",
    "title": "Проверить принтеры",
    "parsed": {
      "action": "проверить",
      "object": "принтеры",
      "location": "Филиал Мира",
      "deadline": "2025-11-23T18:00:00Z"
    },
    "assignee": {
      "id": "user-auto",
      "name": "Автоназначен по МДР",
      "reason": "Технический специалист филиала Мира"
    }
  }
}
```

### 5. POST `/api/tasks/{id}/assign`
Назначить задачу

**Request:**
```json
{
  "assigneeId": "user-uuid-3",
  "reason": "Наиболее подходящий специалист"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task assigned successfully"
}
```

### 6. POST `/api/tasks/{id}/complete`
Отметить задачу как выполненную

**Request:**
```json
{
  "actualHours": 2.5,
  "notes": "Все принтеры проверены, 1 требует ремонта"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "done",
    "completedAt": "2025-11-22T16:30:00Z",
    "mcRewarded": 100
  }
}
```

### 7. POST `/api/tasks/{id}/comment`
Добавить комментарий

**Request:**
```json
{
  "content": "Начал проверку, уже 2 из 5 принтеров в порядке"
}
```

### 8. GET `/api/tasks/volunteer-opportunities`
Задачи для волонтерства

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "task-volunteer-1",
      "title": "Разработать регламент обслуживания техники",
      "priority": "medium",
      "estimatedHours": 3,
      "rewardMC": 150,
      "tags": ["документация", "техника"],
      "matchScore": 0.85,
      "matchReason": "Соответствует вашим навыкам: техника, документация"
    }
  ]
}
```

### 9. POST `/api/tasks/{id}/volunteer`
Взять задачу волонтером

**Response (200):**
```json
{
  "success": true,
  "message": "You are now assigned to this task",
  "reward": {
    "mc": 50,
    "message": "+50 MC за волонтерство!"
  }
}
```

### 10. PUT `/api/tasks/{id}`
Обновить задачу

**Request:**
```json
{
  "title": "Обновленное название",
  "priority": "critical",
  "deadline": "2025-11-24T12:00:00Z"
}
```

### 11. DELETE `/api/tasks/{id}`
Удалить задачу (soft delete)

**Response (200):**
```json
{
  "success": true,
  "message": "Task cancelled successfully"
}
```

---

## 🛠️ ТЕХНОЛОГИЧЕСКИЙ СТЕК

### Backend
- **Nest.js** - фреймворк
- **Prisma ORM** - работа с БД
- **BullMQ** - очереди задач для NLP обработки
- **Qwen 2.5 72B** (локально) - NLP парсинг
- **Socket.io** - real-time уведомления

### Frontend
- **React 18** - UI
- **Redux Toolkit** - state management
- **RTK Query** - API
- **React DnD** - drag&drop для Kanban доски
- **React Hook Form** - формы

---

## 🧠 NLP ПАРСИНГ

### Входной текст
```
"Проверить принтеры на Мира завтра до 18:00"
```

### Извлекаемые сущности

1. **Действие (Action):**
   - Паттерны: глаголы (проверить, исправить, создать, обновить)
   - Результат: "проверить"

2. **Объект (Object):**
   - Существительные после действия
   - Результат: "принтеры"

3. **Локация (Location):**
   - Названия филиалов, адреса
   - Фразы с "на", "в"
   - Результат: "Филиал Мира"

4. **Дедлайн (Deadline):**
   - Временные выражения: "завтра", "через 2 дня", "к 15:00"
   - Абсолютные даты: "23.11.2025"
   - Результат: "2025-11-23 18:00:00"

5. **Приоритет (Priority):**
   - Ключевые слова: "срочно" → high, "критично" → critical
   - По умолчанию: medium

### Промпт для LLM
```typescript
const NLP_TASK_PROMPT = `
Извлеки из текста задачи следующие сущности:
1. action - что нужно сделать (глагол)
2. object - с чем работать (объект)
3. location - где выполнить (филиал/адрес)
4. deadline - когда сделать (дата и время)
5. priority - уровень приоритета (low/medium/high/critical)

Текст задачи: "{task_text}"

Верни JSON:
{
  "action": "...",
  "object": "...",
  "location": "...",
  "deadline": "YYYY-MM-DDTHH:MM:SSZ",
  "priority": "medium"
}
`;
```

---

## 📋 МАТРИЦА ДЕЛЕГИРОВАНИЯ РОЛЕЙ (МДР)

### Логика автоназначения

```typescript
interface TaskAssignmentRule {
  action: string;
  object: string;
  location?: string;
  department: string;
  role: string;
  skills?: string[];
}

const MDR: TaskAssignmentRule[] = [
  {
    action: "проверить",
    object: "принтеры",
    department: "Производство",
    role: "Технический специалист",
    skills: ["техника", "диагностика"]
  },
  {
    action: "обновить",
    object: "документация",
    department: "Развитие",
    role: "Методист"
  },
  // ... другие правила
];

function autoAssignTask(task: Task): User | null {
  // 1. Поиск правила в МДР
  const rule = MDR.find(r => 
    r.action === task.parsedAction &&
    r.object === task.parsedObject
  );
  
  if (!rule) return null;
  
  // 2. Поиск пользователя
  const candidates = findUsersByDepartmentAndRole(
    rule.department,
    rule.role
  );
  
  // 3. Фильтрация по локации (если указана)
  if (task.location) {
    candidates = candidates.filter(
      u => u.location === task.location
    );
  }
  
  // 4. Фильтрация по навыкам
  if (rule.skills) {
    candidates = candidates.filter(
      u => hasAllSkills(u, rule.skills)
    );
  }
  
  // 5. Выбор наименее загруженного
  return candidates.sort(
    (a, b) => a.currentTaskCount - b.currentTaskCount
  )[0];
}
```

---

## 🎯 СИСТЕМА ВОЛОНТЕРСТВА

### Логика подбора

```typescript
interface VolunteerMatch {
  task: Task;
  user: User;
  score: number;
  reasons: string[];
}

function matchVolunteerTasks(user: User): VolunteerMatch[] {
  const availableTasks = tasks.filter(
    t => t.isVolunteerOpportunity && !t.assigneeId
  );
  
  return availableTasks.map(task => {
    let score = 0;
    const reasons = [];
    
    // Совпадение по навыкам
    const skillMatch = intersection(user.skills, task.tags);
    if (skillMatch.length > 0) {
      score += skillMatch.length * 0.3;
      reasons.push(`Навыки: ${skillMatch.join(', ')}`);
    }
    
    // Совпадение по локации
    if (user.location === task.location) {
      score += 0.2;
      reasons.push('Ваш филиал');
    }
    
    // Низкая загрузка
    if (user.currentTaskCount < 3) {
      score += 0.2;
      reasons.push('У вас мало активных задач');
    }
    
    // Приоритет задачи
    if (task.priority === 'high') score += 0.15;
    if (task.priority === 'critical') score += 0.3;
    
    return { task, user, score, reasons };
  }).sort((a, b) => b.score - a.score);
}
```

---

## 📊 МЕТРИКИ УСПЕХА

- [ ] 90%+ задач создаются без ошибок
- [ ] NLP точность парсинга >85%
- [ ] Автоназначение работает в 70%+ случаев
- [ ] Средняя скорость выполнения задачи <24 часа
- [ ] Real-time уведомления доставляются за <2 секунды
- [ ] Покрытие тестами >80%

---

## 🧪 ТЕСТИРОВАНИЕ

### Unit Tests
- ✅ NLP парсинг различных форматов
- ✅ МДР автоназначение
- ✅ Волонтерство matching
- ✅ Task CRUD операции
- ✅ Комментарии и история

### Integration Tests
- ✅ E2E: Создание задачи через NLP → Автоназначение → Выполнение
- ✅ E2E: Волонтерство → Начисление MC
- ✅ Real-time уведомления через WebSocket

---

## 📝 ЗАВИСИМОСТИ

### От других модулей
- `02-Authentication-Authorization` - аутентификация пользователей
- `08-Employee-Management` - данные сотрудников для МДР
- `15-MatrixCoin-Economy` - начисление MC за волонтерство
- `21-Telegram-Bot` - уведомления в Telegram

### Используется модулями
- `11-Kaizen-Continuous-Improvement` - улучшения как задачи
- `12-KPI-Analytics` - метрики выполнения задач
