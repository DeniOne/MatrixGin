# Implementation Plan - Registry-Driven Impact Analysis (Step 11)

## Goal
Implement a read-only, Registry-Driven Impact Analysis Engine (`ImpactService`) that advises on the potential effects of changes.
The analysis is strictly based on declared `impact` metadata in Registry Relations and restricted by `views.impact.*`.

## Architectural Changes

### 1. Registry & Contract Extension
**Relationship Impact Metadata:**
Extend [RelationshipDefinition](file:///f:/Matrix_Gin/backend/src/registry/core/registry.types.ts#57-64) and [EntityCardRelation](file:///f:/Matrix_Gin/backend/src/entity-cards/entity-card.types.ts#84-111) to include:
```typescript
impact?: {
    type: 'blocking' | 'dependent' | 'informational';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description?: string;
}
```

**Impact View Definition:**
```typescript
interface EntityCardImpactDefinition {
    type: 'impact';
    root: string;
    edges: string[];        // Edge Whitelist
    maxDepth?: number;      // Hard limit
    include?: string[];     // Impact types to include (e.g. ['blocking'])
    groupBy?: 'severity' | 'type';
}
```

### 2. Backend Impact Engine (Secure Core)
**Controller**: `ImpactController` serving `GET /api/impact/:entityType/:id?view=impact.default`.
**Service**: `ImpactService`
- Reuses [EntityCardCache](file:///f:/Matrix_Gin/backend/src/entity-cards/entity-card.cache.ts#16-149).
- TRAVERSAL: Similar to Graph, but accumulates **Impact Reports**.
- **Metrics**: Counts Critical/High/Medium/Low impacts.
- **Normalization**: Returns flat list of affected entities + summary.

**Security (`ImpactGuard`):**
- **Strict Read-Only**: No mutations.
- **Data Minimization**: Returns `{ id, entityType, label, impactType, severity }` ONLY.
- **Validation**: Enforces `view.root`, `view.edges`, `view.maxDepth`.

### 3. Frontend Architecture
New Module: `frontend/src/entity-impact/`
- **RegistryImpactViewer**:
    - **Summary Panel**: Badges/Charts showing impact counts.
    - **Impact List**: Grouped list of affected entities.
    - **Navigation**: Click -> Jump to Entity Card or Graph.

## Proposed Changes

### Backend
#### [MODIFY] [registry.types.ts](file:///f:/Matrix_Gin/backend/src/registry/core/registry.types.ts)
- Add `impact` to [RelationshipDefinition](file:///f:/Matrix_Gin/backend/src/registry/core/registry.types.ts#57-64).

#### [MODIFY] [entity-card.types.ts](file:///f:/Matrix_Gin/backend/src/entity-cards/entity-card.types.ts)
- Add `EntityCardImpactDefinition`.
- Update [EntityCardRelation](file:///f:/Matrix_Gin/backend/src/entity-cards/entity-card.types.ts#84-111).

#### [MODIFY] [entity-card.builder.ts](file:///f:/Matrix_Gin/backend/src/entity-cards/entity-card.builder.ts)
- Map `impact` from Registry to Card.

#### [NEW] [impact headers](file:///f:/Matrix_Gin/backend/src/impact/)
- `impact.controller.ts`
- `impact.service.ts`
- `impact.guard.ts`
- `impact.routes.ts`

### Frontend
#### [NEW] [frontend/src/entity-impact/](file:///f:/Matrix_Gin/frontend/src/entity-impact/)
- `RegistryImpactViewer` component.

## Verification Plan

### Manual
1.  Configure `UserAccount` with `impact` on `roles` (Blocking, High Severity).
2.  Configure `UserAccount` with `impact.default` view.
3.  API Call: `GET /api/impact/user_account/...` -> Verify JSON contains correct counts.
4.  UI Check: Verify Impact Viewer shows "High Severity: 1" (or similar).
