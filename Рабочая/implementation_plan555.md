# Implementation Plan — Phase 1.5: UI Completion

This phase focuses on enhancing system visibility for executives and employees by implementing read-only dashboards and profile pages.

## User Review Required

> [!IMPORTANT]
> All new UI components will be **READ-ONLY**. No write operations or AI-driven decisions will be implemented in this phase.

## Proposed Changes

### [KPI & Analytics (Module 12)]

#### [NEW] [PersonalAnalyticsPage.tsx](file:///f:/Matrix_Gin/frontend/src/pages/analytics/PersonalAnalyticsPage.tsx)
- Unified view of personal KPIs.
- Charts for performance dynamics.
- Source: `GET /api/analytics/personal`.

#### [NEW] [ExecutiveAnalyticsPage.tsx](file:///f:/Matrix_Gin/frontend/src/pages/analytics/ExecutiveAnalyticsPage.tsx)
- Department-level and System-level aggregates.
- Strict field-level access control (no individual drill-down).
- Source: `GET /api/analytics/executive`.

---

### [MatrixCoin Economy (Module 15)]

#### [MODIFY] [WalletPage.tsx](file:///f:/Matrix_Gin/frontend/src/pages/economy/WalletPage.tsx)
- Clean overview of MC/GMC balances.
- Wallet status and frozen funds visualization.
- Source: `GET /api/economy/wallet`.

#### [NEW] [TransactionsPage.tsx](file:///f:/Matrix_Gin/frontend/src/pages/economy/TransactionsPage.tsx)
- Searchable and filterable transaction history.
- Differentiation between MC and GMC flows.
- Source: `GET /api/economy/transactions`.

#### [MODIFY] [StorePage.tsx](file:///f:/Matrix_Gin/frontend/src/pages/economy/StorePage.tsx)
- Visual polish and completion of the reward store.
- Integration with the existing purchase flow.

---

### [Employee Management (Module 02)]

#### [NEW] [EmployeeProfilePage.tsx](file:///f:/Matrix_Gin/frontend/src/pages/EmployeeProfilePage.tsx)
- Comprehensive context-rich profile.
- Integration of tasks, training (University), and role data.
- **Strictly NO Control/HR Metrics.**

---

### [Layout & Navigation]

#### [MODIFY] [App.tsx](file:///f:/Matrix_Gin/frontend/src/App.tsx)
- Registering all new routes.

#### [MODIFY] [Sidebar.tsx](file:///f:/Matrix_Gin/frontend/src/components/layout/Sidebar.tsx)
- Updating links for the new Analytics and Economy views.

## Verification Plan

### Manual Verification
- Verify all data on new pages matches backend responses.
- Ensure no "Create/Edit/Delete" buttons are visible on read-only pages.
- Check responsive layout on small screens.
