# OFS Graph View Specification (v1.0)

## 1. Vision & Philosophy
The OFS Graph View is **not** an org chart, an ER diagram, or a technical schema. It is a **strategic lens** into the System Registry. It allows Executives to "see" the health, structure, and flow of the organization as a living organism.

**Core Principle:** "Minimum Elements, Maximum Meaning."
**Target User:** Executive / Architect.
**Constraint:** Read-Only. No Personalities. No CRUD.

---

## 2. Graph Modes (The 4 Lenses)

The user can switch between four distinct modes. Each mode drastically changes the *topology* and *semantics* of the graph, effectively showing a "different world" based on the same underlying data.

### A. STRUCTURE MODE (The Skeletal System)
*   **Nodes:** `OrgUnit` (Departments, Teams, Groups).
*   **Edges:** `PARENT_OF` (Hierarchy), `REPORTS_TO` (Functional).
*   **Visual Metaphor:** Gravity / Tree-like structure.
*   **Insights (Auto-Highlighting):**
    *   **Orphans:** Nodes with no parent (Red halo).
    *   **Bottlenecks:** Nodes with >7 direct reports (Yellow pulse).
    *   **Conflicts:** Dual reporting lines or circular dependencies (Red dashed links).

### B. FUNCTION MODE (The Nervous System)
*   **Nodes:** `BusinessFunction`, `OrgUnit`.
*   **Edges:** `OWNS` (Unit -> Function), `DEPENDS_ON` (Function -> Function).
*   **Visual Metaphor:** Network / Flow.
*   **Insights (Auto-Highlighting):**
    *   **Orphan Functions:** Functions with no owner (Red node).
    *   **Duplication:** Similar functions owned by different units (Yellow link).
    *   **Gaps:** Missing dependencies in critical chains (Gray dotted links).

### C. CPK MODE (The Circulatory System)
*   **Nodes:** `CPK` (Valuable Final Product), `OrgUnit`.
*   **Edges:** `PRODUCES` (Unit -> CPK), `CONSUMES` (Unit -> CPK).
*   **Visual Metaphor:** Value Chain / Pipeline / Left-to-Right Flow.
*   **Insights (Auto-Highlighting):**
    *   **Dead Ends:** CPKs that are produced but not consumed (Waste) (Yellow).
    *   **Starvation:** Units consuming CPKs that are not produced (Red).
    *   **Conflict:** Multiple owners for single CPK (Flash Red).

### D. KNOWLEDGE MODE (The Immune System)
*   **Nodes:** `Qualification`, `Methodology`, `OrgUnit`.
*   **Edges:** `REQUIRES` (Unit -> Qualification), `COVERS` (Methodology -> Function).
*   **Visual Metaphor:** Clustering / Heatmap.
*   **Insights (Auto-Highlighting):**
    *   **Blind Spots:** Functional areas with zero methodology coverage (Dark Gray zones).
    *   **Risk Zones:** High-risk functions with low qualification requirements (Red halo).

---

## 3. Overlays (Visual Layers)

Overlays act as filters or visual modifiers on top of the active Mode. Multiple overlays can be active simultaneously, but usually one is dominant.

1.  **Lifecycle Layer:**
    *   **Draft:** Dotted outline, 50% opacity.
    *   **Active:** Solid outline, 100% opacity.
    *   **Archived:** Grayed out, minimal contrast.
2.  **Signal Heat Layer (The Health Check):**
    *   Applies a color tint (Green/Yellow/Red) to nodes based on their aggregated health signal (from OFS Executive Snapshot).
    *   *Example:* If "Marketing" has a Red 'Function' signal, the node glows red in Structure Mode.
3.  **Scenario Delta Layer:**
    *   **Added/New:** Green dashed border + "Plus" badge.
    *   **Modified:** Yellow border + "Delta" badge.
    *   **Removed:** Red strike-through or ghosted appearance.

---

## 4. Interaction Rules

### Mouse Interaction
*   **Hover:**
    *   Triggers "X-Ray" effect: dims all unrelated nodes (opacity 0.1), highlights connected neighbors (opacity 1.0).
    *   Shows a minimalist "HUD" tooltip: Title, Type, Status Signal.
*   **Click:**
    *   **Focus:** Centers the camera on the node.
    *   **Drill-down:** If applicable, expands the node to show children (sub-graph).
    *   **Side Panel:** Opens a read-only side panel with detailed metadata (ID, Description, Links).
*   **Drag:**
    *   Panning the canvas. Nodes are generally pinned but physics can be "nudged".

### Navigation
*   **Breadcrumbs:** Shows the path from Root > Current Focus. Clickable to traverse up.
*   **Search:** "Spotlight" search to instantly locate and zoom to a node by name or ID.
*   **Signal Snap:** Clicking a signal in the `Executive Snapshot` automatically creates a Graph View URL that:
    1.  Sets the appropriate Mode.
    2.  Activates the Signal Heat overlay.
    3.  Focuses/Zooms on the problematic node(s).

---

## 5. Scenario Mode Behavior

When the global application state is in `Scenario Mode`:
1.  **Visual Banner:** A prominent "SCENARIO PREVIEW" strip at the top of the viewport.
2.  **Graph Topology:** The graph renders the *future state*, not the current state.
3.  **Difference Visualization:**
    *   Original connections that are broken are shown as faint red ghost lines.
    *   New connections are shown as animated green dashed lines (marching ants effect).
4.  **No Commitment:** "Apply" actions are strictly forbidden within the Graph. It is a visualization tool only.

---

## 6. Performance & Tech Constraints

*   **In-Memory Only:** The graph is constructed on the fly from the Registry Read-Adapter JSON response.
*   **Limit:** Optimized for up to 500 nodes.
    *   *Strategy:* If >500 nodes, render only the top 2 levels of hierarchy initially. Use "Lazy Load" or "Semantic Loom" to expand branches only when focused.
*   **Rendering:** Canvas or SVG (via libraries like React Flow or D3 / VisX). Performance over prettiness.

---

## 7. UX Anti-Patterns (FORBIDDEN)

*   ❌ **Complex UML Notation:** No crow's feet, diamonds, or obscure symbols. Use clear, simple shapes (Circles/Rectangles).
*   ❌ **Text Overload:** Do not print descriptions inside nodes. Title only.
*   ❌ **Tables inside Nodes:** The node is an atomic concept, not a database row view.
*   ❌ **Editable Anchors:** No "drag to connect". This is read-only.
*   ❌ **Metrics Clutter:** Do not show numeric gauges or charts on graph nodes. Keep it semantic.

---

## 8. WAU-Factors

1.  **"Breathing" Graph:** Use subtle animations for "living" signals (e.g., a slow pulse for healthy nodes, a jagged jitter for alerts).
2.  **Semantic Zoom:** At high altitude, show clusters and heatmaps. As you zoom in, reveal labels and connection types.
3.  **Instant Filter:** Clicking "Show only Critical Path" hides 80% of the noise instantly.
