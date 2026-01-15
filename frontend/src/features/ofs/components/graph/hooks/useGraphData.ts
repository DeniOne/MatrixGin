import { useState, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { GraphMode, OverlayType, OFSNodeData } from '../types';
import { transformData } from '../utils/transformers';
import { useLayout } from './useLayout';
import { useGetDepartmentsQuery } from '../../../api/ofsApi';

export const useGraphData = (
    mode: GraphMode,
    activeOverlays: OverlayType[]
) => {
    const [nodes, setNodes] = useState<Node<OFSNodeData>[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    // Use Real API Hook
    // We request 'flat' format to get raw list easier to transform, or 'tree' if preferred.
    // Based on existing code, departments endpoint probably returns flat list or tree. 
    // Let's assume the API returns what we need. 
    // Checking ofsApi.ts -> getDepartments returns { data: Department[] }.
    const { data: response, isLoading: apiLoading } = useGetDepartmentsQuery({});

    const { getLayoutedElements } = useLayout();

    useEffect(() => {
        if (!response?.data) return;

        const processGraph = () => {
            // 1. Transform Real Data
            const { nodes: rawNodes, edges: rawEdges } = transformData(
                response.data,
                mode,
                activeOverlays
            );

            // 2. Apply Layout
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                rawNodes,
                rawEdges,
                mode
            );

            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        };

        processGraph();
    }, [response, mode, activeOverlays, getLayoutedElements]);

    return { nodes, edges, loading: apiLoading };
};
