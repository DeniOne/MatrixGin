import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foundationApi } from '../../features/foundation/api/foundation.api';
import { FoundationBlockType } from '../../features/foundation/types/foundation.types';
import { FOUNDATION_CONTENT, BLOCK_ORDER } from '../../features/foundation/data/foundation.content';
import { ArrowRight, CheckCircle, Lock } from 'lucide-react';

export const BlockPage: React.FC = () => {
    const { blockId } = useParams<{ blockId: string }>();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    // Type guard for blockId
    const currentBlockId = blockId as FoundationBlockType;
    const content = FOUNDATION_CONTENT[currentBlockId];

    if (!content) {
        return <div className="text-center p-8 text-red-500">Неверный ID Блока</div>;
    }

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            // 1. Mark as viewed
            await foundationApi.markBlockViewed({ blockId: currentBlockId });

            // 2. Determine next step
            const currentIndex = BLOCK_ORDER.indexOf(currentBlockId);
            const nextBlockId = BLOCK_ORDER[currentIndex + 1];

            if (nextBlockId) {
                navigate(`/foundation/immersion/${nextBlockId}`);
            } else {
                // End of blocks -> Decision
                navigate('/foundation/decision');
            }
        } catch (error) {
            console.error('Failed to log block view', error);
            // In strict mode, we might want to alert user.
            // For now, allow retry.
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-0">
            {/* Header / Progress Indicator (Simple) */}
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Блок {BLOCK_ORDER.indexOf(currentBlockId) + 1} из {BLOCK_ORDER.length}
                </span>
                <div className="flex space-x-1">
                    {BLOCK_ORDER.map((bid) => (
                        <div
                            key={bid}
                            className={`h-2 w-2 rounded-full ${bid === currentBlockId ? 'bg-blue-600' :
                                BLOCK_ORDER.indexOf(bid) < BLOCK_ORDER.indexOf(currentBlockId) ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="p-8 md:p-10">
                <div className="flex items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900">{content.title}</h2>
                </div>

                <div className="prose prose-lg text-gray-700 space-y-8">
                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Значение</h3>
                        <p className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 text-blue-900">
                            {content.meaning}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 text-red-700">Последствия</h3>
                        <p className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 text-red-900 font-medium">
                            {content.consequences}
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <button
                        onClick={handleConfirm}
                        disabled={submitting}
                        className={`
                            w-full flex justify-center items-center px-6 py-4 rounded-lg text-lg font-bold shadow-md transition-all
                            ${submitting
                                ? 'bg-gray-100 text-gray-400 cursor-wait'
                                : 'bg-gray-900 text-white hover:bg-black hover:scale-[1.01]'
                            }
                        `}
                    >
                        {submitting ? 'Проверка...' : (
                            <>
                                Понимаю и Принимаю
                                <CheckCircle className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Нажимая, вы подтверждаете прочтение блока. <br />
                        Действие записано в лог.
                    </p>
                </div>
            </div>
        </div>
    );
};
