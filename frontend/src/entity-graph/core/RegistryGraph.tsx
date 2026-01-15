/**
 * Registry Graph Component (Step 10 Canonical)
 * 
 * Renders read-only graph using ReactFlow.
 * Architecture:
 * - Fetches graph data from /api/graph/:entityType/:id?view=...
 * - Uses dagre for auto-layout
 * - Navigation on node click
 */

import React, { useEffect, useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    Position,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { Alert, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

// Types (should be imported from shared types in real app)
interface GraphNodeDto {
    id: string;
    entityType: string;
    label: string;
    urn: string;
}

interface GraphEdgeDto {
    id: string;
    source: string;
    target: string;
    label: string;
    relation: string;
}

interface GraphResponseDto {
    nodes: GraphNodeDto[];
    edges: GraphEdgeDto[];
}

// Layout helper
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 172;
    const nodeHeight = 36;

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = direction === 'LR' ? Position.Left : Position.Top;
        node.sourcePosition = direction === 'LR' ? Position.Right : Position.Bottom;

        // We shift the dagre node position (anchor=center center) to the top left
        // so it matches React Flow's anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
    });

    return { nodes, edges };
};

interface RegistryGraphProps {
    entityType: string;
    entityId: string;
    viewName: string;
}

export const RegistryGraph: React.FC<RegistryGraphProps> = ({ entityType, entityId, viewName }) => {
    const navigate = useNavigate();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchGraph = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Using fetch directly for minimal example, replace with your apiClient
            const token = localStorage.getItem('token'); // Simplistic auth
            const res = await fetch(`http://localhost:3000/api/graph/${entityType}/${entityId}?view=${viewName}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to fetch graph');
            }

            const data: GraphResponseDto = await res.json();

            // Transform to ReactFlow format
            const flowNodes: Node[] = data.nodes.map(n => ({
                id: n.id,
                data: { label: n.label, entityType: n.entityType, urn: n.urn },
                position: { x: 0, y: 0 }, // Will be set by layout
                type: 'default', // or custom
                style: {
                    border: n.id.includes(entityId) ? '2px solid #1890ff' : '1px solid #ddd',
                    background: n.id.includes(entityId) ? '#e6f7ff' : '#fff',
                    borderRadius: '4px',
                    padding: '8px',
                    width: '180px',
                    fontSize: '12px',
                    textAlign: 'center'
                }
            }));

            const flowEdges: Edge[] = data.edges.map(e => ({
                id: e.id,
                source: e.source,
                target: e.target,
                label: e.label,
                type: 'smoothstep',
                markerEnd: { type: MarkerType.ArrowClosed },
                style: { stroke: '#b1b1b7' }
            }));

            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(flowNodes, flowEdges);

            setNodes(layoutedNodes);
            setEdges(layoutedEdges);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [entityType, entityId, viewName, setNodes, setEdges]);

    useEffect(() => {
        fetchGraph();
    }, [fetchGraph]);

    const onNodeClick = (_: React.MouseEvent, node: Node) => {
        // Navigation Logic
        // Assuming node.data.entityType and node.id (format: type:id)
        // Extract real ID 
        // Logic: ID in graph is "type:id". 
        const realId = node.id.split(':').pop();
        if (realId && node.data.entityType) {
            navigate(`/app/entities/${node.data.entityType}/${realId}`);
        }
    };

    if (loading) return <Spin tip="Loading Graph..." className="w-full h-full flex justify-center items-center" />;
    if (error) return <Alert type="error" message={error} className="m-4" />;

    return (
        <div style={{ width: '100%', height: '600px', border: '1px solid #f0f0f0' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                fitView
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
};
