# Module 29: Library & Archive — Implementation Plan

**Дата:** 2026-01-22  
**Контур:** Secure Core  
**Критичность:** CRITICAL  
**Блокирующий потребитель:** Module 33 (Personnel HR Records)

---

## 📋 Цель

Реализовать **память MatrixGin** — фундаментальный модуль для:
- Фиксации знаний, решений и норм
- Сохранения истории без возможности переписывания
- Обеспечения единого источника истины
- Юридической воспроизводимости (75 лет для HR документов)

---

## 🎯 Философские инварианты

> **Документ ≠ файл**  
> Документ = смысл + контекст + ответственность + история

> **Прошлое нельзя переписать**  
> Любое решение остаётся зафиксированным

> **Нет удаления — есть судьба**  
> Документы: активируются → архивируются → уничтожаются (только по регламенту)

> **AI никогда не является источником истины**  
> AI: ✅ читает, ❌ не создаёт, ❌ не изменяет, ❌ не уничтожает

---

## 📊 Порядок реализации

### Phase 1: Database Layer (MUST)
### Phase 2: Backend Services (MUST)
### Phase 3: API Layer (MUST)
### Phase 4: File Storage (MUST)
### Phase 5: Integration с Module 33 (CRITICAL)
### Phase 6: Audit & Testing (MUST)

---

## 🎯 Phase 1: Database Layer

### 1.1. Core Tables

**`library_documents`**
```prisma
model LibraryDocument {
  id                   String   @id @default(uuid())
  title                String
  documentType         String   // registry-driven
  logicalOwner         String   @default("LIBRARY") // const
  businessOwnerRole    String
  status               DocumentStatus @default(DRAFT)
  currentVersionId     String?
  currentVersion       LibraryDocumentVersion? @relation("CurrentVersion", fields: [currentVersionId], references: [id])
  
  versions             LibraryDocumentVersion[] @relation("AllVersions")
  links                LibraryLink[]
  
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  
  @@map("library_documents")
}

enum DocumentStatus {
  DRAFT
  ACTIVE
  ARCHIVED
  DESTROYED
}
```

**`library_document_versions`**
```prisma
model LibraryDocumentVersion {
  id                   String   @id @default(uuid())
  documentId           String
  document             LibraryDocument @relation("AllVersions", fields: [documentId], references: [id])
  
  version              String   // semver (X.Y.Z)
  storageRef           String   // S3/MinIO path
  checksum             String   // sha256
  
  createdByEmployeeId  String
  createdAt            DateTime @default(now())
  
  @@unique([documentId, version])
  @@map("library_document_versions")
}
```

**`library_links`**
```prisma
model LibraryLink {
  id                   String   @id @default(uuid())
  documentId           String
  document             LibraryDocument @relation(fields: [documentId], references: [id])
  
  linkedModule         String   // "PERSONNEL", "LEGAL", etc.
  linkedEntityId       String
  linkType             LinkType
  
  createdAt            DateTime @default(now())
  
  @@map("library_links")
}

enum LinkType {
  REFERENCE      // просто ссылка
  MANDATORY      // обязательный документ
  EDUCATIONAL    // для обучения
}
```

### 1.2. Constraints (MUST)

- ✅ **Невозможность физического DELETE** — DB-level constraint (no DELETE grants)
- ✅ **Только один ACTIVE version** — unique constraint + trigger
- ✅ **DESTROYED → immutable forever** — DB-level trigger
- ✅ **FK constraints** на Employee / OFS
- ✅ **Все изменения → audit log**

---

## 🎯 Phase 2: Backend Services

### 2.1. DocumentService (MUST)

```typescript
class DocumentService {
  // Create document (draft by default)
  async createDocument(dto: CreateDocumentDto, actorId: string): Promise<LibraryDocument>
  
  // Get document by ID
  async getDocument(id: string, actorId: string): Promise<LibraryDocument>
  
  // List documents (with RBAC filtering)
  async listDocuments(filters: DocumentFilters, actorId: string): Promise<LibraryDocument[]>
  
  // Archive document (ACTIVE → ARCHIVED)
  async archiveDocument(id: string, actorId: string, reason: string): Promise<void>
  
  // Destroy document (ARCHIVED → DESTROYED) — Legal only
  async destroyDocument(id: string, legalBasis: string, approvedBy: string): Promise<void>
}
```

### 2.2. VersionService (MUST)

```typescript
class VersionService {
  // Create new version
  async createVersion(documentId: string, file: File, actorId: string): Promise<LibraryDocumentVersion>
  
  // List all versions
  async listVersions(documentId: string): Promise<LibraryDocumentVersion[]>
  
  // Set active version
  async setActiveVersion(documentId: string, versionId: string, actorId: string): Promise<void>
  
  // Validate checksum
  async validateChecksum(versionId: string): Promise<boolean>
}
```

### 2.3. LinkService (MUST)

