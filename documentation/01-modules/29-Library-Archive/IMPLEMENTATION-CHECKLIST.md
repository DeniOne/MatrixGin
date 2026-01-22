# IMPLEMENTATION-CHECKLIST.md  
## Module 29 — Library & Archive (MatrixGin)

**Статус:** ✅ READY  
**Контур:** Secure Core  
**Критичность:** CRITICAL  
**Зависимости (MUST READY):**  
- 01-Auth (RBAC, audit)  
- 02-Employee (author / owner)  
- 04-OFS (roles, departments)  
- 23-Legal (retention, destruction rules)  

**Блокирующий потребитель:** 33-Personnel-HR-Records  
→ Module 33 **НЕ МОЖЕТ** быть запущен без закрытых MUST пунктов этого чеклиста.

---

## LEGEND

- **MUST** — обязательно для статуса READY  
- **SHOULD** — желательно, но не блокирует READY  
- **OPTIONAL** — после MVP  
- **DEFERRED** — осознанно отложено  

---

## 1. DATABASE & DATA MODEL

### 1.1 Core tables (MUST)

- [x] `library_documents`
- [x] `library_document_versions`
- [x] `library_links`

---

### 1.2 Constraints & invariants (MUST)

- [x] Невозможность физического DELETE на уровне БД
- [x] Только один `active` version per document
- [x] `destroyed` → immutable forever
- [x] FK constraints на Employee / OFS
- [x] Все изменения фиксируются в audit log

---

## 2. REGISTRY & ENUMS

### 2.1 DocumentType registry (MUST)

- [ ] Типы документов берутся ТОЛЬКО из System Registry
- [ ] Запрещено создавать document без `document_type`
- [ ] Каждый тип маппится на:
  - retention policy
  - confidentiality level
  - allowed lifecycle actions

---

### 2.2 Retention mapping (MUST)

- [ ] Интеграция с Module 23 (Legal)
- [ ] Автоматическая установка retention при создании документа
- [ ] HR-типы (из Module 33) → 75 лет

---

## 3. VERSIONING ENGINE

### 3.1 Version rules (MUST)

- [ ] Версия immutable
- [ ] Нельзя перезаписать файл
- [ ] Новая версия ≠ обновление старой
- [ ] SemVer validation (X.Y.Z)

---

### 3.2 Active version logic (MUST)

- [ ] Только одна active версия
- [ ] Переключение active версии → audit event
- [ ] Старые версии остаются доступными (read-only)

---

## 4. LIFECYCLE FSM

### 4.1 Canonical FSM (MUST)

draft → active → archived → destroyed


- [ ] draft ≠ source of truth
- [ ] archived = read-only
- [ ] destroyed = юридическое событие

---

### 4.2 Destroy flow (CRITICAL / MUST)

- [ ] Destroy возможен ТОЛЬКО через Legal
- [ ] Обязательные поля:
  - legal_basis
  - destruction_date
  - approved_by
- [ ] Audit event обязателен
- [ ] Физическое удаление файла — ASYNC + log

---

## 5. SERVICES (BACKEND)

### 5.1 DocumentService (MUST)

- [ ] createDocument()
- [ ] getDocument()
- [ ] listDocuments()
- [ ] archiveDocument()
- [ ] destroyDocument() — Legal only

---

### 5.2 VersionService (MUST)

- [ ] createVersion()
- [ ] listVersions()
- [ ] setActiveVersion()
- [ ] validateChecksum()

---

### 5.3 LinkService (MUST)

- [ ] createLink()
- [ ] listLinks()
- [ ] validateLinkIntegrity()

---

## 6. API LAYER

### 6.1 Required endpoints (MUST)

- [ ] `GET /api/library/documents`
- [ ] `GET /api/library/documents/:id`
- [ ] `GET /api/library/documents/:id/versions`
- [ ] `POST /api/library/documents`
- [ ] `POST /api/library/documents/:id/versions`
- [ ] `POST /api/library/documents/:id/archive`
- [ ] `POST /api/library/documents/:id/destroy` (Legal only)

---

### 6.2 API guardrails (MUST)

- [ ] RBAC enforced at controller level
- [ ] Confidentiality check per request
- [ ] DTO validation (no raw input)
- [ ] Backward compatibility preserved

---

## 7. FILE STORAGE

### 7.1 Storage rules (MUST)

- [ ] Object storage (S3 / MinIO)
- [ ] storage_ref immutable
- [ ] Checksum verification after upload
- [ ] No overwrite allowed

---

### 7.2 Security (MUST)

- [ ] Encrypted at rest
- [ ] Signed URLs (read-only)
- [ ] Access only via backend

---

## 8. AUDIT & LOGGING

### 8.1 Mandatory audit events (MUST)

- [ ] Document created
- [ ] Version created
- [ ] Active version changed
- [ ] Archived
- [ ] Destroyed
- [ ] Access to restricted document

---

## 9. INTEGRATION WITH MODULE 33 (HR RECORDS)

### 9.1 Inbound flow (MUST)

- [ ] `archivePersonalFile(personalFileId)`
- [ ] Auto-creation of Library Document
- [ ] HR document types mapped correctly
- [ ] Retention = 75 years

---

### 9.2 Boundary enforcement (CRITICAL)

- [ ] Module 33 НЕ хранит долгосрочные файлы
- [ ] Library = единственный source of truth
- [ ] Employee access → only own docs
- [ ] HR access → scoped by OFS

---

## 10. AI & RAG CONSTRAINTS

### 10.1 AI restrictions (MUST)

- [ ] Read-only access
- [ ] No write / no lifecycle
- [ ] Draft excluded from AI context

---

### 10.2 RAG readiness (SHOULD)

- [ ] Export embeddings for active/archived
- [ ] Version-aware context
- [ ] Deterministic retrieval

---

## 11. TESTING & VALIDATION

### 11.1 Tests (MUST)

- [ ] Unit tests for services
- [ ] RBAC negative tests
- [ ] Version immutability tests
- [ ] Destroy without Legal → FAIL
- [ ] HR retention tests (75y)

---

### 11.2 Acceptance criteria (MUST)

Module 29 считается **READY**, если:

- [ ] Все MUST пункты закрыты
- [ ] Нет физического DELETE
- [ ] Интеграция с Module 33 подтверждена
- [ ] Audit покрывает все действия
- [ ] Security checkpoints соблюдены

---

## 12. EXPLICITLY DEFERRED

- [ ] UI (document browser)
- [ ] Full-text search
- [ ] Workflow approvals
- [ ] AI auto-classification
- [ ] Knowledge graph

---

## FINAL RULE

> Если Library & Archive позволяет стереть след —  
> это не MatrixGin.

Любое отклонение от этого чеклиста  
делает реализацию **НЕДЕЙСТВИТЕЛЬНОЙ**.
