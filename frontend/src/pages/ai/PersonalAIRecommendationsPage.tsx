import React, { useState } from 'react';
import { useAuth } from '../../features/auth/useAuth';
import { useAnalyzeEntityQuery } from '../../features/ai/aiApi';
import AIAdvisoryBanner from '../../components/ai/AIAdvisoryBanner';
import {
    Brain,
    ChevronRight,
    AlertTriangle,
    Zap,
    ShieldCheck,
    Info,
    Loader2
} from 'lucide-react';
import RecommendationDetailsDrawer from '../../components/ai/RecommendationDetailsDrawer';

const PersonalAIRecommendationsPage: React.FC = () => {
    const { user } = useAuth();
    const { data, isLoading, error } = useAnalyzeEntityQuery(
        { entityType: 'employee', id: user?.id || '' },
        { skip: !user?.id }
    );
    const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'risk': return <AlertTriangle className="w-4 h-4 text-rose-400" />;
            case 'optimization': return <Zap className="w-4 h-4 text-amber-400" />;
            case 'compliance': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
            default: return <Info className="w-4 h-4 text-indigo-400" />;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            default: return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-black text-white flex items-center gap-4 mb-2 tracking-tight">
                    <Brain className="w-10 h-10 text-indigo-500" />
                    AI Персональные Рекомендации
                </h1>
                <p className="text-gray-400 font-light">
                    Умные советы по оптимизации вашей деятельности и минимизации рисков на основе анализа данных MatrixGin.
                </p>
            </header>

            <AIAdvisoryBanner />

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    <p className="text-gray-500 animate-pulse uppercase tracking-[0.2em] font-bold text-[10px]">Анализируем контекст...</p>
                </div>
            ) : error ? (
                <div className="p-12 text-center border border-dashed border-gray-800 rounded-3xl">
                    <p className="text-gray-500 italic">Не удалось получить рекомендации. Пожалуйста, попробуйте позже.</p>
                </div>
            ) : data?.recommendations.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-gray-800 rounded-3xl">
                    <p className="text-gray-500 italic">На текущий момент AI-советник не видит критических областей для улучшения.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {data?.recommendations.map((rec) => (
                        <div
                            key={rec.id}
                            className="group p-5 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden"
                            onClick={() => setSelectedRecommendation(rec)}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                {getCategoryIcon(rec.category)}
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${getSeverityColor(rec.severity)}`}>
                                            {rec.severity}
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                            {getCategoryIcon(rec.category)}
                                            {rec.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-100 group-hover:text-indigo-300 transition-colors uppercase tracking-tight">
                                        {rec.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 line-clamp-1 max-w-2xl font-light">
                                        {rec.reasoning}
                                    </p>
                                </div>
                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors group/btn">
                                    Подробнее
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
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

export default PersonalAIRecommendationsPage;
