# MatrixGin — ARCHITECTURE

> **Версия:** 2.0  
> **Дата обновления:** 2026-01-10

---

## 🏗️ Общая архитектура системы

```mermaid
flowchart TB
    subgraph CLIENT["🖥️ CLIENT LAYER"]
        UI["React Frontend<br/>:5173"]
        TG["Telegram Bot"]
    end

    subgraph API["🔌 API LAYER"]
        GW["MatrixGin Backend<br/>Express :3000"]
        PSEE_API["PSEE API<br/>Fastify :3001"]
    end

    subgraph CORE["🧠 CORE SERVICES"]
        AUTH["Auth Service"]
        EMP["Employee Service"]
        TASK["Task Service"]
        ECON["Economy Service"]
        GAMIF["Gamification Service"]
        UNI["University Service"]
        OFS["OFS Service"]
        ANAL["Analytics Service"]
    end

    subgraph REGISTRY["📚 REGISTRY CORE (V2 BASE)"]
        REG["Registry Service"]
        CARD["Entity Card Service"]
        GRAPH["Graph Engine"]
        IMPACT["Impact Engine"]
    end

    subgraph AI["🤖 AI CORE"]
        KPI_E["KPI Engine"]
        QUAL_E["Qualification Engine"]
        REW_E["Reward Engine"]
        OPS_E["AI Ops Advisor"]
    end

    subgraph PSEE_CORE["📷 PSEE CORE"]
        EVT["Event Store"]
        FSM["FSM Engine"]
        CONSUMER["Event Consumer"]
        READ["Read Model"]
    end

    subgraph DATA["💾 DATA LAYER"]
        PG[("PostgreSQL<br/>:5432")]
        REDIS[("Redis<br/>:6379")]
    end

    UI --> GW
    TG --> GW
    
    GW --> AUTH
    GW --> EMP
    GW --> TASK
    GW --> ECON
    GW --> GAMIF
    GW --> UNI
    GW --> OFS
    GW --> ANAL
    
    GW --> CONSUMER
    CONSUMER --> READ
    READ --> GW
    
    PSEE_API --> EVT
    PSEE_API --> FSM
    EVT --> PG
    
    AUTH --> PG
    AUTH --> REDIS
    EMP --> PG
    TASK --> PG
    ECON --> PG
    GAMIF --> PG
    GAMIF --> REDIS
    UNI --> PG
    OFS --> PG
    ANAL --> PG
    
    CONSUMER --> REDIS
    CONSUMER -.->|polling| PG
    
    AI --> CORE
```

---

## 📊 Схема взаимодействия модулей

```mermaid
flowchart LR
    subgraph CORE_MODULES["🔵 ЯДРО СИСТЕМЫ"]
        AUTH["🔐 Auth"]
        EMP["👥 Employees"]
    end

    subgraph OPERATIONAL["🟢 ОПЕРАЦИОННЫЕ"]
        TASK["✅ Tasks"]
        OFS["🏛️ OFS"]
        PROD["🏭 Production"]
    end

    subgraph MOTIVATION["🟡 МОТИВАЦИЯ"]
        GAMIF["🎮 Gamification"]
        ECON["💰 Economy"]
        UNI["🎓 University"]
    end

    subgraph REGISTRY_LAYER["📚 REGISTRY LAYER"]
        REG["Registry Core"]
        GRAPH["Graph Engine"]
    end

    subgraph INTELLIGENCE["🟣 АНАЛИТИКА + AI"]
        ANAL["📊 Analytics"]
        AI["🧠 AI Core"]
        PSEE["📷 PSEE"]
    end

    subgraph INTERFACE["⚪ ИНТЕРФЕЙСЫ"]
        TG["🤖 Telegram"]
        WEB["🖥️ Web UI"]
    end

    %% Core dependencies
    AUTH --> EMP
    EMP --> TASK
    EMP --> OFS
    EMP --> GAMIF
    EMP --> ECON
    EMP --> UNI

    %% Operational flow
    TASK --> GAMIF
    TASK --> ECON
    PSEE --> PROD

    %% Analytics
    TASK --> ANAL
    GAMIF --> ANAL
    ECON --> ANAL
    ANAL --> AI

    %% Interfaces
    TG --> AUTH
    TG --> TASK
    WEB --> AUTH
    WEB --> TASK
    WEB --> GAMIF
    WEB --> UNI
    WEB --> PROD
```

---

## 🔄 Поток данных

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend
    participant API as Backend API
    participant DB as PostgreSQL
    participant CACHE as Redis
    participant PSEE as PSEE Service

    U->>UI: Action (click, submit)
    UI->>API: REST API Request
    API->>CACHE: Check cache
    
    alt Cache hit
        CACHE-->>API: Cached data
    else Cache miss
        API->>DB: Query
        DB-->>API: Result
        API->>CACHE: Store in cache
    end
    
    API-->>UI: JSON Response
    UI-->>U: Updated UI

    Note over PSEE,DB: PSEE Event Flow
    PSEE->>DB: Store Event (psee.events)
    API->>DB: Poll events (cursor-based)
    API->>CACHE: Update Read Model cursor
    API->>API: Process events → Read Model
