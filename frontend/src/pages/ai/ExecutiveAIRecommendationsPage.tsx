import React, { useState } from 'react';
import { useAnalyzeEntityQuery } from '../../features/ai/aiApi';
import AIAdvisoryBanner from '../../components/ai/AIAdvisoryBanner';
import {
    Zap,
    ShieldAlert,
    LayoutDashboard,
    TrendingUp,
    Layers,
    ChevronDown,
    Activity,
    Loader2
} from 'lucide-react';
import RecommendationDetailsDrawer from '../../components/ai/RecommendationDetailsDrawer';

const ExecutiveAIRecommendationsPage: React.FC = () => {
    // Analyzing 'system' (global) or a major department
    const { data, isLoading, error } = useAnalyzeEntityQuery({ entityType: 'department', id: 'system-global' });
    const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white flex items-center gap-4 tracking-tighter">
                        <Activity className="w-12 h-12 text-indigo-500" />
                        AI EXECUTIVE INTEL
                    </h1>
                    <p className="text-gray-400 font-light max-w-xl">
                        Интеллектуальный мониторинг системных процессов, узких мест и рисков на уровне всей организации.
                        Агрегированные данные без деанонимизации.
                    </p>
                </div>
                <div className="px-6 py-3 bg-gray-900 border border-gray-800 rounded-2xl flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Confidence Index</span>
                        <span className="text-xl font-black text-white">94%</span>
                    </div>
                    <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: '94%' }}></div>
                    </div>
                </div>
            </header>

            <AIAdvisoryBanner />

            {/* System Aggregate Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard label="Критические риски" value="2" color="text-rose-500" icon={<ShieldAlert />} />
                <StatsCard label="Оптимизации" value="5" color="text-amber-500" icon={<Zap />} />
                <StatsCard label="Стабильность потока" value="HIGH" color="text-emerald-500" icon={<Layers />} />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="text-gray-500 animate-pulse uppercase tracking-[0.3em] font-black text-[11px]">Сканируем узкие места системы...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                        Системные предложения
                        <div className="h-px flex-1 bg-gray-900"></div>
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {data?.recommendations.map((rec) => (
                            <div
                                key={rec.id}
                                className="group p-6 bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-800 rounded-3xl hover:border-indigo-500/40 transition-all cursor-pointer shadow-lg"
                                onClick={() => setSelectedRecommendation(rec)}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-3 rounded-2xl bg-black/40 border border-gray-800/80`}>
                                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <span className="bg-gray-900 px-3 py-1 rounded-full text-[9px] font-black text-gray-400 border border-gray-800 uppercase tracking-widest group-hover:border-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                                        {rec.category}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-indigo-200 transition-colors">
                                    {rec.title}
                                </h3>
                                <p className="text-sm text-gray-400 font-light leading-relaxed line-clamp-2">
                                    {rec.reasoning}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedRecommendation && (
                <RecommendationDetailsDrawer
                    recommendation={selectedRecommendation}
                    onClose={() => setSelectedRecommendation(null)}
                />
            )}
        </div>
    );
};

const StatsCard = ({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) => (
    <div className="p-6 bg-gray-900/40 border border-gray-800 rounded-3xl hover:border-gray-700 transition-colors">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-black/40 border border-gray-800 rounded-xl text-gray-400">
                {icon}
            </div>
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{label}</span>
        </div>
        <div className={`text-3xl font-black ${color}`}>{value}</div>
    </div>
);

export default ExecutiveAIRecommendationsPage;
