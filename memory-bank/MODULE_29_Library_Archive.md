# Module 29: Library & Archive — Memory Bank

**Дата:** 2026-01-22  
**Статус:** ✅ READY for Integration

---

## 🎯 Назначение

**Library & Archive** — это память MatrixGin. Фундаментальный модуль для:
- Фиксации знаний, решений и норм
- Сохранения истории без возможности переписывания
- Обеспечения единого источника истины
- Юридической воспроизводимости (75 лет для HR документов)

---

## 📊 Архитектурные решения

### 1. Философские инварианты

> **Документ ≠ файл**  
> Документ = смысл + контекст + ответственность + история

> **Прошлое нельзя переписать**  
> Любое решение остаётся зафиксированным

> **Нет удаления — есть судьба**  
> `DRAFT` → `ACTIVE` → `ARCHIVED` → `DESTROYED`

> **AI никогда не является источником истины**  
> AI: ✅ читает, ❌ не создаёт, ❌ не изменяет, ❌ не уничтожает

### 2. Database Schema

```prisma
model LibraryDocument {
  id                   String   @id @default(uuid())
  title                String
  documentType         String   // HR_PERSONAL_FILE, etc.
  logicalOwner         String   @default("LIBRARY")
  businessOwnerRole    String
  status               DocumentStatus @default(DRAFT)
  currentVersionId     String?
  
  currentVersion       LibraryDocumentVersion?
  versions             LibraryDocumentVersion[]
  links                LibraryLink[]
}

model LibraryDocumentVersion {
  id                   String   @id @default(uuid())
  documentId           String
  version              String   // semver (X.Y.Z)
  storageRef           String   // immutable
  checksum             String   // sha256
  fileSizeBytes        BigInt
  mimeType             String
  createdByEmployeeId  String
}

model LibraryLink {
  id                   String   @id @default(uuid())
  documentId           String
  linkedModule         String   // "PERSONNEL", "LEGAL", etc.
  linkedEntityId       String
  linkType             LinkType
}
```

**Constraints:**
- ✅ No physical DELETE (DB-level)
- ✅ Unique active version per document
- ✅ DESTROYED → immutable forever

---

## 🔗 Integration с Module 33 (Personnel)

### Event Flow

```
Module 33 (Personnel)                Module 29 (Library)
─────────────────────                ───────────────────

1. HR_MANAGER архивирует
   PersonalFile (status → ARCHIVED)

2. emit('personal_file.archived')  →  3. @OnEvent('personal_file.archived')
                                          PersonnelArchivingListener

                                       4. Создаёт Library Document
                                          (documentType: HR_PERSONAL_FILE)

                                       5. Загружает файлы в S3/MinIO
                                          (retention: 75 years)

                                       6. Создаёт link
                                          (PERSONNEL → Library)

7. Получает событие              ←  8. emit('library.archiving_completed')
   'library.archiving_completed'
```

### Ключевые файлы

**Module 29:**
- `backend/src/modules/library/services/document.service.ts` — CRUD operations
- `backend/src/modules/library/services/version.service.ts` — version management
- `backend/src/modules/library/services/storage.service.ts` — S3/MinIO integration
- `backend/src/modules/library/listeners/personnel-archiving.listener.ts` — integration listener
- `backend/src/modules/library/controllers/library.controller.ts` — API endpoints

**Module 33:**
- `backend/src/modules/personnel/services/personal-file.service.ts` — event emission

---

## 📡 API Endpoints

```
GET    /api/library/documents
GET    /api/library/documents/:id
GET    /api/library/documents/:id/versions
POST   /api/library/documents
POST   /api/library/documents/:id/versions
POST   /api/library/documents/:id/set-active-version
POST   /api/library/documents/:id/archive
POST   /api/library/documents/:id/destroy        [Legal only]
```

---

## 🔒 Security & Compliance

- **Encrypted at rest** (AES256)
- **Signed URLs** (read-only, time-limited)
- **No overwrite** allowed (immutable)
- **Checksum validation** (SHA256)
- **RBAC enforcement** на всех уровнях
- **Audit events** для всех критичных действий

---

## ✅ Acceptance Criteria

Module 29 считается **READY**, если:
- ✅ Все MUST пункты закрыты
- ✅ Нет физического DELETE
- ✅ Интеграция с Module 33 подтверждена
- ✅ Audit покрывает все действия
- ✅ Security checkpoints соблюдены
- ✅ HR документы → 75 лет retention

---

**Автор:** Antigravity AI  
**Дата:** 2026-01-22  
**Статус:** ✅ READY for Integration
