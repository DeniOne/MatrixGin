# OFS Frontend Component (Module 04)

This directory contains the Executive Snapshot UI for the Organization Functional Structure (OFS) module.

## Usage

1. **Import:**
   Import the screen component into your main App router or dashboard layout.
   ```typescript
   import { ExecutiveSnapshotScreen } from './features/ofs/ExecutiveSnapshotScreen';
   ```

2. **Route:**
   Add a route for the executive panel.
   ```typescript
   <Route path="/ofs/executive" element={<ExecutiveSnapshotScreen />} />
   ```

## Structure
- `ExecutiveSnapshotScreen.tsx`: Main container. Handles state (Loading, Fail-Safe, Scenario).
- `components/SignalBlock.tsx`: The 4-quadrant signal widget.
- `types.ts`: DTO definitions matching ExecutiveSnapshot Specification v1.0.

## Mock Data
Currently uses a mock `fetchSnapshot` function in `ExecutiveSnapshotScreen.tsx`. 
Replace this with `RegistryReadAdapter` call when ready.
