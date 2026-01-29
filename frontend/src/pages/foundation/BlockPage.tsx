import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foundationApi } from '../../features/foundation/api/foundation.api';
import { FoundationBlockType, ImmersionState, FoundationBlock } from '../../features/foundation/types/foundation.types';
import { ArrowLeft, ArrowRight, CheckCircle, Lock, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { UniversalVideoPlayer } from '../../components/video/UniversalVideoPlayer';

export const BlockPage: React.FC = () => {
    const { blockId } = useParams<{ blockId: string }>();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [state, setState] = useState<ImmersionState | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadState();
    }, [blockId]);

    const loadState = async () => {
        try {
            const data = await foundationApi.getStatus();
            setState(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to load base state', error);
            setIsLoading(false);
        }
    };

    const currentBlockId = blockId as FoundationBlockType;
    const block = state?.blocks.find(b => b.id === currentBlockId);
    const blockOrder = state?.blocks.map(b => b.id) || [];

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!block) {
        return <div className="text-center p-8 text-red-500">Блок не найден или доступ ограничен</div>;
    }

    const handleConfirm = async () => {
        if (state?.status === FoundationStatus.ACCEPTED) {
            const currentIndex = blockOrder.indexOf(currentBlockId);
            const nextBlockId = blockOrder[currentIndex + 1];
            if (nextBlockId) {
                navigate(`/foundation/base/${nextBlockId}`);
            } else {
                navigate('/foundation/start', { state: { forceReview: true } });
            }
            return;
        }

        setSubmitting(true);
        try {
            await foundationApi.markBlockViewed({ blockId: currentBlockId });
            const currentIndex = blockOrder.indexOf(currentBlockId);
            const nextBlockId = blockOrder[currentIndex + 1];
            if (nextBlockId) {
                navigate(`/foundation/base/${nextBlockId}`);
            } else {
                navigate('/foundation/decision');
            }
        } catch (error) {
            console.error('[MatrixGin] Failed to log block view', error);
        } finally {
            setSubmitting(false);
        }
    };

    const isAccepted = state?.status === FoundationStatus.ACCEPTED;
    const isLockedByMethodology = block.isMethodologyViolated && !isAccepted;

    return (
        <div className="bg-[#F3F3F5] min-h-screen font-sans selection:bg-indigo-100/30">
            {/* Header (Geist Canon) */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-black/10 px-8 py-5">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/foundation/start', { state: { forceReview: true } })}
                            className="p-2 hover:bg-black/5 rounded-xl transition-colors mr-2"
                        >
                            <ArrowLeft size={20} className="text-[#030213]" />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#717182]">MatrixGin Base</span>
                            <span className="text-xs font-mono text-[#030213]/40 mt-1">Block {block.order} of {state?.blocks.length}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden sm:flex flex-col items-end mr-4">
                            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#717182]">Progress</span>
                            <span className="text-sm font-medium text-[#030213]">{Math.round((block.order / (state?.blocks.length || 1)) * 100)}%</span>
                        </div>
                        <div className="w-32 h-1.5 bg-black/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-600 transition-all duration-700 ease-out"
                                style={{ width: `${(block.order / (state?.blocks.length || 1)) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-8 py-24 pb-48">
                <div className="mb-20">
                    <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-medium uppercase tracking-widest mb-6 border border-indigo-100">
                        Canon v2.2
                    </div>
                    <h2 className="text-6xl font-medium tracking-tight text-[#030213] leading-[1.1] mb-6">
                        {block.title}
                    </h2>
                    <p className="text-[#717182] text-xl font-normal max-w-2xl leading-relaxed">
                        {block.description || 'Фундаментальный принцип, определяющий работу системы MatrixGin.'}
                    </p>
                </div>

                {/* Video Section with Premium Container */}
                <div className="mb-20 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100/50 border border-black/5">
                    <UniversalVideoPlayer
                        src={block.videoUrl}
                        isRequired={block.isVideoRequired && !isAccepted}
                        title={block.title}
                    />
                </div>

                {/* Content Section - Enhanced Typography */}
                <article className="prose prose-slate max-w-none 
                    prose-headings:font-medium prose-headings:text-[#030213] prose-headings:tracking-tight
                    prose-p:text-[#030213]/80 prose-p:leading-relaxed prose-p:text-xl
                    prose-li:text-[#030213]/80 prose-li:text-xl
                    prose-strong:text-[#030213] prose-strong:font-medium
                    font-normal selection:bg-indigo-100">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {block.contentText || 'Контент временно недоступен.'}
                    </ReactMarkdown>
                </article>

                <footer className="mt-32 pt-16 border-t border-black/10">
                    <button
                        onClick={handleConfirm}
                        disabled={submitting || isLockedByMethodology}
                        className={`
                            w-full flex justify-between items-center px-10 py-7 rounded-[2rem] text-xl font-medium shadow-xl transition-all duration-400
                            ${submitting || isLockedByMethodology
                                ? 'bg-white border border-black/5 text-[#717182] cursor-not-allowed opacity-50'
                                : 'bg-black text-white hover:bg-[#030213] hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99]'
                            }
                        `}
                    >
                        {isLockedByMethodology ? (
                            <>
                                <span className="flex items-center"><Lock className="mr-4 h-6 w-6" /> Ожидание видео</span>
                                <span className="text-xs uppercase tracking-widest opacity-40">Methodology Gate</span>
                            </>
                        ) : submitting ? (
                            <div className="w-full flex justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>
                        ) : (
                            <>
                                <span>{isAccepted ? 'Далее' : 'Понимаю и принимаю'}</span>
                                <ArrowRight className="h-7 w-7" />
                            </>
                        )}
                    </button>

                    {isLockedByMethodology && (
                        <p className="mt-10 text-center text-[11px] font-medium uppercase tracking-[0.5em] text-amber-600/60 animate-pulse">
                            Requirement: Watch video to unlock content
                        </p>
                    )}

                    <div className="mt-16 flex items-center justify-center space-x-4 opacity-20">
                        <div className="h-px w-12 bg-black" />
                        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-black">MatrixGin Foundation Audit</span>
                        <div className="h-px w-12 bg-black" />
                    </div>
                </footer>
            </main>
        </div>
    );
};
