import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { foundationApi } from '../../features/foundation/api/foundation.api';
import { FoundationStatus } from '../../features/foundation/types/foundation.types';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export const StartPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const state = await foundationApi.getStatus();
            // Intelligent Routing based on Status
            if (state.status === FoundationStatus.ACCEPTED) {
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
        // Start with Block 1 (Constitution)
        // Or fetch strict order from API types/constants
        navigate('/foundation/immersion/CONSTITUTION');
    };

    if (isLoading) return <div className="p-12 text-center text-gray-500">Подключение к ядру...</div>;

    return (
        <div className="p-8 md:p-12">
            <div className="flex justify-center mb-6 text-amber-500">
                <ShieldAlert size={64} />
            </div>

            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Доступ ограничен</h2>

            <p className="text-lg text-gray-600 mb-8 text-center leading-relaxed">
                Добро пожаловать в Университет. <br />
                Перед доступом к <strong>Прикладным Знаниям</strong> и <strong>Экономике</strong>,
                вам необходимо завершить <strong>Фундаментальное погружение</strong>.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-amber-700">
                            {error || "Этот процесс обязателен. Ваши действия фиксируются в Аудит-логе Фундамента."}
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={handleBegin}
                className="w-full flex justify-center items-center px-6 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-lg"
            >
                Начать погружение
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </button>
        </div>
    );
};
