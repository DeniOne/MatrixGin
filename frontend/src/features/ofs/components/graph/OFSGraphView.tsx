import React, { useState, useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    NodeTypes,
    EdgeTypes,
    ReactFlowProvider,
    useReactFlow,
    Panel,
    Node
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X } from 'lucide-react';

import OFSNode from './nodes/OFSNode';
import ScenarioEdge from './edges/ScenarioEdge';
import { GraphToolbar } from './GraphToolbar';
import { useGraphData } from './hooks/useGraphData';
import { GraphMode, OverlayType } from './types';

// Register custom types
const nodeTypes: NodeTypes = {
    ofsNode: OFSNode,
};
const edgeTypes: EdgeTypes = {
    scenarioEdge: ScenarioEdge,
};

const OFSGraphContent = () => {
    // State
    const [mode, setMode] = useState<GraphMode>('STRUCTURE');
    const [activeOverlays, setActiveOverlays] = useState<OverlayType[]>([]);

    // Interaction State
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

    // React Flow hooks
    const { fitView, setCenter } = useReactFlow();

    // Data Hook (Fetched from API)
    const { nodes: dataNodes, edges: dataEdges, loading } = useGraphData(mode, activeOverlays);

    // -- EVENT HANDLERS --

    const handleModeChange = (newMode: GraphMode) => {
        setMode(newMode);
        setFocusedNodeId(null); // Reset focus on mode switch
        setTimeout(() => fitView({ duration: 800, padding: 0.2 }), 100);
    };

    const handleToggleOverlay = (overlay: OverlayType) => {
        setActiveOverlays(prev =>
            prev.includes(overlay)
                ? prev.filter(o => o !== overlay)
                : [...prev, overlay]
        );
    };

    // X-Ray Hover
    const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
        setHoveredNodeId(node.id);
    }, []);

    const onNodeMouseLeave = useCallback(() => {
        setHoveredNodeId(null);
    }, []);

    // Focus
    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        // Focus logic: Center on node with zoom
        const x = node.position.x + (node.width ?? 150) / 2;
        const y = node.position.y + (node.height ?? 50) / 2;
        setCenter(x, y, { zoom: 1.5, duration: 800 });
        setFocusedNodeId(node.id);
    }, [setCenter]);

    const onPaneClick = useCallback(() => {
        setFocusedNodeId(null); // Reset focus
        fitView({ duration: 500 }); // Reset camera
    }, [fitView]);

    const handleResetFocus = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFocusedNodeId(null);
        fitView({ duration: 500 });
    };

    // -- TRANSFORM NODES/EDGES FOR VIEW STATE --
    // We apply opacity logic here before passing to ReactFlow
    const viewNodes = dataNodes.map(node => {
        let opacity = 1;
        let isRelated = false;

        // X-Ray Logic
        if (hoveredNodeId) {
            isRelated = node.id === hoveredNodeId ||
                dataEdges.some(e =>
                    (e.source === hoveredNodeId && e.target === node.id) ||
                    (e.target === hoveredNodeId && e.source === node.id)
                );
            opacity = isRelated ? 1 : 0.2;
        }
        // Focus Logic (override hover)
        else if (focusedNodeId) {
            isRelated = node.id === focusedNodeId;
            // We can keep everything visible but highlight focused, 
            // or dim others. Let's dim others slightly.
            opacity = isRelated ? 1 : 0.5;
        }

        return {
            ...node,
            style: { ...node.style, opacity, transition: 'opacity 0.2s' },
            data: {
                ...node.data,
                isFocused: node.id === focusedNodeId
            }
        };
    });

    const viewEdges = dataEdges.map(edge => {
        let opacity = 1;
        if (hoveredNodeId) {
            const isRelated = edge.source === hoveredNodeId || edge.target === hoveredNodeId;
            opacity = isRelated ? 1 : 0.1;
        } else if (focusedNodeId) {
            opacity = 0.5; // Dim edges in focus mode unless we implement full path traversal
        }

        return {
            ...edge,
            style: { ...edge.style, opacity, transition: 'opacity 0.2s' }
        };
    });


    // Loading / Empty States
    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 font-mono animate-pulse">
                ЗАГРУЗКА ДАННЫХ...
            </div>
        );
    }

    if (!loading && dataNodes.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 font-mono gap-2">
                <span>НЕДОСТАТОЧНО ДАННЫХ</span>
                <button
                    onClick={() => window.location.reload()}
                    className="text-xs text-blue-500 hover:underline"
                >
                    Повторить
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative bg-slate-50">
            <ReactFlow
                nodes={viewNodes}
                edges={viewEdges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodeClick={onNodeClick}
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
                onPaneClick={onPaneClick}
                fitView
                minZoom={0.2}
                maxZoom={4}
                defaultEdgeOptions={{
                    type: 'smoothstep',
                    animated: false,
                    style: { stroke: '#cbd5e1', strokeWidth: 1.5 }
                }}
                proOptions={{ hideAttribution: true }}
            >
                <Background gap={20} color="#e2e8f0" />
                <Controls showInteractive={false} />

                {/* Scenario Banner */}
                {activeOverlays.includes('SCENARIO_DELTA') && (
                    <Panel position="top-center" className="m-0 p-0">
                        <div className="bg-amber-100 border-b border-amber-300 text-amber-800 px-4 py-1 text-xs font-bold uppercase tracking-widest shadow-sm">
                            Scenario Preview Mode
                        </div>
                    </Panel>
                )}

                {/* Focus/Reset Breadcrumb */}
                {focusedNodeId && (
                    <Panel position="top-left" className="m-4">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md border border-slate-200">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-xs font-semibold text-slate-600">Фокус-режим</span>
                            <button
                                onClick={handleResetFocus}
                                className="ml-2 p-0.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    </Panel>
                )}
            </ReactFlow>

            <GraphToolbar
                currentMode={mode}
                onModeChange={handleModeChange}
                activeOverlays={activeOverlays}
                onToggleOverlay={handleToggleOverlay}
            />
        </div>
    );
};

// Provider Wrapper
const OFSGraphView = () => {
    return (
        <ReactFlowProvider>
            <OFSGraphContent />
        </ReactFlowProvider>
    );
};

export default OFSGraphView;
