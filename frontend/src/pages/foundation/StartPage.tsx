import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { foundationApi } from '../../features/foundation/api/foundation.api';
import { FoundationStatus, ImmersionState } from '../../features/foundation/types/foundation.types';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

import { useGetMeQuery } from '../../features/auth/authApi';

export const StartPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [state, setState] = useState<ImmersionState | null>(null);
    const { refetch } = useGetMeQuery();

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const state = await foundationApi.getStatus();
            setState(state);
            // Intelligent Routing based on Status
            if (state.status === FoundationStatus.ACCEPTED) {
                await refetch(); // Sync user data with Redux
                navigate('/'); // Go to Dashboard
            } else if (state.status === FoundationStatus.IN_PROGRESS) {
                // Find first unlocked block
                const firstUnlocked = state.blocks.find(b => b.status !== 'COMPLETED');
                if (firstUnlocked) {
                    navigate(`/foundation/immersion/${firstUnlocked.id}`);
                } else {
                    navigate('/foundation/decision');
                }
            } else if (state.status === FoundationStatus.VERSION_MISMATCH) {
                // Stay here but show mismatch warning
                setError('Системные правила обновлены. Требуется повторное подтверждение.');
            }
            setIsLoading(false);
        } catch (err) {
            console.error('Foundation Status Check Failed', err);
            setError('Не удалось связаться с Ядром Университета. Пожалуйста, обновите страницу.'); // Robustness
            setIsLoading(false);
        }
    };

    const handleBegin = () => {
        if (state && state.blocks.length > 0) {
            // Start with the first block from the API (ordered)
            navigate(`/foundation/immersion/${state.blocks[0].id}`);
        } else {
            // Fallback just in case
            navigate('/foundation/immersion/CONSTITUTION');
        }
    };

    if (isLoading) return <div className="p-12 text-center text-[#717182]">Подключение к ядру...</div>;

    return (
        <div className="flex-grow flex flex-col items-center justify-center p-6 bg-[#F3F3F5]">
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl overflow-hidden border border-black/5 p-12">
                <div className="flex justify-center mb-8 text-amber-500">
                    <ShieldAlert size={64} strokeWidth={1.5} />
                </div>

                <h2 className="text-4xl font-medium text-center mb-6 text-[#030213] tracking-tight">Доступ ограничен</h2>

                <p className="text-lg text-[#030213]/80 mb-10 text-center leading-relaxed">
                    Добро пожаловать в Университет. <br />
                    Перед доступом к <strong className="text-[#030213]">Прикладным Знаниям</strong> и <strong className="text-[#030213]">Экономике</strong>,
                    вам необходимо завершить <strong className="text-indigo-600">Фундаментальное погружение</strong>.
                </p>

                {error && (
                    <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 mb-8">
                        <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 shrink-0" />
                            <p className="text-xs font-medium text-amber-900 uppercase tracking-wide">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleBegin}
                    className="w-full flex justify-center items-center px-8 py-5 text-lg font-medium rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-200 active:scale-[0.98]"
                >
                    Начать погружение
                    <ArrowRight className="ml-3 h-5 w-5" />
                </button>
            </div>

            <footer className="mt-12 text-center text-[#717182] text-[10px] font-medium uppercase tracking-[0.3em] opacity-60">
                <p>Операционная Система MatrixGin v2.2</p>
                <p className="mt-2">Доступ строго контролируется. Действия логируются.</p>
            </footer>
        </div>
    );
};
