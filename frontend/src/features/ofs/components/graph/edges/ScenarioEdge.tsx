import { memo } from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

export interface ScenarioEdgeData {
    scenarioDelta?: 'ADDED' | 'REMOVED' | 'UNCHANGED';
}

const ScenarioEdge = ({

    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}: EdgeProps<ScenarioEdgeData>) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const delta = data?.scenarioDelta || 'UNCHANGED';

    let edgeStyle = { ...style };

    if (delta === 'ADDED') {
        edgeStyle = {
            ...edgeStyle,
            stroke: '#22c55e', // green-500
            strokeDasharray: '5,5',
            animation: 'dashdraw 0.5s linear infinite', // Needs css keyframes or reactflow's 'animated' prop
            strokeWidth: 2,
        };
    } else if (delta === 'REMOVED') {
        edgeStyle = {
            ...edgeStyle,
            stroke: '#f87171', // red-400
            strokeOpacity: 0.4,
            strokeDasharray: '2,2',
            strokeWidth: 1,
        };
    } else {
        // Standard style
        edgeStyle = {
            ...edgeStyle,
            stroke: '#94a3b8', // slate-400
            strokeWidth: 1.5,
        };
    }

    // Note: For the 'animated' effect to fully work like "marching ants", 
    // we usually rely on React Flow's `animated={true}` prop or custom CSS class. 
    // We'll use the style object here.

    return (
        <BaseEdge
            path={edgePath}
            markerEnd={markerEnd}
            style={edgeStyle}
        />
    );
};

export default memo(ScenarioEdge);
