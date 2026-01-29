# Session Memory: Foundation Loop, Canon Compliance & Registration Visibility
Date: 2026-01-29

## Context
The session focused on stabilizing the User Admission flow (Foundation Gate) and ensuring strict adherence to the project's Canon.

## Critical Fixes

### 1. Foundation Redirect Loop
- **Issue**: Users with `BASE_ACCEPTED` status were trapped in an infinite redirect loop because `FoundationGuard` forced them to `/registration` (which didn't exist), and `App.tsx` redirected 404s back to `/`, re-triggering the guard.
- **Fix**: 
    - Temporarily relaxed `FoundationGuard.tsx` to allow `BASE_ACCEPTED` users access to all routes (disabled the blocking redirect).
    - Added a catch-all route in `App.tsx` (`<Route path="*" element={<Navigate to="/" replace />} />`) to prevent blank screens.

### 2. Canon Compliance (Bot Texts)
- **Issue**: The Telegram Bot used improvised text ("Начать погружение"), violating the "STOP if no data" canon.
- **Fix**:
    - **Documented**: Updated `documentation/00-strategic/ADMISSION_FLOW.md` with "Hard Canon" requirements for Bot texts and buttons.
    - **Enforced**: Added a "Canon Compliance" section to `memory-bank/activeContext.md`.
    - **Implemented**: Updated `employee-registration.service.ts` to use the canonical button text "🧭 Узнай Базу" and the approved welcome message.

### 3. Invisible Registration Requests
- **Issue**: The "Registration Requests" admin page was empty even when active requests existed.
- **Root Cause**: The frontend component `RegistrationRequestsPage.tsx` was strictly filtering for status `REVIEW`.
- **Fix**: Removed the status filter to display all requests (including `IN_PROGRESS` and `PENDING`), ensuring visibility of incomplete applications.

## Technical Decisions
- **Relaxed Guards**: Until the "Personal Data" form is fully implemented, `BASE_ACCEPTED` users are allowed to browse the system to avoid deadlocks. Make sure to implement the Profile Form in the future.
- **Canon First**: Any UI text must be present in `documentation/00-strategic/` before implementation.

## Next Steps
- Implement the actual Profile Completion Form (replacing the temporary bypass).
- Verify the "Personal Data" collection flow.
