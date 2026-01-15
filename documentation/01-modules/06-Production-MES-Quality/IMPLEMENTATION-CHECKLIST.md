# IMPLEMENTATION-CHECKLIST.md  
## 06 — Production MES & Quality

---

### 🧭 ОБЩАЯ ИНФОРМАЦИЯ

- **Модуль:** 06 — Production MES & Quality  
- **Фаза:** Phase 5 — ERP Modules  
- **Основание:** утверждённый MODULE-SPEC.md  
- **Scope:** строго ограничен данным чеклистом  
- **AI:** advisory only / read-only  
- **Контур:** Secure Core  

---

## 🚦 ФАЗОВАЯ ЛОГИКА

Реализация ведётся строго по этапам:

1. Data Model (БД)
2. Backend Services
3. API Layer
4. Frontend (MES UI)
5. Analytics & AI Advisory
6. Security & Audit Validation

Переход к следующему этапу **ЗАПРЕЩЁН**, если предыдущий не закрыт.

---

## ✅ MUST — ОБЯЗАТЕЛЬНО (БЕЗ ЭТОГО МОДУЛЬ НЕ СУЩЕСТВУЕТ)

### 1️⃣ DATA MODEL (DATABASE)

- [ ] `production_orders`
  - id
  - source_type (PSEE / manual)
  - source_ref_id
  - product_type
  - quantity
  - status
  - created_at / closed_at

- [ ] `work_orders`
  - id
  - production_order_id
  - operation_type
  - status
  - sequence_order
  - started_at / finished_at

- [ ] `quality_checks`
  - id
  - production_order_id
  - work_order_id (nullable)
  - check_type
  - result (pass / fail)
  - created_by (human)
  - created_at

- [ ] `defects`
  - id
  - production_order_id
  - defect_type
  - severity
  - root_cause (free text)
  - requires_rework (boolean)
  - resolved (boolean)

---

### 2️⃣ BACKEND — CORE SERVICES

- [ ] `ProductionOrderService`
  - create (human-triggered)
  - read
  - status transition (human-approved only)

- [ ] `WorkOrderService`
  - generate from production_order
  - sequential validation
  - status transitions

- [ ] `QualityService`
  - register quality_check
  - attach to order / operation
  - block flow only via human decision

- [ ] `DefectService`
  - register defect
  - link to quality_check
  - mark resolved / rework

---

### 3️⃣ API LAYER

- [ ] `POST /api/mes/production-orders`
- [ ] `GET /api/mes/production-orders`
- [ ] `GET /api/mes/production-orders/:id`

- [ ] `POST /api/mes/quality-checks`
- [ ] `POST /api/mes/defects`

❗ Все endpoints:
- RBAC-protected
- Audit-logged
- AI access = ❌ forbidden

---

### 4️⃣ FRONTEND — MES UI (MINIMUM)

- [ ] Production Orders List
  - статус
  - источник (PSEE / manual)
  - количество
  - проблемы качества (badge)

- [ ] Production Order Detail
  - work orders timeline
  - quality checks
  - defects (если есть)

- [ ] Quality Check Form
  - ручное заполнение
  - явное подтверждение человеком

---

### 5️⃣ SECURITY & AUDIT (MUST)

- [ ] Audit log:
  - создание заказов
  - quality checks
  - defect registration
  - rework decisions

- [ ] AI:
  - не имеет write-доступа
  - не вызывает endpoints
  - не меняет статусы

❗ Любое нарушение = модуль считается **НЕПРИНЯТЫМ**

---

## 🟡 SHOULD — ЖЕЛАТЕЛЬНО (УСИЛИВАЕТ ЦЕННОСТЬ)

- [ ] Quality Gates по типам продукта
- [ ] Rework Loop (визуально)
- [ ] SLA на переделки
- [ ] Aggregated Quality Metrics → Analytics
- [ ] Связь дефектов с Kaizen (read-only)

---

## 🔵 OPTIONAL — ПОЗЖЕ

- [ ] Equipment tracking (read-only)
- [ ] Material usage snapshot
- [ ] Predictive defect patterns (AI advisory)
- [ ] Batch comparison (без персональных метрик)

---

## ⏸️ DEFERRED — ЯВНО НЕ В ЭТОМ МОДУЛЕ

- ❌ Автоматическая блокировка производства
- ❌ Оценка сотрудников
- ❌ Финансовые санкции
- ❌ Gamification / KPI
- ❌ HR-скоринг

---

## 🧠 AI ADVISORY RULES (ЖЁСТКО)

AI может:
- подсвечивать повторяемость дефектов
- предлагать гипотезы улучшений
- формировать агрегаты

AI не может:
- принимать решения
- менять статусы
- запускать действия

---

## 🧪 КРИТЕРИИ ЗАКРЫТИЯ МОДУЛЯ

Модуль **06-Production-MES-Quality** считается ЗАКРЫТЫМ, если:

- [ ] Все MUST-пункты выполнены
- [ ] Нет незакрытых security-нарушений
- [ ] AI работает строго advisory-only
- [ ] Нет использования данных для оценки людей
- [ ] Модуль используется для управления процессом

---

## 🧭 ИТОГОВАЯ ФОРМУЛА

ЯСНЫЙ ПРОЦЕСС → СПОКОЙНЫЕ ЛЮДИ → СТАБИЛЬНОЕ КАЧЕСТВО

yaml
Копировать код

---

**MatrixGin Canon:**  
> Ни один дефект не равен ошибке человека.  
> Дефект — это сигнал системе.