# Memory: Stabilization & Technical Debt Resolution (2026-01-29)

## 🚨 Critical Issues Resolved

### 1. 500 Error on Login (Serialization Crash)
**Issue**: Backend crashed when serializing `User` objects because `last_login_at` or `created_at` were sometimes returned as strings or nulls from the database/raw query, causing `.toISOString()` to throw.
**Root Cause**: Mixed data types from raw SQL or incomplete Prisma mapping combined with strict TS code execution.
**Fix**: Added rigorous `instanceof Date` checks in `AuthService.mapToUserResponse` and `FoundationService`.

### 2. Node.js Process Duplication (Port 3000 in use)
**Issue**: `TelegramService` architecture was flawed, creating race conditions and causing the backend to spawn duplicate bot instances or fail to release the port, leading to "Address already in use" errors.
**Fix**:
 - Refactored `TelegramService` to use a Singleton pattern properly.
 - Fixed the `getBot()` method duplication.
 - Implemented proper shutdown signals.

### 3. Polling Loop / 429 Too Many Requests (StartPage)
**Issue**: Infinite redirect loop between `StartPage.tsx` and `FoundationGuard`.
 - `StartPage` saw `foundation.status = ACCEPTED` -> Navigated to Dashboard.
 - `FoundationGuard` saw `user.admissionStatus = PENDING_BASE` -> Redirected back to StartPage.
 - This caused thousands of requests, triggering rate limits.
**Root Cause**:
 1. **Legacy Data**: Users accepted the foundation before the `admission_status` column existed or was populated.
 2. **Prisma Mismatch**: The backend code was updated to check `admission_status`, but the Prisma Client in `node_modules` was outdated and didn't know about this column, effectively returning `undefined` (mapped to `PENDING_BASE`).
**Fix**:
 - **Backend**: Regenerated Prisma Client (`npx prisma generate`).
 - **Backend**: Implemented "Self-Healing" compatibility logic in `AuthService`. If `foundation_status === ACCEPTED` but `admissionStatus` is pending, it auto-upgrades to `BASE_ACCEPTED`.
 - **Frontend**: Improved `StartPage.tsx` to explicitly sync user data before navigation.

## 🛠️ Infrastructure Improvements
- **Rate Limits**: Temporarily increased during debugging, confirmed stable.
- **Logging**: Enhanced logging in `AuthService` (INFO level for critical mapping) and `FoundationGuard`.
- **Type Safety**: Removed `@ts-ignore` hacks after regenerating Prisma.

## 🏁 Status
The system is now **STABLE**. The critical loop is broken, and legacy users can log in without DB intervention.
