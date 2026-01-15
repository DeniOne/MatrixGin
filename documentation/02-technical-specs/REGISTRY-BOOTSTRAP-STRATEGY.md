# MATRIXGIN — REGISTRY BOOTSTRAP STRATEGY
Status: CANONICAL
Scope: System Initialization (Run Once)
Executor: `system-registry-service` (Secure Core)

---

## 1. BOOTSTRAP PRINCIPLES
1.  **Single Entry Point:** Bootstrap is executed ONLY via the `system-registry-service` internal logic, utilizing the `registry_writer` role.
2.  **Idempotency:** The process must be safe to run multiple times. If an entity with the same `code` exists, SKIPS (does NOT update).
3.  **Safety Default:** ALL entities created during bootstrap are initialized with **`lifecycle_status = 'draft'`**. No entity becomes `active` automatically.
4.  **Fail-Fast:** Any error (e.g., dependency missing) aborts the entire bootstrap sequence immediately.

---

## 2. SEED DATA CATEGORIES

### A. REQUIRED SYSTEM SEED
*Foundation types required for system logic to function.*
- **OrgUnitType** (e.g., `department`, `squad`, `tribe`)
- **StructuralRole** (e.g., `head`, `member`)
- **FunctionGroup** (e.g., `management`, `production`)
- **Status** (e.g., `stable`, `emergency`)
- **QualificationLevel** (e.g., `intern`, `expert`)
- **ValueToken** (e.g., `mag`, `gmc`)
- **TaskState** (e.g., `todo`, `in_progress`)
- **TaskType** (e.g., `bug`, `feature`)

### B. ORGANIZATIONAL SEED
*Company-specific structural constraints.*
- **Organization** (Root entity)
- **OrgUnit** (Top-level units only)
- **Position** (Base/Placeholder positions)
- **CPK** (Root CPK nodes)

### C. OPTIONAL SEED
*Extended knowledge and rules.*
- **Faculty**
- **Methodology**
- **RewardRule** / **PenaltyRule** (Default templates)

---

## 3. SEED FORMAT (DECLARATIVE)
Format: **JSON** (Strict Schema).
Location: `backend/system-registry/seeds/*.json`

**Schema:**
```json
[
  {
    "entity_type": "ORG_UNIT_TYPE",
    "code": "department",
    "name": "Department",
    "description": "Functional unit of organization"
  },
  {
    "entity_type": "VALUE_TOKEN",
    "code": "mag",
    "name": "MatrixGin Coin",
    "description": "Internal currency"
  }
]
```
*Note: No `id`. No `lifecycle`. Only immutable `code` and descriptive fields.*

---

## 4. EXECUTION ORDER (DEPENDENCY GRAPH)
The specific order is critical to satisfy Foreign Key constraints during creation.

1.  **Level 0 (no dependencies):**
    - `OrgUnitType`, `FunctionGroup`, `Status`, `Qualification`, `ValueToken`, `TaskType`, `TaskState`, `Tag`.
2.  **Level 1 (depends on L0):**
    - `Organization`, `StructuralRole`, `Function`, `QualificationLevel`, `RewardRule`, `PenaltyRule`.
3.  **Level 2 (depends on L1):**
    - `OrgUnit` (Requires `OrgUnitType`, `Organization`).
    - `CPK` (Requires `Organization`).
4.  **Level 3 (depends on L2):**
    - `Position` (Requires `OrgUnit`).
    - `CPKHierarchy` (Requires `CPK`).

---

## 5. GUARDRAILS & RESTRICTIONS
1.  **No Updates:** Bootstrap NEVER updates existing records. Code drift must be resolved manually via Admin UI.
2.  **No Deletions:** Bootstrap NEVER deletes extra records found in the DB.
3.  **Manual Activation:** An Admin must manually review and transition `draft` -> `active` via the Registry UI after bootstrap completes.
4.  **Audit Trail:** Every bootstrap creation is logged in the `AuditRecordDTO` with `actor_id = 'system'`.

---

## 6. RESULT DEFITION
Upon successful completion:
- The Registry is populated with canonical definitions.
- Consumer modules (OFS, UI) can resolve codes found in their own logic (e.g. `department` type).
- System is in a "Initialized - Pending Activation" state.
