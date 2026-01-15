# Implementation Plan - Registry-Driven Graph (Step 10)

## Goal
Implement a read-only, Registry-Driven Graph Engine (`RegistryGraph`) that enables exploration of entity relationships. The graph structure and traversal rules are strictly defined in `EntityCard.views.graph.*`.

## Architectural Changes

### 1. Entity Card Contract Extension
Extend [EntityCard](file:///f:/Matrix_Gin/frontend/src/entity-form/types/entity-card.types.ts#273-310) to include Graph View definitions and enhanced Relation metadata.

```typescript
// Relation Enhancements
export interface EntityCardRelation {
    // ... existing
    kind: 'one' | 'many';    // derived from cardinality
    via?: string;            // for M:N (e.g. 'user_role')
    direction?: 'out' | 'in';// default 'out'
    readonly: true;          // Step 10 constraint
}

### 2. Backend Graph Engine (Secure Core)
New Service: `GraphService` guarded by `EntityCardGraphGuard`.

**Validation Rules (STEP 10 Guard):**
- **Root Match**: `view.root` MUST match the entity type being requested.
- **Relation Existence**: `view.edges` must be a subset of `card.relations`.
- **Node Whitelist**: Traversal only enters nodes listed in `view.nodes`.
- **Edge Whitelist**: Traversal only follows allowed edges.
- **Data Minimization**: API returns **only** `{ id, entityType, label, urn }`. No attributes.

**Traversal Logic (GraphService):**
- **BFS** with `depth` limit (from view, max hard limit 3).
- **Cycle Protection**: Use `visited` Set (URNs) to prevent infinite loops.
- **Read-Only**: Strictly no mutations.

### 3. Frontend Architecture
New Module: `frontend/src/entity-graph/`
- **RegistryGraph**: Pure visualization.
- **Layout**: `dagre` used for auto-layout (UI hint only).
- **Navigation**: Click node -> `navigate('/app/:entityType/:id')`.

## Proposed Changes

### Backend
#### [MODIFY] [entity-card.types.ts](file:///f:/Matrix_Gin/backend/src/entity-cards/entity-card.types.ts)
- Add `EntityCardGraphDefinition`.
- Update [EntityCardRelation](file:///f:/Matrix_Gin/frontend/src/entity-form/types/entity-card.types.ts#177-204) (`kind`, `via`, `direction`).

#### [NEW] [graph.guard.ts](file:///f:/Matrix_Gin/backend/src/graph/graph.guard.ts)
- Implement `validateTraversalRequest(entityType, viewName)`.
- Implement `validateEdge(relation, targetType, view)`.

#### [NEW] [graph.service.ts](file:///f:/Matrix_Gin/backend/src/graph/graph.service.ts)
- Implement `getGraph(entityType, id, viewName)`.
- Use `visited` set for cycle detection.

#### [NEW] [graph.controller.ts](file:///f:/Matrix_Gin/backend/src/graph/graph.controller.ts)
- Endpoint: `GET /api/graph/:entityType/:id?view=:viewName`.

### Frontend
#### [NEW] [frontend/src/entity-graph/](file:///f:/Matrix_Gin/frontend/src/entity-graph/)
- `RegistryGraph` component using React Flow.


## Verification Plan

### Manual
1.  Configure `UserAccount` with `views.graph.default`.
    - Nodes: `user_account`, `role`, `permission`.
    - Edges: `roles`, `permissions`.
2.  Create test data (User linked to Role linked to Permission) if needed, or use existing.
3.  Render `<RegistryGraph entityType="user_account" entityId="..." viewName="graph.default" />`.
4.  Verify nodes and edges appear.
5.  Verify strictness: Add a relation NOT in `edges` list -> Should NOT appear.
