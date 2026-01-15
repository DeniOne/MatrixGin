import { Node, Edge } from 'reactflow';

// --- Global Modes & Overlays ---

export type GraphMode =
    | 'STRUCTURE'  // Depts, Hierarchies
    | 'FUNCTION'   // Business Functions, Owners
    | 'CPK'        // Value Chain, Products
    | 'KNOWLEDGE'; // Methodologies, Qualifications

export type OverlayType =
    | 'LIFECYCLE'      // Draft/Active/Archived
    | 'SIGNAL_HEAT'    // Health signals (Green/Red/Yellow)
    | 'SCENARIO_DELTA'; // New/Modified/Deleted in Scenario

export type SignalLevel = 'GREEN' | 'YELLOW' | 'RED' | 'GRAY';
export type ScenarioDelta = 'ADDED' | 'MODIFIED' | 'REMOVED' | 'UNCHANGED';

// --- Node Data Definitions ---

export interface OFSNodeData {
    // Core Metadata
    id: string;
    label: string;
    type: string; // 'OrgUnit', 'product', 'role', etc.

    // Overlay: Lifecycle
    lifecycleState: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

    // Overlay: Signal Heat
    signalLevel?: SignalLevel;
    signalMessage?: string; // Tooltip text

    // Overlay: Scenario Delta
    scenarioDelta?: ScenarioDelta;

    // Interaction
    isFocused?: boolean;
}

// Re-export React Flow types for convenience
export type OFSNode = Node<OFSNodeData>;
export type OFSEdge = Edge;
