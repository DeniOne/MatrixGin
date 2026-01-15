# Модуль: Corporate University (Корпоративный Университет)

**Приоритет:** POST-MVP  
**Срок:** Phase 2  
**Команда:** 2 Backend + 1 Frontend + 1 Content Designer

---

## 📋 ОПИСАНИЕ

Гибридная система развития персонала с Academy Model, LXP платформой, Институтом Обучающих (Trainers) и двойной валютой мотивации (MC/GMC).

> [!IMPORTANT]
> **Требование к локализации:** Все элементы пользовательского интерфейса (надписи, кнопки, уведомления, сообщения об ошибках, плейсхолдеры, подсказки) ДОЛЖНЫ быть на русском языке. Это обязательное требование для всех компонентов модуля.

### Основные функции

✅ **7 Академий (Academy Model):**
- PhotoCraft, Sales Excellence, Service & Care, Values & Culture, Soft Skills, Equipment & Tech, Leadership & Management

✅ **LXP (Learning Experience Platform):**
- AI-тегирование контента
- Персональные рекомендации
- Skill Gap Analysis
- Adaptive Learning Paths

✅ **Институт Обучающих (Trainer Institute):**
- 3 специализации: Photographer, Sales, Designer
- Система аккредитации и сертификации
- 5 статусов Trainers
- Координатор Института

✅ **Dual-Track Grading:**
- Профессиональный трек (5 уровней: Стажёр → Мастер)
- Trainer трек (Junior Trainer → Senior Trainer)

✅ **Content Incubator:**
- Kanban процесс (Research → Publish)
- AI-генерация черновиков
- Версионирование

✅ **Интеграции:**
- KPI Analytics, Employee Management, MatrixCoin Economy, Task Management, Telegram Bot

---

## 🗄️ БАЗА ДАННЫХ

### Таблицы

```sql
-- Академии
CREATE TABLE academies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Навыки (Skills Matrix)
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academy_id UUID REFERENCES academies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- hard, soft, technical
    level_required VARCHAR(50), -- A0, A1, B1, B2, C1, C2
    kpi_impact VARCHAR(100), -- какой KPI улучшает
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Библиотека материалов
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL, -- video, text, pdf, quiz, simulation
    title VARCHAR(255) NOT NULL,
    content_url TEXT,
    content_text TEXT,
    duration_minutes INTEGER,
    
    -- Метаданные
    tags JSONB, -- AI-теги
    level VARCHAR(10), -- A0-C2
    academy_id UUID REFERENCES academies(id),
    
    version INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'draft', -- draft, review, published
    
    created_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Курсы
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academy_id UUID REFERENCES academies(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    required_grade VARCHAR(50), -- стажёр, специалист и т.д.
    reward_mc INTEGER DEFAULT 0,
    reward_gmc INTEGER DEFAULT 0,
    
    is_mandatory BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Модули курса
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id),
    
    module_order INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Навыки пользователя
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id),
    
    level INTEGER DEFAULT 0, -- 0-100
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, skill_id)
);

-- Грейды пользователя
CREATE TABLE user_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    
    current_grade VARCHAR(50) NOT NULL DEFAULT 'стажёр',
    motivation_coefficient DECIMAL(3,2) DEFAULT 0.8,
    
    -- История грейдов
    grade_history JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Записи на курсы (Enrollments)
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id),
    
    progress INTEGER DEFAULT 0, -- %
    status VARCHAR(50) DEFAULT 'active', -- active, completed, abandoned
    
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    assigned_by UUID REFERENCES users(id), -- кто назначил
    
    UNIQUE(user_id, course_id)
);

-- Прогресс по модулям
CREATE TABLE module_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    module_id UUID REFERENCES course_modules(id),
    
    status VARCHAR(50) DEFAULT 'not_started', -- not_started, in_progress, completed
    score INTEGER, -- для тестов
    
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- Сертификаты
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    academy_id UUID REFERENCES academies(id),
    
    level VARCHAR(50), -- грейд на момент получения
    score INTEGER, -- итоговый балл
    
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ, -- для периодических подтверждений
    
    certificate_url TEXT -- PDF сертификата
);

-- Индивидуальные планы развития (IDP)
CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    
    title VARCHAR(255),
    courses_planned JSONB, -- массив course_id
    skills_target JSONB, -- целевые навыки
    
    ai_generated BOOLEAN DEFAULT false,
    ai_rules JSONB, -- правила генерации
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- === TRAINER INSTITUTE ===

-- Обучающие (Trainers)
CREATE TABLE trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    
    specialty VARCHAR(50) NOT NULL, -- photographer, sales, designer
    status VARCHAR(50) DEFAULT 'candidate', -- candidate, обучающий, аккредитованный, старший, методист
    
    accreditation_date TIMESTAMPTZ,
    rating DECIMAL(3,2), -- 0.00 - 5.00
    
    -- Статистика
    trainees_total INTEGER DEFAULT 0,
    trainees_successful INTEGER DEFAULT 0,
    avg_nps DECIMAL(3,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Назначения Trainer -> Стажёр
CREATE TABLE trainer_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID REFERENCES trainers(id),
    trainee_id UUID REFERENCES users(id),
    
    start_date DATE NOT NULL,
    end_date DATE,
    
    status VARCHAR(50) DEFAULT 'active', -- active, completed, cancelled
    plan JSONB, -- индивидуальный план на 4 смены
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Результаты обучения
CREATE TABLE training_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES trainer_assignments(id) ON DELETE CASCADE,
    
    kpi_improvement INTEGER, -- % улучшения KPI
    nps_score INTEGER, -- оценка стажёра
    retention_days INTEGER, -- сколько дней удержан
    
    hot_leads_percentage INTEGER, -- % горячих лидов
    quality_score INTEGER, -- оценка качества работы
    
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_materials_academy ON materials(academy_id);
CREATE INDEX idx_materials_status ON materials(status);
CREATE INDEX idx_courses_academy ON courses(academy_id);
CREATE INDEX idx_course_modules_course ON course_modules(course_id);
CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill ON user_skills(skill_id);
CREATE INDEX idx_user_grades_user ON user_grades(user_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_certifications_user ON certifications(user_id);
CREATE INDEX idx_learning_paths_user ON learning_paths(user_id);
CREATE INDEX idx_trainers_user ON trainers(user_id);
CREATE INDEX idx_trainers_specialty ON trainers(specialty);
CREATE INDEX idx_trainer_assignments_trainer ON trainer_assignments(trainer_id);
CREATE INDEX idx_trainer_assignments_trainee ON trainer_assignments(trainee_id);
CREATE INDEX idx_training_results_assignment ON training_results(assignment_id);
```

