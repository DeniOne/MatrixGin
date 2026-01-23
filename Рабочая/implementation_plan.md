# Implementation Plan: Corporate University Canon v2.2

**Goal:** Implement the "Foundational Immersion" admission gate and strictly enforce the separation between Foundational (Admission) and Applied (Education) layers.

> [!IMPORTANT]
> **Canon v2.2 Compliance:**
> - **Foundation != Education.** It is a mandatory admission gate.
> - **Binary Acceptance.** `ACCEPTED` / `NOT_ACCEPTED`. No partial states.
> - **Hard Blocking.** Backend must enforce access control via Guards. UI is untrusted.

## User Review Required

> [!WARNING]
> **Blocking Change:**
> - New users will be **LOCKED** out of all Applied University features, KPI accrual, and Role Contracts until they explicitly accept the Foundation.
> - **Trainee Role:** Now explicitly requires [FoundationAcceptance](file:///f:/Matrix_Gin/backend/src/services/enrollment.service.ts#464-546). No "auto-trainee" bypass.
> - **Migration:** Existing users will default to `is_foundational_accepted = false`.

> [!IMPORTANT]
> **Backfill Protocol (Strict)**
> To migrate existing trusted users, we must NOT use silent SQL updates.
> 1.  **Explicit Script**: Must be run via `npm run migrate:foundation`.
> 2.  **Audit Trail**: Every backfilled user gets a `FoundationAuditLog` entry (Event: `MIGRATION_BACKFILL`).
> 3.  **Fixed Version**: Backfills must explicitly target a version (e.g., `v1.0-legacy`).
> 4.  **Reasoning**: Reason must be recorded in metadata (e.g., "Legacy Trust Migration").

## Proposed Changes

### Phase 1: Foundation Data Layer (Single Source of Truth)

#### [MODIFY] [schema.prisma](file:///f:/Matrix_Gin/backend/prisma/schema.prisma)
1.  **FoundationAcceptance Model:**
    *   `person_id` (Unique, direct link to User/Person)
    *   `version` (String, e.g., "v1.0")
    *   `decision` (Enum: ACCEPTED | NOT_ACCEPTED | REVOKED)
    *   `accepted_at` (DateTime)
    *   `valid_until` (DateTime?)
2.  **Audit Log (`FoundationAuditLog`):**
    *   Append-only log of all attempts, blocks, and decisions.
3.  **Employee Model Cleanup:**
    *   **REMOVE** `is_foundational_accepted` field from [Employee](file:///f:/Matrix_Gin/backend/src/services/role-matrix.service.ts#205-218) model to prevent "dual source of truth" desync.
    *   **REMOVE** `foundational_accepted_at` from [Employee](file:///f:/Matrix_Gin/backend/src/services/role-matrix.service.ts#205-218).
    *   *Rationale:* All checks must query [FoundationAcceptance](file:///f:/Matrix_Gin/backend/src/services/enrollment.service.ts#464-546) directly.

### Phase 2: Backend Guards & Enforcement (The "Law")

#### [CREATE] [foundation.guard.ts](file:///f:/Matrix_Gin/backend/src/guards/foundation.guard.ts)
*   Global Guard Logic:
    1.  Fetch [FoundationAcceptance](file:///f:/Matrix_Gin/backend/src/services/enrollment.service.ts#464-546) for user.
    2.  fetch `ActiveFoundationVersion` (Config/Env).
    3.  **Check 1:** If record missing OR status != ACCEPTED → **403**.
    4.  **Check 2 (Version Mismatch):** If `acceptance.version != activeVersion` → **403 (Re-immersion Required)**.
    5.  Log `FOUNDATION_BLOCK` event.

### Phase 3: Foundational Immersion Content (NOT Courses)

#### [MODIFY] [seed.ts](file:///f:/Matrix_Gin/backend/prisma/seed.ts)
*   **DO NOT** seed these as [Course](file:///f:/Matrix_Gin/backend/src/services/university.service.ts#130-186) entities.
*   **DO NOT** use [Enrollment](file:///f:/Matrix_Gin/backend/src/services/enrollment.service.ts#427-445) model for them.
*   **Implementation:**
    *   Define Foundational Blocks in a separate config or dedicated [FoundationBlock](file:///f:/Matrix_Gin/backend/src/config/foundation.constants.ts#19-26) model (if dynamic) or hardcoded constant in code.
    *   Structure:
        *   [id](file:///f:/Matrix_Gin/backend/src/middleware/foundation.middleware.ts#9-58): LAW_CONSTITUTION, LAW_CODEX, ...
        *   `type`: BLOCK (not course)
        *   `mandatory`: true
    *   *Rationale:* Keep "Admission" and "Education" domains physically separate in DB.

### Phase 4: Trainee & University Split

#### [MODIFY] [university.service.ts](file:///f:/Matrix_Gin/backend/src/services/university.service.ts)
*   **Split Catalog:**
    *   If `!accepted` → Show ONLY Foundational Immersion.
    *   If `accepted` → Show Applied Faculties & Courses.

#### [MODIFY] [enrollment.service.ts](file:///f:/Matrix_Gin/backend/src/services/enrollment.service.ts)
*   **Immersion Flow:**
    *   Track progress of 5 blocks.
    *   On completion of all 5 + explicit "I ACCEPT" → Create [FoundationAcceptance](file:///f:/Matrix_Gin/backend/src/services/enrollment.service.ts#464-546).

### Phase 5: Migration & Backfill

#### [CREATE] [backfill-foundation.ts](file:///f:/Matrix_Gin/backend/scripts/backfill-foundation.ts)
*   **Script:** `npm run migrate:foundation`.
*   **Audit:** Logs `MIGRATION_BACKFILL` for every user.
*   **Safety:** Does not overwrite existing `ACCEPTED` states.

### Phase 6: Frontend Immersion UI (Strict Shell)

#### [CREATE] [foundation.api.ts](file:///f:/Matrix_Gin/frontend/src/services/foundation.api.ts)
*   Endpoints: `/status`, `/block-viewed`, `/decision`.
*   Error Handling: Global interceptor for 403.

#### [CREATE] [FoundationLayout.tsx](file:///f:/Matrix_Gin/frontend/src/layouts/FoundationLayout.tsx)
*   Dedicated layout with no sidebar/navigation.
*   Enforces "Immersion Mode".

#### [CREATE] [FoundationPages](file:///f:/Matrix_Gin/frontend/src/pages/foundation/)
*   `StartPage`: Context & Warning.
*   `BlockPage`: Dynamic block content (1..5).
*   `DecisionPage`: Checkbox & Accept/Decline.
*   `ResultPage`: Redirect or Logout.

## Verification Plan

### Automated Tests
1.  **Guard Test:** Attempt to access Applied Course without acceptance → **403**.
2.  **Guard Test:** Attempt to credit Wallet without acceptance → **403**.
3.  **Immersion Flow:** Complete 4/5 blocks → Acceptance fails. Complete 5/5 + Decision → Acceptance succeeds.
4.  **Trainee Test:** Try to create Trainee RoleContract without acceptance → **Fail**.

### Manual Verification
1.  **New User Journey:**
    *   Login → See only Immersion.
    *   Try to bypass URL to /applied → Access Denied.
    *   Complete Immersion → Access Granted.
2.  **Audit Log Check:** Verify `FOUNDATION_BLOCK` events are logged when bypass is attempted.
