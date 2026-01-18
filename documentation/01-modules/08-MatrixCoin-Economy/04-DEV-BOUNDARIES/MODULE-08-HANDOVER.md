# MODULE 08 — HANDOVER GUIDE

**For**: Backend Team, System Integrators, Analytics Team

## 🏁 Quick Start

### 1. Consuming Data (Analytics / AI)
**DO NOT** query the database directly. Use the Integration Service.

```typescript
// Importing the Service
import { EconomyIntegrationReadService, RequesterModule } from '...';

// Reading Audit Logs (Aggregated)
const logs = await integrationService.readAuditLog(
  RequesterModule.ANALYTICS, 
  100
);
```

**Allowed Scopes**: Check `integration/matrix.ts`. If your module isn't listed, you cannot access data. **Do not bypass guards.**

### 2. Triggering Economy Actions (API)
External modules (e.g., Auction UI, Store Front) must use the API Controller.

- **Store Access**: `POST /economy/store/access`
- **Auction**: `POST /economy/auction/participate`
- **Governance**: `POST /economy/governance/evaluate`

### 3. Debugging
- **Missing Data?** Check `EconomyAuditLog`. Everything is there.
- **Access Denied?** Check `AuditEventRepository` for `INTEGRATION_ACCESS` denied events.
- **Logic Error?** The Core is unit-tested and frozen. Check your input DTOs.

## 🚫 "Don't Do This" List

1.  **Don't Add Fields to Events**. Events are strictly typed in `core/audit.types.ts`.
2.  **Don't Bypass Adapters**. Never inject `Logic` services directly into your controllers. Always use `Adapters`.
3.  **Don't "Fix" Logic**. If you find a "bug" in logic, it's likely a business rule. Consult the Architect. **Core is Immutable.**

## 🔍 observability

- **Logs**: `EconomyAuditLog` table.
- **Metrics**: Count events by `event_type`.
- **Alerts**: Watch for `GOVERNANCE_FLAGGED` events.

## 📦 Deployment
- **Prisma**: Run `npx prisma generate` to ensure types match the schema.
- **Environment**: Needs `DATABASE_URL`.

---
**Owner**: Antigravity (Step 2-6 Architect)
**Status**: Handed Over
