import dagre from 'dagre';
import { Node, Edge, Position } from 'reactflow';
import { useCallback } from 'react';
import { GraphMode } from '../types';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;

export const useLayout = () => {
    const getLayoutedElements = useCallback(
        (nodes: Node[], edges: Edge[], mode: GraphMode) => {
            const g = new dagre.graphlib.Graph();

            // Adaptation: Different directions for different modes
            // CPK = Left-to-Right (Pipeline)
            // STRUCTURE = Top-Down (Hierarchy)
            // FUNCTION = Left-Right or Top-Down
            const rankDir = mode === 'CPK' ? 'LR' : 'TB';

            g.setGraph({
                rankdir: rankDir,
                nodesep: 50,
                ranksep: 80
            });

            g.setDefaultEdgeLabel(() => ({}));

            // 1. Add nodes to dagre
            nodes.forEach((node) => {
                g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
            });

            // 2. Add edges to dagre
            edges.forEach((edge) => {
                g.setEdge(edge.source, edge.target);
            });

            // 3. Run layout
            dagre.layout(g);

            // 4. Hydrate nodes with new positions
            const layoutedNodes = nodes.map((node) => {
                const nodeWithPosition = g.node(node.id);

                // Dagre returns center coords, React Flow needs top-left
                // BUT React Flow handles are easier if we just pass simple x,y.
                // Actually React Flow handles relative position.
                // Let's standardise handle position based on direction.
                const isHorizontal = rankDir === 'LR';
                node.targetPosition = isHorizontal ? Position.Left : Position.Top;
                node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

                return {
                    ...node,
                    position: {
                        x: nodeWithPosition.x - NODE_WIDTH / 2,
                        y: nodeWithPosition.y - NODE_HEIGHT / 2,
                    },
                };
            });

            return { nodes: layoutedNodes, edges };
        },
        []
    );

    return { getLayoutedElements };
};