```

---

## 📦 Структура модулей

```mermaid
graph TD
    subgraph BACKEND["Backend Structure"]
        direction TB
        IDX["index.ts<br/>(Express app)"]
        
        subgraph ROUTES["Routes Layer"]
            R1["auth.routes"]
            R2["employee.routes"]
            R3["task.routes"]
            R4["production.routes"]
            R5["...other routes"]
        end
        
        subgraph CONTROLLERS["Controllers Layer"]
            C1["auth.controller"]
            C2["employee.controller"]
            C3["task.controller"]
            C4["production.controller"]
            C5["...other controllers"]
        end
        
        subgraph SERVICES["Services Layer"]
            S1["auth.service"]
            S2["employee.service"]
            S3["task.service"]
            S4["gamification.service"]
            S5["...other services"]
        end
        
        subgraph ENGINES["AI Engines"]
            E1["kpi/"]
            E2["qualification/"]
            E3["reward/"]
            E4["ai/"]
        end
        
        subgraph PSEE_INT["PSEE Integration"]
            P1["event-consumer"]
            P2["read-model"]
            P3["psee.service"]
        end
        
        IDX --> ROUTES
        ROUTES --> CONTROLLERS
        CONTROLLERS --> SERVICES
        SERVICES --> ENGINES
        SERVICES --> PSEE_INT
    end
```

---

## 🎯 Зависимости модулей

| Модуль | Зависит от | Используется в |
|--------|-----------|----------------|
| **Auth** | - | Все модули |
| **Employees** | Auth | Tasks, OFS, Gamification, Economy, University, Analytics |
| **Tasks** | Auth, Employees | Gamification, Economy, Analytics, Telegram |
| **OFS** | Auth, Employees | - |
| **Gamification** | Auth, Employees, Tasks, Economy | Analytics |
| **Economy** | Auth, Employees | Gamification, Store |
| **University** | Auth, Employees | Gamification |
| **Analytics** | All modules | AI Core |
| **PSEE** | - | Production |
| **Production** | PSEE | UI |
| **AI Core** | Analytics, Events | Recommendations |
| **Telegram** | Auth, Tasks, Gamification | Notifications |

---

## 🗄️ Схема базы данных (упрощённая)

```mermaid
erDiagram
    users ||--o{ employees : "has profile"
    users ||--o{ wallets : "has wallet"
    employees ||--o{ tasks : "assigned to"
    employees }|--|| departments : "belongs to"
    departments ||--o{ departments : "parent/child"
    
    tasks ||--o{ task_comments : "has"
    tasks ||--o{ task_history : "has"
    
    wallets ||--o{ transactions : "has"
    
    employees ||--o{ gamification_scores : "has"
    employees ||--o{ achievements : "earned"
    
    employees ||--o{ enrollments : "enrolled in"
    courses ||--o{ enrollments : "has"
    
    PSEE_EVENTS {
        uuid id
        string session_id
        string event_type
        jsonb payload
        timestamp created_at
    }
```

---

## 🚦 Статусы и переходы (FSM примеры)

### Task Workflow
```mermaid
stateDiagram-v2
    [*] --> TODO
    TODO --> IN_PROGRESS: Start
    IN_PROGRESS --> REVIEW: Complete
    REVIEW --> DONE: Approve
    REVIEW --> IN_PROGRESS: Reject
    DONE --> ARCHIVED: Archive
    DONE --> [*]
```

### PSEE Session Workflow
```mermaid
stateDiagram-v2
    [*] --> CREATED
    CREATED --> PENDING_PHOTOGRAPHER: Assign
    PENDING_PHOTOGRAPHER --> PENDING_RETOUCHER: Complete
    PENDING_RETOUCHER --> PENDING_REVIEW: Complete
    PENDING_REVIEW --> APPROVED: Approve
    PENDING_REVIEW --> REJECTED: Reject
    APPROVED --> [*]
    REJECTED --> [*]
```

---

## 📡 API Mapping

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── POST /refresh
├── /employees
│   ├── GET /
│   ├── POST /
│   ├── GET /:id
│   └── PUT /:id
├── /tasks
│   ├── GET /
│   ├── POST /
│   ├── GET /:id
│   ├── PUT /:id
│   └── POST /:id/complete
├── /production
│   └── GET /sessions
├── /gamification
│   ├── GET /leaderboard/:type/:period
│   ├── GET /my-status
│   └── GET /achievements
├── /economy
│   ├── GET /wallet
│   └── GET /transactions
├── /university
│   ├── GET /courses
│   └── GET /my-enrollments
└── /analytics
    ├── GET /personal
    └── GET /executive
```

---
---

## 💖 Emotional & Ethical Layer (v2.0)

MatrixGin включает надсистемный слой, влияющий на поведение всех модулей,
но не являющийся отдельным сервисом или API.

### Ключевые компоненты слоя:
- Emotional Passport (Module 25)
- State of Being Engine (Module 26)

### Роль слоя:
- не управляет логикой напрямую
- не принимает решений
- не вмешивается в бизнес-процессы

### Функция:
- адаптация поведения системы
- защита человека в уязвимых состояниях
- обеспечение этичности AI, экономики и управления

### Архитектурный принцип:
Emotional & Ethical Layer = **Policy + Context**, а не Execution.

Ни один модуль не может:
- усиливать давление
- повышать требования
- изменять экономические стимулы

без учёта Emotional & Ethical Layer.

**Последнее обновление:** 2026-01-11