---

## 🔌 API ENDPOINTS

### Academy Endpoints

#### GET `/api/university/academies`
Список академий

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "academy-1",
      "name": "PhotoCraft Academy",
      "description": "Техника съемки, свет, композиция",
      "iconUrl": "https://storage.../photocraft.svg",
      "coursesCount": 12,
      "skillsCount": 25
    }
  ]
}
```

#### GET `/api/university/academies/{id}`
Детали академии с курсами

---

### Materials & Content Endpoints

#### GET `/api/university/materials`
Библиотека материалов (с фильтрами)

**Query:**
```
?academyId=uuid
&type=video,text
&level=B1
&tags=["фотография", "свет"]
&status=published
&page=1
&limit=20
```

#### POST `/api/university/materials`
Создать материал (Content Incubator)

**Request:**
```json
{
  "type": "video",
  "title": "Основы работы со светом",
  "contentUrl": "https://storage.../lesson-1.mp4",
  "durationMinutes": 15,
  "academyId": "academy-1",
  "level": "A1",
  "tags": ["свет", "основы", "фотография"]
}
```

#### PUT `/api/university/materials/{id}/status`
Изменить статус (draft → review → published)

---

### Course Endpoints

#### GET `/api/university/courses`
Список курсов

**Query:**
```
?academyId=uuid
&requiredGrade=специалист
&isMandatory=true
```

#### GET `/api/university/courses/{id}`
Детали курса с модулями

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "course-1",
    "title": "Основы фотографии",
    "description": "Курс для стажёров",
    "academy": {
      "id": "academy-1",
      "name": "PhotoCraft Academy"
    },
    "modules": [
      {
        "id": "module-1",
        "order": 1,
        "material": {
          "id": "material-1",
          "type": "video",
          "title": "Введение в фотографию",
          "durationMinutes": 10
        },
        "isRequired": true
      }
    ],
    "requiredGrade": "стажёр",
    "rewardMC": 10,
    "rewardGMC": 2,
    "totalDuration": 120
  }
}
```

#### POST `/api/university/courses/{id}/enroll`
Записаться на курс

**Response (200):**
```json
{
  "success": true,
  "data": {
    "enrollmentId": "enrollment-1",
    "courseId": "course-1",
    "progress": 0,
    "status": "active"
  }
}
```

#### POST `/api/university/courses/{id}/complete`
Завершить курс (начисление MC/GMC)

---

### Skills Endpoints

#### GET `/api/university/skills`
Список навыков (Skills Matrix)

