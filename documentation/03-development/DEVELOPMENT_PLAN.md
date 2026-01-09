# MatrixGin v2.0 Development Plan (MVP-First)

> **Status:** Active
> **Phase:** 1 (MVP)
> **Goal:** Launch critical modules for pilot testing within 3-4 months.

---

## 📅 Phase 1: MVP Core (Weeks 1-16)

### 1. Foundation & Authentication (Weeks 1-2) ✅
**Goal:** Secure access and basic infrastructure.
- [x] Project Structure Setup
- [x] Database Configuration (PostgreSQL + Redis)
- [x] Authentication Service (JWT, Passport)
- [x] User Entity & RBAC Basics
- [ ] **Next:** Role Management & Permissions Seeding

### 2. Employee Management (Weeks 3-4)
**Goal:** Digital twin of the organization.
- [ ] Employee Profile (CRUD)
- [ ] Department Structure (Hierarchy)
- [ ] Status System (Universe -> Photon)
- [ ] Emotional State Tracking (Basic)

### 3. Task Management (Weeks 5-7)
**Goal:** Operational transparency and efficiency.
- [ ] Task Entity & Lifecycle (Pending -> Completed)
- [ ] Assignment Logic (Assignee, Observer)
- [ ] Priority & Deadlines
- [ ] Comments & Attachments
- [ ] Telegram Notifications

### 4. MatrixCoin Economy (Weeks 8-9)
**Goal:** Motivation and gamification foundation.
- [ ] Wallet System (MC/GMC/RUB)
- [ ] Transaction Engine (Earn/Spend)
- [ ] Automatic Rewards for Tasks
- [ ] Basic Store (Catalog)

### 5. Telegram Bot Interface (Weeks 10-12)
**Goal:** Primary user interface for employees.
- [ ] Bot Setup & Webhook
- [ ] Auth via Telegram ID
- [ ] Menu Navigation
- [ ] Task Creation via Chat
- [ ] Notifications System

### 6. KPI & Analytics (Weeks 13-14)
**Goal:** Performance visibility.
- [ ] Personal Dashboard
- [ ] Executive Dashboard
- [ ] Basic Reports (Tasks, Attendance)

### 7. Legal Compliance & Polish (Weeks 15-16)
**Goal:** Production readiness.
- [ ] 152-FZ Compliance (Consent forms, Logs)
- [ ] Data Backup Strategy
- [ ] Final Security Audit
- [ ] Deployment to Production

---

## 🚀 Phase 2: Growth (Months 5-8)
*Post-MVP features to be prioritized after pilot feedback.*

- **Psychological Support:** Burnout detection, advanced emotional analytics.
- **HR Analytics:** Matrix360, turnover prediction.
- **Corporate University:** Learning Management System (LMS).
- **Kaizen:** Idea submission and voting.

## 🏭 Phase 3: ERP Expansion (Months 9-12)
*Integration of heavy business processes.*

- **Procurement:** Supplier management, inventory.
- **Warehouse (WMS):** Stock tracking, QR codes.
- **Finance:** Budgeting, P&L, Cash Flow.
- **Production:** MES, Quality Control.

---

## 🛠 Technical Strategy

### Backend
- **Framework:** Node.js + NestJS (Express for MVP)
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **ORM:** Raw SQL / Query Builder (migrating to Prisma/TypeORM recommended for speed)

### Frontend
- **Admin Panel:** React 18 + TypeScript
- **User Interface:** Telegram Mini Apps

### AI Integration (Hybrid)
- **Local:** Llama 3.1 (Self-hosted) for data privacy.
- **Cloud:** GigaChat/YandexGPT for complex reasoning (fallback).
