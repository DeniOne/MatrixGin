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
            console.error('Failed to load immersion state', error);
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
        setSubmitting(true);
        console.log(`[MatrixGin] Confirming block: ${currentBlockId}`);
        try {
            await foundationApi.markBlockViewed({ blockId: currentBlockId });

            const currentIndex = blockOrder.indexOf(currentBlockId);
            const nextBlockId = blockOrder[currentIndex + 1];

            if (nextBlockId) {
                navigate(`/foundation/immersion/${nextBlockId}`);
            } else {
                navigate('/foundation/decision');
            }
        } catch (error) {
            console.error('[MatrixGin] Failed to log block view', error);
        } finally {
            setSubmitting(false);
        }
    };

    const isLockedByMethodology = block.isMethodologyViolated;

    return (
        <div className="bg-[#F3F3F5] min-h-screen font-sans selection:bg-indigo-100/30">
            {/* Header (Geist Canon) */}
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-black/5 px-8 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#717182]">Foundation Gate</span>
                        <div className="h-3 w-px bg-black/10" />
                        <span className="text-xs font-medium text-[#030213]">{block.order} — 05</span>
                    </div>
                    <div className="w-48 h-1 bg-black/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-1000 ease-out"
                            style={{ width: `${(block.order / 5) * 100}%` }}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-8 py-20 pb-40">
                <div className="mb-14">
                    <h2 className="text-5xl font-medium tracking-tight text-[#030213] leading-tight mb-4">
                        {block.title}
                    </h2>
                    <p className="text-[#717182] text-lg">Блок фундаментального обучения (v2.2)</p>
                </div>

                {/* Video Section */}
                <div className="mb-14">
                    <UniversalVideoPlayer
                        src={block.videoUrl}
                        isRequired={block.isVideoRequired}
                        title={block.title}
                    />
                </div>

                {/* Content Section */}
                <article className="prose prose-slate max-w-none prose-headings:font-medium prose-headings:text-[#030213] prose-p:text-[#030213]/80 prose-li:text-[#030213]/80 leading-relaxed text-xl font-normal">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {block.contentText || 'Контент временно недоступен.'}
                    </ReactMarkdown>
                </article>

                <footer className="mt-28 pt-12 border-t border-black/5">
                    <button
                        onClick={handleConfirm}
                        disabled={submitting || isLockedByMethodology}
                        className={`
                            w-full flex justify-center items-center px-8 py-6 rounded-2xl text-lg font-medium shadow-sm transition-all duration-300
                            ${submitting || isLockedByMethodology
                                ? 'bg-white border border-black/5 text-[#717182] cursor-not-allowed'
                                : 'bg-black text-white hover:bg-[#030213] hover:shadow-2xl active:scale-[0.99]'
                            }
                        `}
                    >
                        {isLockedByMethodology ? (
                            <>
                                <Lock className="mr-3 h-5 w-5" />
                                Ожидание видео-дублирования
                            </>
                        ) : submitting ? (
                            <Loader2 className="animate-spin h-6 w-6" />
                        ) : (
                            <>
                                Понимаю и принимаю
                                <CheckCircle className="ml-3 h-5 w-5" />
                            </>
                        )}
                    </button>

                    {isLockedByMethodology && (
                        <p className="mt-8 text-center text-[10px] font-medium uppercase tracking-[0.4em] text-red-500/60 animate-pulse">
                            Methodology Violation: v2.2 Geit Canon
                        </p>
                    )}

                    <p className="text-center text-[10px] font-medium uppercase tracking-[0.2em] text-[#717182] mt-8 opacity-40">
                        MatrixGin Foundation Audit System
                    </p>
                </footer>
            </main>
        </div>
    );
};
