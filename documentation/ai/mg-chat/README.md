# MatrixGin Chat (MG Chat)

This directory contains **canonical conversational contracts** for the MatrixGin Telegram agent.

These files define:
- intent taxonomy
- UX components (buttons / keyboards)
- error handling UX

They are **NOT code** and must be treated as **read-only contracts**.

Any change here affects conversational behavior system-wide.

## Files

- mg_intent_map.json — intent definitions and response structure
- mg_ux_components_map.json — Telegram UI components
- error_ux_map.json — error and edge-case UX

## Rules

- Backend and frontend MUST read these files
- No hardcoded UX in code
- Changes require version bump
