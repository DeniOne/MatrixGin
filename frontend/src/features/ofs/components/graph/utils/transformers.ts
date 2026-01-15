import { Node, Edge, MarkerType } from 'reactflow';
import { GraphMode, OverlayType, OFSNodeData } from '../types';
import { Department } from '../../../api/ofsApi';

// Helper to determine node signal (placeholders for now as API doesn't have signal yet)
const getSignal = (_: Department): 'GREEN' | 'YELLOW' | 'RED' | 'GRAY' => {
    // Logic can be expanded later. For now based on is_active
    return _.is_active ? 'GREEN' : 'GRAY';
};

const createNode = (
    id: string,
    label: string,
    type: string,
    activeOverlays: OverlayType[],
    signal?: 'GREEN' | 'YELLOW' | 'RED' | 'GRAY'
): Node<OFSNodeData> => {
    const showSignal = activeOverlays.includes('SIGNAL_HEAT');
    const showLifecycle = activeOverlays.includes('LIFECYCLE');
    const showScenario = activeOverlays.includes('SCENARIO_DELTA');

    return {
        id,
        type: 'ofsNode',
        position: { x: 0, y: 0 },
        data: {
            id,
            label,
            type,
            lifecycleState: showLifecycle ? 'ACTIVE' : 'ACTIVE',
            signalLevel: showSignal ? (signal || 'GRAY') : undefined,
            scenarioDelta: showScenario ? 'UNCHANGED' : undefined,
        },
    };
};

export const transformData = (
    departments: Department[],
    mode: GraphMode,
    activeOverlays: OverlayType[]
): { nodes: Node<OFSNodeData>[]; edges: Edge[] } => {

    let nodes: Node<OFSNodeData>[] = [];
    let edges: Edge[] = [];

    const deptsById = new Map(departments.map(d => [d.id, d]));

    // --- 1. STRUCTURE MODE ---
    if (mode === 'STRUCTURE') {
        // Nodes: Departments as OrgUnits
        nodes = departments.map(d => createNode(
            d.id,
            d.name,
            'OrgUnit',
            activeOverlays,
            getSignal(d)
        ));

        // Edges: Hierarchy
        departments.forEach(dept => {
            if (dept.parent_id && deptsById.has(dept.parent_id)) {
                edges.push({
                    id: `${dept.parent_id}-${dept.id}`,
                    source: dept.parent_id,
                    target: dept.id,
                    type: 'smoothstep',
                    markerEnd: { type: MarkerType.ArrowClosed },
                    style: { stroke: '#94a3b8' },
                });
            }
        });
    }

    // --- 2. FUNCTION MODE ---
    else if (mode === 'FUNCTION') {
        // Nodes: OrgUnits + Functions (extracted from dept.functions)
        nodes = departments.map(d => createNode(
            d.id,
            d.name,
            'OrgUnit',
            activeOverlays,
            getSignal(d)
        ));

        departments.forEach(dept => {
            // Extract functions from department if they exist
            if (dept.functions && dept.functions.length > 0) {
                dept.functions.forEach((funcName: string, idx: number) => {
                    const funcId = `func-${dept.id}-${idx}`;
                    // Add Function Node
                    nodes.push(createNode(funcId, funcName, 'Function', activeOverlays, 'GREEN'));

                    // Add OWNS Edge
                    edges.push({
                        id: `own-${dept.id}-${funcId}`,
                        source: dept.id,
                        target: funcId,
                        label: 'OWNS',
                        type: 'default',
                        style: { stroke: '#64748b', strokeDasharray: '4' },
                    });
                });
            }
        });
    }

    // --- 3. CPK & KNOWLEDGE MODES (Fallback) ---
    else {
        // Fallback: render structure
        nodes = departments.map(d => createNode(
            d.id,
            d.name,
            'OrgUnit',
            activeOverlays,
            getSignal(d)
        ));

        // Edges: Hierarchy for fallback
        departments.forEach(dept => {
            if (dept.parent_id && deptsById.has(dept.parent_id)) {
                edges.push({
                    id: `${dept.parent_id}-${dept.id}`,
                    source: dept.parent_id,
                    target: dept.id,
                    type: 'smoothstep',
                    markerEnd: { type: MarkerType.ArrowClosed },
                    style: { stroke: '#94a3b8' },
                });
            }
        });
    }

    return { nodes, edges };
};
