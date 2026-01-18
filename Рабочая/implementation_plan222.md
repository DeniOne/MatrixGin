# PHASE 1: Basic Purchase Flow (Transactional Core)

## Goal
Implement the core `StorePurchaseService` that executes the strict 9-step purchase flow defined in [STORE-TECH.md](file:///f:/Matrix_Gin/documentation/01-modules/08-MatrixCoin-Economy/06-IMPLEMENTATION/STORE-TECH.md). This layer handles the "hard" logic of asset transfer, locking, and validation.

**Constraints:**
- No API Controllers / Routes
- No UI Components
- No GMC / Registry integration yet
- **Strict Atomicity:** All or nothing.

## Technical Approach

### 1. New Service: `StorePurchaseService`
Located in: `src/matrixcoin-economy/services/store-purchase.service.ts`

**Key Dependencies:**
- `PrismaClient` (for `$transaction`)
- [StoreEligibilityService](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/services/store-eligibility.service.ts#51-143) (for context validation)
- `MCService` (for balance operations - *need to verify if this exists or if we do direct DB updates per PHASE 0 approach*) -> *Decision: Use Direct DB updates within transaction for atomicity, consistent with "System of Record" pattern.*

### 2. The 9-Step Flow Implementation
The method `purchaseItem` will wrap the entire flow in `prisma.$transaction`.

| Step | Action | Tech Detail |
|------|--------|-------------|
| 1 | **Idempotency** | Check [Purchase](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/core/purchase.types.ts#58-68) table for [(userId, idempotencyKey)](file:///f:/Matrix_Gin/backend/src/index.ts#38-42). If exists, return existing result. |
| 2 | **Load Data** | Lock Item row? `StoreItem` (read). Lock User Wallet? `MatrixCoinSnapshot` is read-only. We need to lock the **source of funds**. <br> *Correction:* MC is likely event-sourced or snapshot based. We need to query *current* MCs. |
| 3 | **Validate Item** | Check `active`, `stock > 0`, `purchaseLimit`. |
| 4 | **Eligibility** | Call `StoreEligibilityService.evaluate...`. Must be `ELIGIBLE`. |
| 5 | **Calc Price** | Use `item.priceMC`. Ensure `active_balance >= price`. |
| 6 | **Debit User** | **CRITICAL:** Create `MC_TRANSITION` (Active -> Spent/Burned) or Update Balance? <br> *Ref:* [STORE-TECH.md](file:///f:/Matrix_Gin/documentation/01-modules/08-MatrixCoin-Economy/06-IMPLEMENTATION/STORE-TECH.md): "Atomic Decrement". using `updateMany` or specific spending logic. |
| 7 | **Debit Stock** | `StoreItem.update({ data: { stock: { decrement: 1 } } })`. |
| 8 | **Record Purchase** | Create [Purchase](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/core/purchase.types.ts#58-68) record with `status: COMPLETED`. |
| 9 | **Audit** | Emit `STORE_PURCHASE_COMPLETED` event. |

### 3. Data Types Changes
- Update [purchase.types.ts](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/core/purchase.types.ts) if needed to support the service inputs/outputs.
- Ensure [PurchaseResult](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/core/purchase.types.ts#30-39) includes the created [Purchase](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/core/purchase.types.ts#58-68) object.

## Proposed Changes

### [NEW] `src/matrixcoin-economy/services/store-purchase.service.ts`
The main orchestrator.
```typescript
class StorePurchaseService {
  async purchaseItem(ctx: PurchaseContext): Promise<PurchaseResult> {
    return prisma.$transaction(async (tx) => {
      // 9 steps here
    })
  }
}
```

### [NEW] `src/matrixcoin-economy/core/purchase.logic.ts`
(Optional) If logic is complex, extract pure functions (e.g., "canAfford").

### [MODIFY] [src/matrixcoin-economy/services/index.ts](file:///f:/Matrix_Gin/backend/src/matrixcoin-economy/services/index.ts)
Export the new service.

## Verification Plan
Since there is no API/UI, verification will be done via **Integration Tests** script.
1. Create a script `verify-purchase-flow.ts`.
2. Seed: User, 100 MC, Item (Stock: 1).
3. Run `purchaseItem`.
4. Check: Purchase created, Stock = 0, MC reduced.
5. Run `purchaseItem` again (Idempotency) -> Should return success (same ID).
6. Run `purchaseItem` (New Key) -> Should fail (Out of Stock).