#### GET `/api/university/skills/my`
Мои навыки

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "skill": {
        "id": "skill-1",
        "name": "Работа со светом",
        "academy": "PhotoCraft",
        "level": "B1"
      },
      "myLevel": 75,
      "verifiedAt": "2025-11-20T10:00:00Z",
      "verifiedBy": {
        "id": "trainer-1",
        "name": "Иван Иванов"
      }
    }
  ]
}
```

#### GET `/api/university/skills/gap-analysis`
Анализ разрывов компетенций

**Response (200):**
```json
{
  "success": true,
  "data": {
    "targetRole": "специалист",
    "currentLevel": 60,
    "missingSkills": [
      {
        "skillId": "skill-5",
        "name": "Продвинутая обработка",
        "currentLevel": 0,
        "requiredLevel": 70,
        "recommendedCourses": ["course-7", "course-8"]
      }
    ]
  }
}
```

---

### Grading Endpoints

#### GET `/api/university/grades/{userId}`
Грейд пользователя

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "user-1",
    "currentGrade": "профессионал",
    "motivationCoefficient": 1.2,
    "history": [
      {
        "grade": "стажёр",
        "from": "2025-01-01",
        "to": "2025-03-01"
      },
      {
        "grade": "специалист",
        "from": "2025-03-01",
        "to": "2025-06-01"
      }
    ],
    "nextGrade": {
      "name": "эксперт",
      "requirements": {
        "kpi": "> 85% (6 смен)",
        "courses": ["course-10", "course-11"],
        "test": "90%"
      }
    }
  }
}
```

#### POST `/api/university/grades/{userId}/upgrade`
Повысить грейд (админ/система)

---

### Enrollment & Progress Endpoints

#### GET `/api/university/my-courses`
Мои курсы

**Response (200):**
```json
{
  "success": true,
  "data": {
    "active": [
      {
        "enrollment": {
          "id": "enrollment-1",
          "progress": 45,
          "enrolledAt": "2025-11-01"
        },
        "course": {
          "id": "course-1",
          "title": "Основы фотографии",
          "academy": "PhotoCraft"
        }
      }
    ],
    "completed": [],
    "abandoned": []
  }
}
```

#### PUT `/api/university/enrollments/{id}/progress`
Обновить прогресс модуля

**Request:**
```json
{
  "moduleId": "module-1",
  "status": "completed",
  "score": 95
}
```

---

### Certification Endpoints

#### GET `/api/university/certifications`
Мои сертификаты

#### POST `/api/university/certifications/issue`
Выдать сертификат (система)

---

### Learning Path (IDP) Endpoints

#### GET `/api/university/idp/{userId}`
Индивидуальный план развития

#### POST `/api/university/idp/{userId}/generate`
Автогенерация IDP (AI)

**Request:**
```json
{
  "targetGrade": "эксперт",
  "careerPath": "фотограф"
}
```

---

### Trainer Institute Endpoints

#### GET `/api/university/trainers`
Список обучающих

**Query:**
```
?specialty=photographer
&status=аккредитованный
&minRating=4.5
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "trainer-1",
      "user": {
        "id": "user-10",
        "name": "Иван Иванов"
      },
      "specialty": "photographer",
      "status": "аккредитованный",
      "rating": 4.8,
      "statistics": {
        "traineesTotal": 15,
        "traineesSuccessful": 13,
        "avgNPS": 4.7
      }
    }
  ]
}
```

#### POST `/api/university/trainers`
Подать заявку на Trainer

**Request:**
```json
{
  "specialty": "photographer"
}
```

#### PUT `/api/university/trainers/{id}/accredit`
Аккредитовать trainer (координатор)

#### GET `/api/university/trainers/{id}/assignments`
Назначения trainer'а

#### POST `/api/university/trainers/assign`
Назначить trainer стажёру

**Request:**
```json
{
  "trainerId": "trainer-1",
  "traineeId": "user-50",
  "startDate": "2025-11-25",
  "plan": {
    "shift1": "Диагностика техники",
    "shift2": "Работа со светом",
    "shift3": "Создание горячих лидов",
    "shift4": "Финальный экзамен"
  }
}
```

#### POST `/api/university/trainers/results`
Зафиксировать результаты обучения

**Request:**
```json
{
  "assignmentId": "assignment-1",
  "kpiImprovement": 25,
  "npsScore": 5,
  "retentionDays": 60,
  "hotLeadsPercentage": 75,
  "qualityScore": 90,
  "notes": "Отличный прогресс"
}
```

