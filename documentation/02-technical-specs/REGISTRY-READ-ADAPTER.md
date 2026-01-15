# MATRIXGIN — REGISTRY READ ADAPTER
Status: CANONICAL
Component: `RegistryReadAdapter` (Shared Library)
Version: v1
Dependencies: `REGISTRY-API-CONTRACT.md` (v1)

---

## 1. PURPOSE
The **RegistryReadAdapter** is a standardized, read-only integration component used by all downstream consumer modules (OFS, Employees, University, AI, Analytics) to access Foundation Entities.

It abstracts the HTTP communication with the `system-registry-service`, ensures caching consistency, and enforcing the architectural isolation of the Registry.

**Constraint:** Consumers MUST NOT access the Registry DB directly. They MUST use this Adapter.

---

## 2. PUBLIC INTERFACE (CONTRACT)

The Adapter exposes a strictly typed interface based on `RegistryModel` (v1).

| Method | Signature | Description |
| :--- | :--- | :--- |
| `getEntityByCode` | `(type: EntityType, code: string) -> Promise<RegistryEntityDTO>` | Fetch a single entity by its immutable code. Uses Cache. |
| `getEntityById` | `(type: EntityType, id: UUID) -> Promise<RegistryEntityDTO>` | Fetch a single entity by UUID. Uses Cache. |
| `listEntities` | `(type: EntityType, filter?: FilterDTO) -> Promise<RegistryEntityListDTO>` | Fetch paginated/filtered list. **Bypasses Cache** (usually). |
| `preloadActive` | `(type: EntityType) -> Promise<void>` | Pre-fetches all `active` entities of a type into Cache. Warm-up strategy. |

### 2.1 Types
- `EntityType`: Enum matching the 47 foundation entities (e.g., `ORG_UNIT`, `PERSON`, `CPK`).
- `RegistryEntityDTO`: Strictly strict DTO from API Contract v1.

---

## 3. CACHING STRATEGY

**Pattern:** Read-Through Cache (Distributed Redis).

- **Key Format:** `registry:v1:{entity_type}:code:{code}` and `registry:v1:{entity_type}:id:{id}`
- **TTL:** Configurable per environment (Default: 1 hour).
- **Validation:** Cache `lifecycle_status`. If `archived`, treat as missing unless specifically requested.

**Invalidation:**
- Passive: TTL expiration.
- Active: The `system-registry-service` publishes domain events (`RegistryEntityUpdated`) which the Adapter subscribes to (if event bus is available) to evict keys.

---

## 4. FAIL-SAFE BEHAVIOR & ERROR HANDLING

The Adapter protects the consumer from Registry downtime.

1.  **On API Failure (5xx / Timeout):**
    - Attempt to serve from **Cache** (stale data allowed if configured).
    - If Cache miss: Throw `RegistryUnavailableException`. **NO SILENT FAILURES.**
    - Do NOT return mock data. Do NOT return null (unless 404).

2.  **On 404 (Not Found):**
    - Return `null` or throw `EntityNotFoundException` (configurable context).
    - Cache the miss (short TTL) to prevent storming.

3.  **On 400 (Bad Request):**
    - Propagate as `RegistryIntegrationException` (Developer Error).

---

## 5. VERSION PINNING & COMPATIBILITY

- **Strict v1 Compliance:** This adapter is physically bound to `REGISTRY-API-CONTRACT-v1`.
- **No Mapping:** The Adapter returns raw `RegistryEntityDTO`. Consumer modules are forbidden from creating "wrapper" objects that hide the Registry nature of the data.
- **Upgrades:** If Registry API moves to v2, a new `RegistryReadAdapterV2` must be created. V1 Adapter continues to function unchanged.

---

## 6. USAGE CONSTRAINTS
1.  **Read-Only:** No write methods exist.
2.  **No Logic:** The Adapter does not interpret the data (e.g., does not calculate CPK status). It only transports it.
3.  **No Side Effects:** Calls to the Adapter must be idempotent and safe.
