# Implementation Plan - Registry-Driven AI Ops Reasoning (Step 12)

## Goal
Implement a read-only, deterministic **AI Ops Reasoning Engine** that provides operational insights based *exclusively* on Registry projections (Graph & Impact).
The engine is purely advisory and strictly forbidden from mutating data or triggering actions.

## Architectural Changes

### 1. Data Contracts (DTOs)
**Input (`AIOpsInput`):**
- Aggregates [GraphResponseDto](file:///f:/Matrix_Gin/backend/src/graph/graph.service.ts#30-34) (Step 10) and [ImpactReportDto](file:///f:/Matrix_Gin/frontend/src/entity-impact/RegistryImpactViewer.tsx#14-19) (Step 11).
- **Constraint**: No raw DB access. Input is strictly what the Registry "sees".

**Output (`AIOpsRecommendation`):**
- Structured advice: `{ id, category, severity, title, reasoning, basedOn, disclaimer }`.
- **Constraint**: Must be traceable (`basedOn`) and labeled "advisory-only".

### 2. Backend AI Ops Engine (Secure Core)
**Module**: `backend/src/ai-ops/`
- **Controller**: `GET /api/ai-ops/:entityType/:id/analyze`.
- **Service (`AIOpsService`)**:
    - Fetches Graph (via [GraphService](file:///f:/Matrix_Gin/backend/src/graph/graph.service.ts#35-174)).
    - Fetches Impact (via [ImpactService](file:///f:/Matrix_Gin/backend/src/impact/impact.service.ts#38-153)).
    - Constructs **Prompt Context** from these projections.
    - Simulates/Calls AI Sandbox (Mocked for this env, but structurally complete).
    - Post-processes and validates output against schema.
- **Guard (`AIOpsGuard`)**:
    - **Input Validation**: Ensures Context is valid.
    - **Output Validation**: Rejects speculative claims, missing disclaimers, or actionable commands ("Do X").
    - **Determinism**: Ensures idempotent responses.

### 3. Frontend Architecture
**Module**: `frontend/src/ai-ops/`
- **RegistryAIOpsViewer**:
    - **Header**: Disclaimer "AI-Generated Recommendations".
    - **List**: Recommendations with Severity Badges.
    - **Traceability**: "Based on relation X" links to Graph.

## Proposed Changes

### Backend
#### [NEW] [backend/src/ai-ops/](file:///f:/Matrix_Gin/backend/src/ai-ops/)
- `ai-ops.types.ts`: DTO definitions.
- `ai-ops.guard.ts`: Guardrails.
- `ai-ops.service.ts`: Logic aggregation + Prompting.
- `ai-ops.controller.ts`: API endpoint.
- `ai-ops.routes.ts`: Router.

### Frontend
#### [NEW] [frontend/src/ai-ops/](file:///f:/Matrix_Gin/frontend/src/ai-ops/)
- `RegistryAIOpsViewer.tsx`: Visualization component.

## Verification Plan

### Manual Scenario
1.  **Scenario**: User modifies `UserAccount` (admin role).
2.  **Input**:
    - Graph: `UserAccount -> Role:Admin -> Permission:All`.
    - Impact: `Blocking/High` on `roles`.
3.  **Process**: API calls `AIOpsService` -> Aggregates Graph/Impact -> Generates Insight.
4.  **Output**: AI suggests "Changing roles carries High Risk due to dependency structure."
5.  **UI**: Verified in `RegistryAIOpsViewer` with "Advisory" label.

## Prompts Strategy
The System Prompt will strictly enforce the "Ops Advisor" persona:
> "You are an Ops Advisor. You analyze structure and impact. You DO NOT execute actions. You DO NOT invent data. Your output is a recommendation only."