```

---

## 🎨 СТРУКТУРА ФРОНТЕНДА

### Общая структура навигации

Корпоративный Университет организован по модели **7 Академий (Факультетов)** + **Институт Обучающих** как горизонтальный сервис, доступный из всех факультетов.

> [!NOTE]
> Каждый пункт ниже указывает: **Route** — описание функционала — **Компонент** — **Роли доступа**

---

### 1️⃣ Факультет Фотомастерства (PhotoCraft Academy)

**Базовый маршрут:** `/photocraft`

#### Страницы:

1. **Дашборд** (`/photocraft`)
   - Обзор прогресса по роли фотографа, актуальные задания, уведомления
   - Компоненты: `PhotoDashboard`, `ProgressWidget`, `NotificationPanel`
   - Доступ: `[Admin, Trainer, Employee]`

2. **Каталог курсов** (`/photocraft/courses`)
   - Список курсов с фильтрами (уровень, навык, длительность)
   - Компоненты: `CourseList`, `CourseFilter`, `CourseCard`
   - Доступ: `[All]`

3. **Страница курса** (`/photocraft/course/:id`)
   - Детали курса: видеоуроки, чек-листы, практики, ресурсы
   - Компоненты: `CoursePlayer`, `LessonSidebar`, `FilesPanel`, `ProgressTracker`
   - Доступ: `[All]`

4. **Практические смены** (`/photocraft/shifts`) 🆕
   - Расписание практических смен, режимы: Демо / Под присмотром / Самостоятельно
   - Компоненты: `ShiftScheduler`, `ShiftCard`, `ShiftModeSelector`
   - Доступ: `[Trainer, Employee]`

5. **Наставническая** (`/photocraft/trainers`)
   - Карточки наставников, назначение наставника, отчёты по стажёрам
   - Компоненты: `TrainerDirectory`, `AssignTrainerModal`, `TraineeReport`
   - Доступ: `[Admin, Manager]`

6. **Диагностика и Аудиты** (`/photocraft/diagnostics`) 🆕
   - Отчёты по ОКК/ЦК/качество/горячие лиды, аудиты смен
   - Компоненты: `DiagnosticsDashboard`, `TrendChart`, `AuditReport`
   - Доступ: `[Trainer, Manager]`

7. **Симуляторы и Сценарии** (`/photocraft/simulators`) 🆕
   - Сценарии работы с разными типами клиентов (дети, пары, семьи)
   - Компоненты: `ScenarioPlayer`, `RoleplayModule`, `ScenarioLibrary`
   - Доступ: `[All]`

8. **Тесты и Сертификация** (`/photocraft/certificates`)
   - Тесты, практические экзамены, статус сертификации Trainer
   - Компоненты: `AssessmentCenter`, `BadgeList`, `CertificateViewer`
   - Доступ: `[All]`

9. **Библиотека ресурсов** (`/photocraft/library`) 🆕
   - Пресеты, чек-листы, гайды (ЗСФ)
   - Компоненты: `ResourceGrid`, `ResourceCard`, `ResourceFilter`
   - Доступ: `[All]`

10. **Аналитика** (`/photocraft/analytics`)
    - KPI влияния обучения → прогноз повышения KPI
    - Компоненты: `LearningImpact`, `KPIForecast`, `CorrelationChart`
    - Доступ: `[Admin, Analytics]`

11. **Сообщество** (`/photocraft/community`) 🆕
    - Разборы, лучшие кадры, баттлы
    - Компоненты: `CommunityFeed`, `PostCard`, `BattleWidget`, `CommentSection`
    - Доступ: `[All]`

12. **Настройки** (`/photocraft/settings`)
    - Критерии адаптации, шаблоны чек-листов
    - Компоненты: `FacultySettings`, `TemplateManager`
    - Доступ: `[Admin, Methodologist]`

---

### 2️⃣ Факультет Продаж и Сервиса (Sales & Service Academy)

**Базовый маршрут:** `/sales`

#### Страницы:

1. **Дашборд** (`/sales`)
   - Лиды, конверсии, скорость обработки, цели
   - Компоненты: `SalesDashboard`, `LeadWidget`, `ConversionChart`
   - Доступ: `[Sales, Manager]`

2. **Плейбуки и Скрипты** (`/sales/playbooks`) 🆕
   - Скрипты, работа с возражениями, шаблоны диалогов
   - Компоненты: `PlaybookList`, `PlaybookViewer`, `ObjectionHandler`
   - Доступ: `[All Sales]`

3. **Микро-уроки** (`/sales/micro`) 🆕
   - Короткие уроки (1–3 мин) для бота / всплывашек
   - Компоненты: `MicroLessonPlayer`, `QuickTip`
   - Доступ: `[All]`

4. **Арена Ролевых Игр** (`/sales/roleplay`) 🆕
   - Симуляторы переговоров с клиентом (голос/чат)
   - Компоненты: `RoleplaySimulator`, `DialogueEngine`, `VoiceRecorder`
   - Доступ: `[Trainer, Sales]`

5. **Индивидуальные Треки** (`/sales/tracks`)
   - Индивидуальные планы развития, KPI-задачи
   - Компоненты: `AssignedPaths`, `TrackCard`, `KPITaskList`
   - Доступ: `[Sales, Manager]`

6. **Тесты и Сертификация** (`/sales/certs`)
   - Тесты по скриптам и сервису, цифровые бейджи
   - Компоненты: `SalesAssessments`, `BadgeCollection`
   - Доступ: `[All]`

7. **Лидерборд** (`/sales/leaderboard`)
   - Конверсии, LTV, горячие лиды
   - Компоненты: `Leaderboard`, `RankingCard`, `FilterPanel`
   - Доступ: `[All]`

8. **Обратная связь и QA** (`/sales/qa`) 🆕
   - Записи звонков/чатов, разборы, пул ошибок
   - Компоненты: `QAInbox`, `CallReview`, `ErrorDatabase`
   - Доступ: `[Trainer, QA]`

9. **Награды и Экономика** (`/sales/rewards`)
   - MC/GMC за продажи, обмены (интеграция)
   - Компоненты: `RewardsPanel`, `CoinBalance`, `ExchangeWidget`
   - Доступ: `[Sales, Finance]`

10. **Календарь** (`/sales/calendar`)
    - Вебинары, тренинги, часы приема
    - Компоненты: `FacultyCalendar`, `EventCard`, `BookingModal`
    - Доступ: `[All]`

---

### 3️⃣ Факультет Корпоративной Культуры (Values & Culture Academy)

**Базовый маршрут:** `/culture`

#### Страницы:

1. **Welcome-трек** (`/culture/welcome`) 🆕
   - Обязательный онбординг, миссия, Конституция компании
   - Компоненты: `WelcomeFlow`, `OnboardingStep`, `MissionVideo`
   - Доступ: `[New hires]`

2. **Библиотека Ценностей** (`/culture/values`)
   - Кейсы, истории, видео от лидеров
   - Компоненты: `ValuesGallery`, `StoryCard`, `LeaderVideo`
   - Доступ: `[All]`

3. **Этика и Комплаенс** (`/culture/compliance`)
   - Политики, тесты, подтверждение ознакомления
   - Компоненты: `PolicyCenter`, `ComplianceTest`, `AcknowledgeButton`
   - Доступ: `[All]`

4. **Командные Воркшопы** (`/culture/workshops`)
   - Тимбилдинги, ретриты, расписание фасилитаторов
   - Компоненты: `WorkshopList`, `WorkshopCard`, `FacilitatorPanel`
   - Доступ: `[HR, Manager]`

5. **Истории Успеха** (`/culture/stories`) 🆕
   - Успехи, кейсы сотрудников, стена признания
   - Компоненты: `StoryBoard`, `RecognitionCard`, `LikeButton`
   - Доступ: `[All]`

6. **Пульс-опросы** (`/culture/surveys`)
   - Быстрые опросы и NPS по культуре
   - Компоненты: `SurveyTool`, `QuickPoll`, `NPSWidget`
   - Доступ: `[HR]`

7. **Гайдлайны Сообщества** (`/culture/guides`)
   - Правила коммуникации, разрешение конфликтов
   - Компоненты: `GuideDocs`, `GuideViewer`
   - Доступ: `[All]`

8. **Метрики Влияния** (`/culture/impact`)
   - Вовлечённость, текучка, влияние на KPI
   - Компоненты: `CultureMetrics`, `EngagementChart`, `TurnoverRate`
   - Доступ: `[HR, Exec]`

---

### 4️⃣ Факультет Личностного Развития (Soft Skills & Personal Development Academy)

**Базовый маршрут:** `/personal`

#### Страницы:

1. **Центр Обучения** (`/personal`)
   - Подборка курсов: Эмоциональный интеллект, тайм-менеджмент, коммуникация
   - Компоненты: `SkillHub`, `CourseRecommendations`, `TopicFilter`
   - Доступ: `[All]`

2. **Рекомендованные Пути** (`/personal/paths`)
   - LXP-персонализация: рекомендации по роли
   - Компоненты: `PathRecommender`, `PersonalizedPath`, `RoleBasedSuggestions`
   - Доступ: `[All]`

3. **Микро-практики** (`/personal/practices`) 🆕
   - Ежедневные упражнения/наблюдения
   - Компоненты: `PracticeWidget`, `DailyExercise`, `StreakCounter`
   - Доступ: `[All]`

4. **Коуч-сессии** (`/personal/coaching`) 🆕
   - Запись на коучинг / 1:1, трек прогресса
   - Компоненты: `CoachingCalendar`, `SessionNotes`, `GoalTracker`
   - Доступ: `[Coach, Employee]`

5. **Воркшопы и Вебинары** (`/personal/events`)
   - Расписание soft-skills событий
   - Компоненты: `EventsList`, `EventCard`, `RegistrationForm`
   - Доступ: `[All]`

6. **Оценка и Тесты** (`/personal/assess`)
   - EQ тесты, профилирование, отчёты
   - Компоненты: `AssessmentCenter`, `ProfileViewer`, `ResultsReport`
   - Доступ: `[All]`

7. **Библиотека** (`/personal/library`)
   - Статьи, подкасты, книги
   - Компоненты: `ContentList`, `MediaPlayer`, `BookmarkButton`
   - Доступ: `[All]`

8. **План Развития (IDP)** (`/personal/plan`) 🆕
   - ИПР: цели, дедлайны, ревью
   - Компоненты: `IDPBuilder`, `GoalCard`, `TimelineView`, `ReviewModal`
   - Доступ: `[Employee, Manager]`

9. **Бейджи и Достижения** (`/personal/badges`)
   - Публичные достижения
   - Компоненты: `BadgeWall`, `MilestoneCard`, `ShareButton`
   - Доступ: `[All]`

---

### 5️⃣ Факультет Технологий и Оборудования (Tech & Equipment Academy)

**Базовый маршрут:** `/tech`

#### Страницы:

1. **Каталог Оборудования** (`/tech/catalog`)
   - Список оборудования, инструкции по использованию
   - Компоненты: `EquipmentList`, `EquipmentCard`, `InstructionViewer`
   - Доступ: `[All]`

2. **Обслуживание и Инциденты** (`/tech/maintenance`)
   - Заявки, чек-листы, графики ТО
   - Компоненты: `MaintenanceBoard`, `TicketForm`, `ScheduleCalendar`
   - Доступ: `[Tech, Manager]`

3. **Уроки по ПО** (`/tech/software`)
   - Lightroom/Photoshop курсы, макросы, пресеты
   - Компоненты: `SoftwareCourses`, `TutorialPlayer`, `PresetDownload`
   - Доступ: `[All]`

4. **IT-Безопасность** (`/tech/security`)
   - Политика безопасности, тесты, инциденты
   - Компоненты: `SecurityCenter`, `SecurityTest`, `IncidentReport`
   - Доступ: `[All, IT]`

5. **Гайды по устранению неполадок** (`/tech/troubleshoot`)
   - Пошаговые решения по поломкам
   - Компоненты: `TroubleshootArticles`, `GuideViewer`, `SearchBar`
   - Доступ: `[All]`

6. **Песочница и Лаборатория** (`/tech/labs`) 🆕
   - Тестовые окружения, демонстрации новых фич
   - Компоненты: `LabEnvironment`, `FeatureDemo`, `SandboxAccess`
   - Доступ: `[Trainer, Tech]`

7. **Сертификация** (`/tech/certs`)
   - Аккредитации по работе с оборудованием
   - Компоненты: `TechCertificates`, `CertificationPath`, `ExamScheduler`
   - Доступ: `[All]`

8. **Аналитика Активов** (`/tech/analytics`)
   - Доступность оборудования, время простоя
   - Компоненты: `AssetDashboard`, `UptimeChart`, `MaintenanceStats`
   - Доступ: `[Tech, Ops]`

---

### 6️⃣ Факультет Менеджмента (Leadership & Management Academy)

**Базовый маршрут:** `/mgmt`

#### Страницы:

1. **Лидерские Программы** (`/mgmt/leadership`)
   - Курсы по управлению командой, финансы, основы HR
   - Компоненты: `LeadershipCatalog`, `ProgramCard`, `ModuleList`
   - Доступ: `[Managers]`

2. **People Ops** (`/mgmt/people`)
   - Оценка, шаблоны 1:1, матрицы грейдов
   - Компоненты: `PeopleOpsTools`, `OneOnOneTemplate`, `GradeMatrix`
   - Доступ: `[Managers, HR]`

3. **Студия KPI и OKR** (`/mgmt/kpi`)
   - Настройка KPI, интеграция с модулем аналитики
   - Компоненты: `KPIStudio`, `OKRBuilder`, `MetricsDashboard`
   - Доступ: `[Managers, Analytics]`

4. **Коучинг и Наставничество** (`/mgmt/coaching`)
   - Методики коучинга, гайды наставника
   - Компоненты: `CoachingToolkit`, `MentorGuide`, `FeedbackFramework`
   - Доступ: `[Managers, Trainer]`

5. **Финансы для Менеджеров** (`/mgmt/finance`)
   - Основы P&L, бюджетирование обучения
   - Компоненты: `FinanceCourses`, `BudgetCalculator`, `PnLViewer`
   - Доступ: `[Managers]`

6. **Управление Изменениями** (`/mgmt/change`)
   - Проекты трансформации, чек-листы
   - Компоненты: `ChangePlaybook`, `TransformationPlan`, `ChangeChecklist`
   - Доступ: `[Managers]`

7. **Кадровый Резерв** (`/mgmt/talent`)
   - Развитие грейдов, планы преемственности
   - Компоненты: `PipelineBoard`, `SuccessionPlan`, `TalentMatrix`
   - Доступ: `[HR, Exec]`

8. **Зал Совета Директоров** (`/mgmt/board`)
   - Стратегические отчёты, дашборды
   - Компоненты: `ExecDashboard`, `StrategicReports`, `MetricsOverview`
   - Доступ: `[Exec, Admin]`

---

### 7️⃣ Институт Обучающих (Trainer Institute) 🎯

**Горизонтальный сервис, доступен из всех факультетов**

**Базовый маршрут:** `/trainers`

#### Страницы:

1. **Главная Института** (`/trainers`)
   - Рейтинг тренеров, программы аккредитации
   - Компоненты: `TrainersHome`, `LeaderboardTrainers`, `AccreditationPrograms`
   - Доступ: `[Admin, Trainer, Manager]`

2. **Аккредитация** (`/trainers/accredit`) 🆕
   - Путь сертификации, шаги, требования
   - Компоненты: `AccreditationFlow`, `StepProgress`, `RequirementList`
   - Доступ: `[Trainer, Admin]`

3. **Назначения** (`/trainers/assign`) 🆕
   - Назначение наставников на стажёров / отстающих
   - Компоненты: `AssignmentManager`, `TrainerMatcher`, `AssignmentCard`
   - Доступ: `[Manager, Admin]`

4. **Ресурсы Наставника** (`/trainers/resources`)
   - Методички, чек-листы, шаблоны (включая материалы по обучающему фотографу)
   - Компоненты: `TrainerLibrary`, `MethodologyViewer`, `TemplateDownload`
   - Доступ: `[Trainer]`

5. **Метрики Наставника** (`/trainers/metrics`) 🆕
   - NPS стажёров, удержание, эффект на KPI (2 месяца)
   - Компоненты: `TrainerMetrics`, `NPSChart`, `RetentionRate`, `KPIImpact`
   - Доступ: `[Admin, Analytics]`

6. **Выплаты и Награды** (`/trainers/rewards`)
   - Расчёт бонусов, история выплат (MC/GMC хуки)
   - Компоненты: `PayoutsPanel`, `RewardCalculator`, `PaymentHistory`
   - Доступ: `[Finance, Trainer]`

7. **Конструктор Курсов** (`/trainers/author`) 🆕
   - Конструктор курсов для тренеров
   - Компоненты: `CourseBuilder`, `ModuleEditor`, `AIContentGenerator`, `PublishWorkflow`
   - Доступ: `[Trainer, Methodologist]`

8. **Календарь и Расписание** (`/trainers/calendar`)
   - График тренировок, часы приема
   - Компоненты: `TrainerCalendar`, `ScheduleSlots`, `BookingManager`
   - Доступ: `[Trainer, Admin]`

9. **Контроль Качества (QA)** (`/trainers/qa`)
   - Аудиты обучающих смен, чек-листы
   - Компоненты: `TrainerQA`, `AuditChecklist`, `QualityScore`
   - Доступ: `[Trainer, Manager]`

---

## 🔗 РОУТИНГ И НАВИГАЦИЯ

### Главное меню Университета

```typescript
const universityMenu = [
  {
    label: 'Университет',
    icon: 'GraduationCap',
    path: '/university',
    children: [
      { label: 'Все академии', path: '/university' },
      { label: 'Мои курсы', path: '/university/my-courses' },
      { label: '---', divider: true },
      { label: 'Фотомастерство', path: '/photocraft', icon: 'Camera' },
      { label: 'Продажи и сервис', path: '/sales', icon: 'TrendingUp' },
      { label: 'Корпоративная культура', path: '/culture', icon: 'Heart' },
      { label: 'Личное развитие', path: '/personal', icon: 'Brain' },
      { label: 'Технологии', path: '/tech', icon: 'Cpu' },
      { label: 'Менеджмент', path: '/mgmt', icon: 'Users' },
      { label: '---', divider: true },
      { label: 'Институт Обучающих', path: '/trainers', icon: 'Award' },
    ]
  }
];
```

### Breadcrumbs

Все страницы должны иметь breadcrumbs навигацию на русском языке:

```typescript
// Пример для /photocraft/course/123
Университет > Фотомастерство > Курсы > Основы студийного света
```

---

## 🎨 UI/UX КОМПОНЕНТЫ

### Общие компоненты (переиспользуемые)

#### CourseCard
```typescript
interface CourseCardProps {
  title: string;
  description: string;
  academy: string;
  duration: number; // минуты
  modulesCount: number;
  rewardMC: number;
  rewardGMC: number;
  isMandatory: boolean;
  isCompleted?: boolean;
  progress?: number; // 0-100
}
```

**UI элементы (русский язык):**
- Кнопка: "Начать курс" / "Продолжить" / "Пройдено"
- Бейджи: "Обязательный", "Рекомендованный"
- Награда: "🪙 {mc} MC • 💎 {gmc} GMC"

#### ProgressBar
```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  label?: string; // "Прогресс", "Завершено модулей"
  showPercentage?: boolean;
}
```

#### BadgeCard
```typescript
interface BadgeCardProps {
  title: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  isLocked: boolean;
}
```

**UI элементы:**
- Статус: "Получено" / "Заблокировано"
- Дата: "Получено {date}"

#### FilterPanel
```typescript
interface FilterPanelProps {
  filters: {
    search?: string;      // "Поиск по названию..."
    academy?: string[];   // "Академия"
    level?: string[];     // "Уровень сложности"
    duration?: [number, number]; // "Длительность"
    type?: string[];      // "Тип курса"
  };
  onFilterChange: (filters: any) => void;
}
```

**UI элементы:**
- Плейсхолдеры: "Поиск...", "Выберите академию", "Все уровни"
- Кнопка: "Сбросить фильтры"

---

## 📱 АДАПТИВНОСТЬ И ЛОКАЛИЗАЦИЯ

### Требования к локализации

> [!IMPORTANT]
> Все тексты в интерфейсе должны быть на русском языке:
> - Кнопки: "Начать", "Продолжить", "Завершить", "Сохранить", "Отменить"
> - Плейсхолдеры: "Введите текст...", "Выберите дату..."
> - Уведомления: "Курс успешно завершен!", "Изменения сохранены"
> - Ошибки: "Не удалось загрузить данные", "Заполните все поля"
> - Статусы: "Активный", "Завершен", "Заброшен"

### Форматирование

- Даты: `DD.MM.YYYY` (24.11.2025)
- Время: `HH:MM` (14:30)
- Числа: разделитель тысяч — пробел (1 000)
- Валюта: "MC" и "GMC" (не переводить)

---

```

