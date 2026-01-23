import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Node {
    urn: string;
    label: string;
    type: string;
    x?: number;
    y?: number;
}

interface Edge {
    id: string;
    source: string;
    target: string;
    label: string;
}

interface EntityGraphViewerProps {
    urn: string;
    viewType: 'neighborhood' | 'extended';
    snapshotId?: string;
    onNavigate: (urn: string) => void;
}

export const EntityGraphViewer: React.FC<EntityGraphViewerProps> = ({ urn, viewType, snapshotId, onNavigate }) => {
    const [graph, setGraph] = useState<{ nodes: Node[], edges: Edge[] } | null>(null);
    const [loading, setLoading] = useState(false);

    // Canvas Size
    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/registry/graph/context/${urn}`, { params: { view: viewType, snapshotId } })
            .then(res => {
                const data = res.data;
                // Simple Layout Algorithm: Radial
                // Center Node = The requesting URN
                // Others = circle around
                const nodes = data.nodes.map((n: Node, index: number) => {
                    if (n.urn === urn) {
                        return { ...n, x: centerX, y: centerY };
                    }
                    // For others, we distribute visually (simplified for Demo)
                    // Real impl might use D3 force sim, keeping it static for "No Logic" req?
                    // Let's do simple distribution based on index
                    const angle = ((index) / (data.nodes.length - 1)) * 2 * Math.PI;
                    const radius = 150;
                    return {
                        ...n,
                        x: centerX + radius * Math.cos(angle),
                        y: centerY + radius * Math.sin(angle)
                    };
                });
                setGraph({ nodes, edges: data.edges });
            })
            .finally(() => setLoading(false));
    }, [urn, viewType, snapshotId]);

    if (loading) return <div>Loading Graph...</div>;
    if (!graph) return <div>Нет данных</div>;

    const getNode = (urn: string) => graph.nodes.find(n => n.urn === urn);

    return (
        <div className="border rounded bg-white p-4 overflow-hidden">
            <h3 className="text-sm font-bold text-gray-500 mb-2">
                Серверный вид: {viewType.toUpperCase()}
            </h3>
            <svg width={width} height={height} className="bg-gray-50 border">
                {/* Edges */}
                {graph.edges.map(edge => {
                    const s = getNode(edge.source);
                    const t = getNode(edge.target);
                    if (!s || !t || !s.x || !s.y || !t.x || !t.y) return null;
                    return (
                        <g key={edge.id}>
                            <line
                                x1={s.x} y1={s.y}
                                x2={t.x} y2={t.y}
                                stroke="#999"
                                strokeWidth="2"
                                markerEnd="url(#arrowhead)"
                            />
                            <text
                                x={(s.x + t.x) / 2}
                                y={(s.y + t.y) / 2}
                                fontSize="10"
                                textAnchor="middle"
                                fill="#666"
                            >
                                {edge.label}
                            </text>
                        </g>
                    );
                })}

                {/* Nodes */}
                {graph.nodes.map(node => (
                    <g
                        key={node.urn}
                        transform={`translate(${node.x},${node.y})`}
                        onClick={() => onNavigate(node.urn)}
                        className="cursor-pointer hover:opacity-80"
                    >
                        <circle r="20" fill={node.urn === urn ? '#3b82f6' : '#9ca3af'} />
                        <text y="35" fontSize="12" textAnchor="middle" fill="#333" fontWeight="bold">
                            {node.label}
                        </text>
                        <title>{node.urn} ({node.type})</title>
                    </g>
                ))}

                {/* Arrow Definition */}
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#999" />
                    </marker>
                </defs>
            </svg>
        </div>
    );
};