```typescript
class LinkService {
  // Create link to module entity
  async createLink(documentId: string, linkedModule: string, linkedEntityId: string, linkType: LinkType): Promise<LibraryLink>
  
  // List links for document
  async listLinks(documentId: string): Promise<LibraryLink[]>
  
  // Validate link integrity
  async validateLinkIntegrity(linkId: string): Promise<boolean>
}
```

---

## 🎯 Phase 3: API Layer

### 3.1. Required Endpoints (MUST)

```
GET    /api/library/documents
GET    /api/library/documents/:id
GET    /api/library/documents/:id/versions
POST   /api/library/documents
POST   /api/library/documents/:id/versions
POST   /api/library/documents/:id/archive
POST   /api/library/documents/:id/destroy        [Legal only]
POST   /api/library/documents/:id/set-active-version
```

### 3.2. DTOs

**CreateDocumentDto**
```typescript
class CreateDocumentDto {
  @IsString() title: string;
  @IsString() documentType: string; // from Registry
  @IsString() businessOwnerRole: string;
}
```

**CreateVersionDto**
```typescript
class CreateVersionDto {
  @IsString() version: string; // semver
  @IsNotEmpty() file: File;
}
```

### 3.3. Guards (MUST)

- `LibraryAccessGuard` — RBAC enforcement
- `LegalOnlyGuard` — destroy action
- `ConfidentialityGuard` — document-level access

---

## 🎯 Phase 4: File Storage

### 4.1. Storage Rules (MUST)

- ✅ **Object storage** (S3 / MinIO)
- ✅ **storage_ref immutable** — no overwrite
- ✅ **Checksum verification** after upload
- ✅ **Encrypted at rest**
- ✅ **Signed URLs** (read-only, time-limited)

### 4.2. Storage Structure

```
library/
├── documents/
│   ├── {documentId}/
│   │   ├── {versionId}/
│   │   │   └── file.pdf
```

---

## 🎯 Phase 5: Integration с Module 33 (CRITICAL)

### 5.1. Inbound Flow (MUST)

**Scenario:** Module 33 архивирует PersonalFile

```typescript
// Module 33 emits event
emit('personal_file.archived', {
  personalFileId: 'pf-123',
  employeeId: 'emp-456',
  documents: [...],
  retentionYears: 75,
});

// Module 29 listener
@OnEvent('personal_file.archived')
async handlePersonalFileArchived(payload) {
  // 1. Create Library Document
  const doc = await this.documentService.createDocument({
    title: `Personal File ${payload.personalFileId}`,
    documentType: 'HR_PERSONAL_FILE', // 75 years retention
    businessOwnerRole: 'HR_MANAGER',
  }, 'SYSTEM');
  
  // 2. Upload all documents as versions
  for (const file of payload.documents) {
    await this.versionService.createVersion(doc.id, file, 'SYSTEM');
  }
  
  // 3. Set active version
  await this.versionService.setActiveVersion(doc.id, latestVersionId, 'SYSTEM');
  
  // 4. Create link to Module 33
  await this.linkService.createLink(doc.id, 'PERSONNEL', payload.personalFileId, 'MANDATORY');
  
  // 5. Emit success event
  emit('library.archiving_completed', { documentId: doc.id });
}
```

### 5.2. Boundary Enforcement (CRITICAL)

> **Module 33 НЕ хранит долгосрочные файлы**  
> **Library = единственный source of truth**

- ✅ Employee access → only own docs
- ✅ HR access → scoped by OFS
- ✅ Retention = 75 years (automatic)

---

## 🎯 Phase 6: Audit & Testing

### 6.1. Mandatory Audit Events (MUST)

```typescript
enum LibraryAuditEvent {
  DOCUMENT_CREATED = 'library.document_created',
  VERSION_CREATED = 'library.version_created',
  ACTIVE_VERSION_CHANGED = 'library.active_version_changed',
  DOCUMENT_ARCHIVED = 'library.document_archived',
  DOCUMENT_DESTROYED = 'library.document_destroyed',
  RESTRICTED_ACCESS = 'library.restricted_access',
}
```

### 6.2. Tests (MUST)

- ✅ Unit tests for services
- ✅ RBAC negative tests (unauthorized access)
- ✅ Version immutability tests
- ✅ Destroy without Legal → FAIL
- ✅ HR retention tests (75 years)
- ✅ Integration tests with Module 33

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

## 🚧 Explicitly Deferred

- ❌ UI (document browser) — после MVP
- ❌ Full-text search — после MVP
- ❌ Workflow approvals — после MVP
- ❌ AI auto-classification — после MVP
- ❌ Knowledge graph — после MVP

---

## 🔒 Final Rule

> **Если Library & Archive позволяет стереть след — это не MatrixGin.**

Любое отклонение от этого плана делает реализацию **НЕДЕЙСТВИТЕЛЬНОЙ**.

---

**Автор:** Antigravity AI  
**Дата:** 2026-01-22  
**Статус:** Ready for implementation
