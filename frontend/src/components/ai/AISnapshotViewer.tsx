import React from 'react';
import { Database } from 'lucide-react';

interface AISnapshotViewerProps {
    data: any;
}

const AISnapshotViewer: React.FC<AISnapshotViewerProps> = ({ data }) => {
    // This is a simplified viewer for the input data (graph/impact) used by the AI
    if (!data) return null;

    return (
        <div className="bg-white border border-black/10 rounded-2xl overflow-hidden mt-6">
            <div className="bg-gray-800/50 px-4 py-3 border-b border-black/10 flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-widest text-[#717182] flex items-center gap-2">
                    <Database className="w-3 h-3 text-indigo-400" />
                    Снимок входных данных
                </span>
                <span className="text-[9px] text-[#717182] italic">Анонимизированный вид</span>
            </div>

            <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/20 rounded-xl border border-black/10/30">
                        <div className="text-[9px] text-[#717182] uppercase font-medium mb-1">Узлы графа</div>
                        <div className="text-sm font-medium text-gray-200">{data.nodes?.length || 0} Сущности</div>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl border border-black/10/30">
                        <div className="text-[9px] text-[#717182] uppercase font-medium mb-1">Векторы влияния</div>
                        <div className="text-sm font-medium text-gray-200">{data.impacts?.length || 0} Группы анализа</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h5 className="text-[9px] text-[#717182] uppercase font-medium px-1">Активные правила</h5>
                    <div className="flex flex-wrap gap-2">
                        {['Registry-Logic-v2', 'Safety-Guard-R0', 'Efficiency-Ops'].map(rule => (
                            <span key={rule} className="text-[8px] bg-indigo-500/5 text-indigo-400/70 border border-indigo-500/10 px-2 py-0.5 rounded uppercase font-medium">
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