## 🛠️ ТЕХНОЛОГИЧЕСКИЙ СТЕК

### Backend
- **Nest.js** ✅
- **Prisma ORM** ✅
- **BullMQ** - очереди для уведомлений, аналитики
- **OpenAI API / Local LLM** - AI-генерация контента, IDP

### Frontend
- **React 18** ✅
- **Redux Toolkit (RTK Query)** ✅
- **Chart.js** - прогресс, аналитика
- **React Query** - кеширование

---

## 💡 ЛОГИКА СИСТЕМЫ

### Auto IDP Generation (AI)
```typescript
async generateIDP(userId: string, targetGrade: string) {
  // Получить текущие навыки
  const currentSkills = await getUserSkills(userId);
  
  // Получить требования к грейду
  const gradeRequirements = await getGradeRequirements(targetGrade);
  
  // Skill Gap Analysis
  const missingSkills = gradeRequirements.skills.filter(
    req => !currentSkills.find(s => s.skillId === req.id && s.level >= req.level)
  );
  
  // AI-подбор курсов
  const prompt = `
    Сотрудник уровня ${currentUser.grade} хочет стать ${targetGrade}.
    Нехватающие навыки: ${missingSkills.map(s => s.name).join(', ')}.
    Подбери оптимальный план обучения из курсов: ${availableCourses}.
  `;
  
  const aiResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  });
  
  // Создать IDP
  return await prisma.learningPath.create({
    data: {
      userId,
      coursesPlanned: aiResponse.courses,
      skillsTarget: missingSkills,
      aiGenerated: true
    }
  });
}
```

