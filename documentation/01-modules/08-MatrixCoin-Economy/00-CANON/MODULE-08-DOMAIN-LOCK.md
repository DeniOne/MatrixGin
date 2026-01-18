# MODULE-08-DOMAIN-LOCK.md
## MatrixCoin-Economy — Core Domain Freeze

**Status:** 🔴 **IMMUTABLE / LOCKED**
**Date:** 2026-01-17
**Scope:** `src/matrixcoin-economy/core`, `guards`, `logic`
**Authorized By:** Codebase Implementation (Steps 2, 3, 4)
emantic Authority:

This Domain Lock is subordinate to MODULE-08-CANON.md and 00-CANON/*.
Any conflict is resolved in favor of CANON meaning, not implementation.
---

## 1. THE IMMUTABLE CORE

The following components are **permanently frozen**. Any requirement to change them constitutes a **Major Version Change** requiring a full Re-Audit.

### 1.1 Pure Logic Layers (No Side Effects)
- ✅ **State Lifecycle:** `evaluateTransition`, `validateMCState` (Step 2)
- ✅ **Store Access:** `evaluateStoreAccess` (Step 3)
- ✅ **Auction Validation:** `openAuctionEvent`, `participateInAuction` (Step 3)
- ✅ **GMC Bridge:** `evaluateGMCRecognition` (Step 3)
- ✅ **Governance:** `evaluateEconomyGovernance` (Step 4)

### 1.2 Guards (The "Immune System")
- 🛡️ `guardValidState`, `guardTransitionUniqueness`
- 🛡️ `guardSystemOperational`, `guardUserNotRestricted`
- 🛡️ `guardAuctionCanOpen`, `guardAuctionCanParticipate`
- 🛡️ `guardSnapshotIntegrity`, `guardKnownDomain`
- 🛡️ **STRICT RULE:** Guards throw `DomainError` types ONLY.

### 1.3 Audit Structures (The "Black Box")
- 📜 **All Events Defined:** `AuditEventType` (Enums)
- 📜 **Mandatory Fields:** `userId`, `contextId`, `timestamp`, `snapshot`
- 📜 **Strict Typing:** All event interfaces are strictly typed in `audit.types.ts`

---

## 2. ARTIFACT REFERENCE

| Implementation | Spec Artifact | Status |
|----------------|---------------|--------|
| **Step 2 (Lifecycle)** | `STEP-2-STATE-LIFECYCLE.md` | ✅ APPROVED |
| **Step 3 (Store/Auction)** | `STEP-3-CANONICAL-SNAPSHOT.md` | ✅ FROZEN |
| **Step 4 (Governance)** | `STEP-4-CANONICAL-SNAPSHOT.md` | ✅ FROZEN |

---

## 3. INTEGRATION RULES (Next Phase)

As we move to **Step 5 (Persistence & API)**, the following rules apply:

1. **NO Logic in Controller:** API Layer must ONLY call Services.
2. **NO Logic in Service:** Services must ONLY orchestrate Guards -> Logic -> Audit -> Repo.
3. **DB is Storage Only:** Database schema must mirror Domain Types, not drive them.
4. **Audit First:** Audit Events must be persisted BEFORE (or exclusively to) any state mutation logic outcome.

---

## 4. SIGNATURE

**System:** MatrixGin Core
**Module:** 08
**Hash:** (Implicit Codebase Hash)
**Lock:** ACTIVE

> "The Core is Logic. The Rest is Detail."
