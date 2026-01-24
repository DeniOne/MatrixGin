import React from 'react';
import { X, HelpCircle, FileSearch } from 'lucide-react';
import AISnapshotViewer from './AISnapshotViewer';
import RecommendationFeedbackPanel from './RecommendationFeedbackPanel';

interface RecommendationDetailsDrawerProps {
    recommendation: any;
    onClose: () => void;
}

const RecommendationDetailsDrawer: React.FC<RecommendationDetailsDrawerProps> = ({ recommendation, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" onClick={onClose}></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white border-l border-black/10 h-full p-8 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center mb-10">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <HelpCircle className="w-5 h-5 text-indigo-600" />
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#F3F3F5] rounded-lg transition-colors">
                        <X className="w-6 h-6 text-[#717182]" />
                    </button>
                </div>

                <div className="flex-1 space-y-10 overflow-y-auto pr-2">
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-medium uppercase tracking-widest text-indigo-600">Рекомендация</span>
                            <div className="h-px flex-1 bg-white/5"></div>
                        </div>
                        <h2 className="text-2xl font-medium text-[#030213] leading-tight uppercase tracking-tight">
                            {recommendation.title}
                        </h2>
                        <p className="text-[#717182] leading-relaxed font-light">
                            {recommendation.reasoning}
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-medium uppercase tracking-widest text-amber-600">Обоснование (Почему?)</span>
                            <div className="h-px flex-1 bg-white/5"></div>
                        </div>

                        <div className="space-y-6">
                            <AISnapshotViewer data={recommendation.basedOn} />

                            <div className="space-y-3">
                                <h4 className="text-[11px] font-medium text-[#717182] uppercase tracking-widest pl-1">Выявленные связи:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(recommendation.basedOn?.relations || ['Standard Hierarchy']).map((rel: string) => (
                                        <span key={rel} className="bg-[#F3F3F5] px-3 py-1.5 rounded-lg border border-black/5 text-[10px] text-[#717182] flex items-center gap-1.5">
                                            <FileSearch className="w-3 h-3 text-indigo-600" />
                                            {rel}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {recommendation.basedOn?.impacts && (
                                <div className="space-y-3">
                                    <h4 className="text-[11px] font-medium text-[#717182] uppercase tracking-widest pl-1">Типы воздействия:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {recommendation.basedOn.impacts.map((impact: string) => (
                                            <span key={impact} className="bg-[#F3F3F5] px-3 py-1.5 rounded-lg border border-black/5 text-[10px] text-[#717182] uppercase font-medium">
                                                {impact}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* PHASE 4.5 - Feedback Panel */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-600">Ваш отзыв</span>
                            <div className="h-px flex-1 bg-white/5"></div>
                        </div>
                        <RecommendationFeedbackPanel
                            recommendationId={recommendation.id}
                            snapshotId={recommendation.snapshotId}
                            aiVersion={recommendation.aiVersion}
                            ruleSetVersion={recommendation.ruleSetVersion}
                        />
                    </section>
                </div>

                <div className="mt-8 pt-8 border-t border-black/5 text-[9px] text-[#717182] uppercase tracking-widest font-medium">
                    ID: {recommendation.id} • AI Advisory Layer v1.0
                </div>
            </div>
        </div>
    );
};

export default RecommendationDetailsDrawer;

