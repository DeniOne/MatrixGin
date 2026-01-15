# MATRIXGIN — REGISTRY API CONTRACT
Status: CANONICAL
Version: v1
Base URL: `/api/v1/registry`

---

## 1. VERSIONING & SCOPE
- **Version:** `v1`
- **Scope:** Foundation Entities (System Registry)
- **Consumers:**
  - READ: All Modules (OFS, Employees, University, AI).
  - WRITE: `system-registry-service` (Secure Core) ONLY.

---

## 2. CANONICAL DTO DEFINITIONS

### A. RegistryEntityDTO (Response)
Universal representation of any foundation entity.
```json
{
  "id": "uuid",
  "code": "string (immutable unique identifier)",
  "name": "string",
  "description": "string | null",
  "lifecycle_status": "draft | active | archived",
  "created_at": "ISO 8601 UTC",
  "updated_at": "ISO 8601 UTC"
}
```

### B. RegistryEntityListDTO (Response)
Paginated list of entities.
```json
{
  "items": [RegistryEntityDTO],
  "pagination": {
    "page": "integer",
    "limit": "integer",
    "total": "integer"
  }
}
```

### C. CreateRegistryEntityDTO (Request)
Payload for creating a new entity.
```json
{
  "code": "string (required, pattern: ^[a-z_][a-z0-9_]*$)",
  "name": "string (required)",
  "description": "string (optional)"
}
```

### D. UpdateRegistryEntityDTO (Request)
Payload for updating mutable fields.
```json
{
  "name": "string (optional)",
  "description": "string (optional)"
}
```
*Note: `code` is strictly immutable.*

### E. LifecycleTransitionDTO (Request)
Payload for changing lifecycle state.
```json
{
  "transition": "activate | archive"
}
```

### F. AuditRecordDTO (Response)
Immutable audit log entry.
```json
{
  "timestamp": "ISO 8601 UTC",
  "actor_id": "uuid | 'system'",
  "operation": "CREATE | UPDATE | LIFECYCLE",
  "field": "string (optional)",
  "old_value": "string (optional)",
  "new_value": "string (optional)"
}
```

---

## 3. ENDPOINTS

| Method | Path | Request Body | Response Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/:entity_type` | Query Params (page, limit, filter) | `RegistryEntityListDTO` | List entities. Access: `registry_reader`. |
| `POST` | `/:entity_type` | `CreateRegistryEntityDTO` | `RegistryEntityDTO` | Create new entity. **Status defaults to 'draft'.** Access: `registry_writer`. |
| `GET` | `/:entity_type/:id` | - | `RegistryEntityDTO` | Get single entity details. Access: `registry_reader`. |
| `PATCH` | `/:entity_type/:id` | `UpdateRegistryEntityDTO` | `RegistryEntityDTO` | Update entity metadata. **Cannot change 'code'.** Access: `registry_writer`. |
| `POST` | `/:entity_type/:id/lifecycle` | `LifecycleTransitionDTO` | `RegistryEntityDTO` | Change status (Draft->Active->Archived). Access: `registry_writer`. |
| `GET` | `/:entity_type/:id/audit` | - | `AuditRecordDTO[]` | Get audit history. Access: `registry_reader`. |

---

## 4. SEMANTIC RULES

1.  **Creation State:**
    - `POST` requests ALWAYS create the entity in `lifecycle_status = 'draft'`.
    - It is impossible to creating an `active` entity directly.

2.  **Immutability:**
    - `code` field is immutable from the moment of creation.
    - `PATCH` requests containing `code` MUST be rejected with `400 Bad Request`.

3.  **Lifecycle Flow:**
    - Allowed transitions: `draft` -> `active` -> `archived`.
    - Reverse transitions (e.g., `archived` -> `active`) are **FORBIDDEN**.
    - `DELETE` operation is **NOT SUPPORTED**.

4.  **Universal Applicability:**
    - These DTOs apply to ALL foundation entities defined in `FOUNDATION-ENTITIES.md`.
    - No entity-specific fields are exposed via this generic Registry API.
