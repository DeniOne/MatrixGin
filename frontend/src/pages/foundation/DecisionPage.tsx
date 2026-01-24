import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { foundationApi } from '../../features/foundation/api/foundation.api';
import { AlertCircle, Scale } from 'lucide-react';

export const DecisionPage: React.FC = () => {
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleAccept = async () => {
        if (!agreed) return;
        setSubmitting(true);
        try {
            await foundationApi.submitDecision({ decision: 'ACCEPT' });
            navigate('/foundation/result?outcome=accepted');
        } catch (error) {
            console.error('Acceptance failed', error);
            setSubmitting(false);
            // Ideally show toast/error
        }
    };

    const handleDecline = async () => {
        if (window.confirm('Уверены? Отказ ограничит доступ. Вы будете разлогинены.')) {
            try {
                await foundationApi.submitDecision({ decision: 'DECLINE' });
                navigate('/foundation/result?outcome=declined');
            } catch (error) {
                console.error('Decline failed', error);
                navigate('/foundation/result?outcome=declined'); // Force exit anyway
            }
        }
    };

    return (
        <div className="p-8 md:p-12">
            <div className="flex justify-center mb-6 text-gray-900">
                <Scale size={64} />
            </div>

            <h2 className="text-3xl font-medium text-center mb-6 text-gray-900">Финальное решение</h2>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8 prose prose-sm text-gray-600">
                <p>
                    Принимая, вы соглашаетесь соблюдать
                    <strong> Constitution, Code of Honor, and Golden Standards</strong>.
                </p>
                <p>
                    Вы признаете, что:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Нарушение Кодекса ведет к увольнению.</li>
                    <li>Результат важнее усилий (MDR).</li>
                    <li>Экономика основана на заслугах.</li>
                </ul>
                <p className="font-medium text-gray-900 mt-4">
                    Решение обязательно и записано в Аудит-лог.
                </p>
            </div>

            <div className="mb-8">
                <label className="flex items-start space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                    />
                    <span className="text-gray-900 font-medium select-none">
                        Подтверждаю прочтение Блоков Фундамента и ПРИНИМАЮ правила.
                    </span>
                </label>
            </div>

            <div className="space-y-4">
                <button
                    onClick={handleAccept}
                    disabled={!agreed || submitting}
                    className={`
                        w-full flex justify-center items-center px-6 py-4 rounded-lg text-lg font-medium shadow-md transition-all
                        ${(!agreed || submitting)
                            ? 'bg-gray-200 text-[#717182] cursor-not-allowed'
                            : 'bg-green-600 text-[#030213] hover:bg-green-700 hover:scale-[1.01]'
                        }
                    `}
                >
                    {submitting ? 'Processing...' : 'ACCEPT FOUNDATION'}
                </button>

                <button
                    onClick={handleDecline}
                    disabled={submitting}
                    className="w-full py-3 text-[#717182] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                    Отказываюсь (Выход)
                </button>
            </div>
        </div>
    );
};