### Trainer Rating Update (Cron)
```typescript
@Cron('0 2 * * *') // Ежедневно в 02:00
async updateTrainerRatings() {
  const trainers = await prisma.trainer.findMany();
  
  for (const trainer of trainers) {
    const results = await prisma.trainingResult.findMany({
      where: { assignment: { trainerId: trainer.id } }
    });
    
    const avgNPS = results.reduce((sum, r) => sum + r.npsScore, 0) / results.length;
    const successRate = results.filter(r => r.retentionDays >= 60).length / results.length;
    
    const rating = (avgNPS * 0.6 + successRate * 5 * 0.4);
    
    await prisma.trainer.update({
      where: { id: trainer.id },
      data: {
        rating: rating.toFixed(2),
        avgNPS: avgNPS.toFixed(2),
        traineesSuccessful: results.filter(r => r.retentionDays >= 60).length
      }
    });
  }
}
```

---

## 📊 МЕТРИКИ УСПЕХА

- [ ] Все 7 академий созданы и активны
- [ ] LXP рекомендации работают корректно
- [ ] Skill Gap Analysis показывает точные результаты
- [ ] AI-генерация IDP работает
- [ ] Trainer Institute: аккредитация, назначения, рейтинги
- [ ] Интеграция с MC/GMC (начисление за курсы)
- [ ] Интеграция с KPI (влияние на грейды)
- [ ] Покрытие тестами > 80%

---

## 📝 ЗАВИСИМОСТИ

### От других модулей
- `02-Authentication-Authorization` - пользователи
- `08-Employee-Management` - профили, должности
- `12-KPI-Analytics` - данные KPI для грейдов
- `15-MatrixCoin-Economy` - начисление MC/GMC

### Используется модулями
- `01-Advanced-Gamification` - достижения за обучение
- `21-Telegram-Bot` - уведомления о курсах
- `20-Task-Management` - задачи на обучение

---

**Дата создания:** 2025-11-24  
**Версия:** 2.1 (Academy Model + Trainer Institute)
