# MATRIXGIN — SYSTEM REGISTRY SERVICE
Status: CANONICAL
Component: `system-registry-service` (Backend)
Scope: Write-Contour (Secure Core)
Database Role: `registry_writer`

---

## 1. ARCHITECTURE OVERVIEW

### 1.1 Responsibility
The **System Registry Service** is the **exclusive** owner of write operations for Foundation Entities. It enforces the "Single Writer" principle and guarantees data integrity through strict lifecycle management and audit logging.

### 1.2 Layered Design
1.  **Transport Layer (Controller):** Handles HTTP, RBAC checks, and DTO validation (v1 Contract).
2.  **Domain Layer (Service):**
    - `EntityService`: Generic logic for all 47 entities.
    - `LifecycleManager`: Enforces FSM transitions.
    - `AuditService`: Async non-blocking audit logging.
3.  **Data Layer (Repository):**
    - Uses `registry_writer` connection pool.
    - No direct SQL exposure; uses Repository Pattern per entity type or generic DAO.

---

## 2. API ENDPOINT IMPLEMENTATION
*Implements `REGISTRY-API-CONTRACT.md` (v1)*

| Endpoint | Method | RBAC | Internal Logic |
| :--- | :--- | :--- | :--- |
| **List** | `GET /:type` | `REGISTRY_VIEW` | Select with pagination. |
| **Get** | `GET /:type/:id` | `REGISTRY_VIEW` | Select by ID. Returns 404 if not found. |
| **Create** | `POST /:type` | `REGISTRY_ADMIN` | 1. Validate Code (Repo check).<br>2. Force `status='draft'`.<br>3. Insert.<br>4. Emit Audit (CREATE). |
| **Update** | `PATCH /:type/:id` | `REGISTRY_ADMIN` | 1. Lock Entity.<br>2. Verify immutable code (if present in payload -> 400).<br>3. Update allowed fields.<br>4. Emit Audit (UPDATE_META). |
| **Lifecycle** | `POST /:type/:id/lifecycle` | `REGISTRY_ADMIN` | 1. Validate Transition.<br>2. Update status.<br>3. Emit Audit (UPDATE_LIFECYCLE). |
| **Audit** | `GET /:type/:id/audit` | `REGISTRY_VIEW` | Select from `AuditLog` table/service associated with entity. |

---

## 3. LIFECYCLE FINITE STATE MACHINE (FSM)

The service enforces a strict, forward-only lifecycle.

### 3.1 States
- `DRAFT`: Initial state. Invisible to most consumers (unless specifically requested/filtered).
- `ACTIVE`: Canonical state. Visible to all.
- `ARCHIVED`: Deprecated state. Read-only historical data.

### 3.2 Transitions rules
| From | To | Allowed? | Error (if false) |
| :--- | :--- | :--- | :--- |
| `DRAFT` | `ACTIVE` | ✅ YES | - |
| `ACTIVE` | `ARCHIVED` | ✅ YES | - |
| `ARCHIVED` | `ACTIVE` | ❌ NO | `409 Conflict: Cannot reactivate archived entity` |
| `ACTIVE` | `DRAFT` | ❌ NO | `409 Conflict: Cannot revert active to draft` |
| `*` | `*` | ❌ NO | `400 Bad Request` |

---

## 4. AUDIT STRATEGY

**Rule:** Every write operation is transactional with its audit record.

### 4.1 Audit Context Components
- **Actor:** Extracted from JWT (`sub`) or Internal Service ID.
- **Timestamp:** `now()` UTC.
- **Operation:**
  - `CREATE`: Logs full entity snapshot.
  - `UPDATE_META`: Logs `diff` (old_value, new_value) for `name`/`description`.
  - `UPDATE_LIFECYCLE`: Logs transition (e.g., `draft` -> `active`).

### 4.2 Storage
Audit logs are stored in a dedicated `audit_log` table (or per-entity shadow tables) within the Registry schema, accessible via `registry_writer`.

---

## 5. BOOTSTRAP EXECUTOR

The Service exposes an internal (CLI or non-public API) mechanism to seed the DB.

**Algorithm:**
1.  Read JSON seeds (`seeds/*.json`).
2.  Sort by Dependency Order (Level 0 -> 3).
3.  For each Entity:
    - Check IF EXISTS by `code`.
    - IF EXISTS: **SKIP** (Log: "Skipped existing: [code]").
    - IF NOT EXISTS:
        - Helper: `InternalCreate(dto, actor='system')`.
        - Force `lifecycle_status='draft'`.
4.  Report Sync Result.

---

## 6. SECURITY ASSUMPTIONS
- **Network:** Service is reachable ONLY from:
    - Admin UI (Contour A).
    - Other Core Services (via internal mesh).
- **Credentials:** `registry_writer` password payload is injected via Secret Manager at runtime.
- **Isolation:** The Service does NOT depend on any Business Module (OFS, Employees, etc.). No cyclic dependencies.
