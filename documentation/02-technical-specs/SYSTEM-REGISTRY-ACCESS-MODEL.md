# MATRIXGIN — SYSTEM REGISTRY ACCESS MODEL
Status: CANONICAL
Scope: System Registry (Schemas: `registry`, `security`, `legal`)

---

## 1. SECURITY CONTRACT

### 1.1 Single Writer Principle
- The database role `registry_writer` is **EXCLUSIVE** to the `system-registry-service`.
- The `system-registry-service` MUST reside in the **Secure Core (Contour A)**.
- NO other service, module, or AI agent is permitted to possess `registry_writer` credentials.

### 1.2 Isolation & Prohibition
- **Direct DB Access:**
  - Business Modules (OFS, Employees, University) -> **READ ONLY** (`registry_reader`).
  - AI Core / Agents -> **READ ONLY** (`registry_reader`).
- **Write Operations:**
  - ALL writes must go through `system-registry-service` API.
  - Direct `INSERT`/`UPDATE` from business modules is strictly **FORBIDDEN**.

---

## 2. RBAC / DB ROLE MAPPING

| Application Role Classification | MatrixGin Permission | DB Role Strategy | Notes |
| :--- | :--- | :--- | :--- |
| **Registry Core Service** | `N/A (System)` | `registry_writer` | The only service with write capability. |
| **Registry Admin (User)** | `REGISTRY_MANAGE` | `N/A (Via API)` | User validates via API; API uses `registry_writer`. |
| **Registry Viewer (User)** | `REGISTRY_VIEW` | `N/A (Via API)` | User validates via API; API uses `registry_reader` (optional optimization). |
| **Business Service (e.g., OFS)** | `N/A (System)` | `registry_reader` | Direct DB Selects allowed for performance. |
| **AI Agent** | `N/A (System)` | `registry_reader` | Strictly read-only context. |

---

## 3. AUDIT REQUIREMENTS

### 3.1 Mandatory Write Logging
Every `INSERT` or `UPDATE` operation within the System Registry must generate an immutable audit record.

**Required Context:**
1.  **Actor:** User UUID (if manual) or System Service UUID.
2.  **Timestamp:** UTC (ISO 8601).
3.  **Target:** Schema + Table Name.
4.  **Identity:** Entity `code` (Immutable ID).
5.  **Operation:** `CREATE`, `UPDATE_LIFECYCLE`, `UPDATE_META`.

### 3.2 Implementation Layer
- **Primary:** Application Level (Registry Service Middleware).
- **Secondary (Defense in Depth):** DB Guardrails (already active) prevent unauthorized deletions and code modifications.

---

## 4. CONSTITUTIONAL RULES
1. `registry_writer` credentials are never shared via env vars to non-core containers.
2. If a business module needs a new Entity, it requests it via Registry API (Draft state), never inserts directly.
3. System Registry is the Source of Truth; local caching is permitted but writes MUST accept propagation latency.
