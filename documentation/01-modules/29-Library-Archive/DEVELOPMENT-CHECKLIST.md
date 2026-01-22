# DEVELOPMENT-CHECKLIST.md  
## Module 29 — Library & Archive (MatrixGin)

**Статус:** DRAFT  
**Тип:** Core Infrastructure  
**Контур:** Secure Core  
**Критичность:** HIGH (Compliance / Ethics / Memory)  
**Зависимости:** 01-Auth, 02-Employee, 04-OFS, 23-Legal  
**Ключевой потребитель:** 33-Personnel-HR-Records  

---

## 0. PURPOSE OF THIS CHECKLIST

Этот документ определяет:
- имеем ли мы право реализовывать Module 29
- при каких условиях реализация считается корректной
- какие нарушения делают модуль АРХИТЕКТУРНО НЕДЕЙСТВИТЕЛЬНЫМ

Любой пункт со статусом **BLOCKER** обязателен.
Пропуск = модуль считается **НЕПРИНЯТЫМ**, даже если код работает.

---

## 1. PHASE 0 — SECURITY & CONTOUR CHECK (BLOCKER)

### 1.1 Контурная проверка (ОБЯЗАТЕЛЬНО)

- [ ] Module 29 развёрнут **только в Secure Core**
- [ ] Нет прямого выхода в интернет
- [ ] Нет внешних API
- [ ] Нет внешних LLM
- [ ] Доступ только через internal API Gateway
- [ ] Отсутствует прямой доступ к БД извне

❌ Нарушение любого пункта = BLOCKED

---

### 1.2 Trust Boundaries

- [ ] Чётко определены границы:
  - Producers (модули-источники)
  - Consumers (модули-потребители)
- [ ] Module 29 не принимает данные напрямую из:
  - Telegram
  - Web UI
  - External systems
- [ ] Все входящие данные проходят DTO-валидацию

---

## 2. PHASE 1 — ARCHITECTURE SLOT VALIDATION (BLOCKER)

### 2.1 Зависимости (жёсткая проверка)

- [ ] Auth (RBAC) подключён ДО модуля
- [ ] Employee используется как:
  - author
  - owner
  - approver
- [ ] OFS используется для:
  - department ownership
  - role-based visibility
- [ ] Legal определяет retention policies

---

### 2.2 Dependency Guardrails

Module 29 **НЕ МОЖЕТ**:
- [ ] зависеть от Corporate University как source of truth
- [ ] хранить документы без типа
- [ ] принимать решения о сроках хранения без Legal
- [ ] позволять AI модифицировать данные

---

## 3. PHASE 2 — DATA MODEL & REGISTRY (BLOCKER)

### 3.1 Обязательные сущности

- [ ] `library_documents`
- [ ] `library_document_versions`
- [ ] `library_links`
- [ ] Audit log (reuse system audit)

❌ Отсутствие любой сущности = BLOCKED

---

### 3.2 Registry-driven модель (ОБЯЗАТЕЛЬНО)

- [ ] Типы документов регистрируются через System Registry
- [ ] Нельзя создать документ без `document_type`
- [ ] `document_type` определяет:
  - retention policy
  - confidentiality level
  - allowed actions

---

### 3.3 Версионирование (BLOCKER)

- [ ] Каждая версия immutable
- [ ] Semantic versioning
- [ ] Нет overwrite старых версий
- [ ] Все ссылки = `document_id + version`

---

## 4. PHASE 3 — LIFECYCLE & FSM (BLOCKER)

### 4.1 Канонический lifecycle

FSM строго фиксирован:
draft → active → archived → destroyed


- [ ] `draft` не может быть source of truth
- [ ] `active` только один
- [ ] `archived` read-only
- [ ] `destroyed` только через Legal + акт

---

### 4.2 DELETE POLICY (CRITICAL)

- [ ] Физический DELETE запрещён
- [ ] Любое уничтожение:
  - имеет основание
  - имеет дату
  - имеет акт
  - остаётся в audit log

❌ Прямой DELETE = архитектурная ошибка

---

## 5. PHASE 4 — RBAC & ACCESS CONTROL (BLOCKER)

### 5.1 Уровни доступа

- [ ] Read
- [ ] Create
- [ ] Version
- [ ] Archive
- [ ] Destroy (Legal only)

---

### 5.2 Confidentiality enforcement

- [ ] Уровень доступа проверяется на уровне API
- [ ] Персональные данные → restricted access
- [ ] HR-документы (из Module 33) → максимальный уровень защиты

---

## 6. PHASE 5 — INTEGRATION WITH MODULE 33 (BLOCKER)

### 6.1 Каноническая интеграция

Module 33 **НЕ ХРАНИТ** долгосрочные документы.

- [ ] При закрытии PersonalFile → auto-archive в Module 29
- [ ] HR-документы получают:
  - `document_type`
  - retention = 75 лет
- [ ] Module 33 хранит только operational state
- [ ] Module 29 хранит юридическую истину

---

### 6.2 HR Compliance Guardrails

- [ ] ФЗ-152 соблюдён (PD isolation)
- [ ] Доступ EMPLOYEE → только свои документы
- [ ] Доступ HR → по зоне ответственности
- [ ] Любой доступ логируется

---

## 7. PHASE 6 — AI & RAG CONSTRAINTS (BLOCKER)

### 7.1 Роль AI

AI в Module 29:
- [ ] Read-only
- [ ] Advisory-only
- [ ] No write access
- [ ] No lifecycle decisions

---

### 7.2 RAG usage

- [ ] В RAG попадают только `active` и `archived`
- [ ] Draft исключён
- [ ] Ответ AI воспроизводим через версию документа

---

## 8. PHASE 7 — API CONTRACT (MUST)

### 8.1 Минимальный API

- [ ] GET documents
- [ ] GET document versions
- [ ] POST new document
- [ ] POST new version
- [ ] POST archive
- [ ] POST destroy (Legal only)

---

### 8.2 Contract stability

- [ ] API backwards-compatible
- [ ] Breaking changes запрещены без новой версии

---

## 9. PHASE 8 — VALIDATION & ACCEPTANCE

### 9.1 Условия статуса READY

Module 29 может получить статус **READY**, если:

- [ ] Все BLOCKER закрыты
- [ ] Интеграция с Module 33 работает
- [ ] Нет delete
- [ ] Есть audit trail
- [ ] Security checkpoints соблюдены

---

### 9.2 Автоматический BLOCKED, если:

- [ ] University хранит оригиналы
- [ ] AI правит документы
- [ ] HR-документы удаляются без акта
- [ ] Нет versioning
- [ ] Нет retention logic

---

## 10. FINAL PRINCIPLE

> Library & Archive — это не удобство.  
> Это память, ответственность и невозможность лжи.

Любая реализация, нарушающая этот принцип,
считается **некорректной для MatrixGin**.

