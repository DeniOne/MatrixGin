import React from 'react';
import { Database } from 'lucide-react';

interface AISnapshotViewerProps {
    data: any;
}

const AISnapshotViewer: React.FC<AISnapshotViewerProps> = ({ data }) => {
    // This is a simplified viewer for the input data (graph/impact) used by the AI
    if (!data) return null;

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mt-6">
            <div className="bg-gray-800/50 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Database className="w-3 h-3 text-indigo-400" />
                    Input Data Snapshot
                </span>
                <span className="text-[9px] text-gray-500 italic">Anonymized View</span>
            </div>

            <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-black/20 rounded-xl border border-gray-800/30">
                        <div className="text-[9px] text-gray-500 uppercase font-black mb-1">Graph Nodes</div>
                        <div className="text-sm font-bold text-gray-200">{data.nodes?.length || 0} Entities</div>
                    </div>
                    <div className="p-3 bg-black/20 rounded-xl border border-gray-800/30">
                        <div className="text-[9px] text-gray-500 uppercase font-black mb-1">Impact Vectors</div>
                        <div className="text-sm font-bold text-gray-200">{data.impacts?.length || 0} Analysis Groups</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h5 className="text-[9px] text-gray-500 uppercase font-black px-1">Active Rulesets</h5>
                    <div className="flex flex-wrap gap-2">
                        {['Registry-Logic-v2', 'Safety-Guard-R0', 'Efficiency-Ops'].map(rule => (
                            <span key={rule} className="text-[8px] bg-indigo-500/5 text-indigo-400/70 border border-indigo-500/10 px-2 py-0.5 rounded uppercase font-bold">
                                {rule}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AISnapshotViewer;
