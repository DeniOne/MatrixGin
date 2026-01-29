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
        <div className="flex-grow flex flex-col items-center justify-center p-6 bg-[#F3F3F5] font-sans selection:bg-indigo-100/30">
            <div className="w-full max-w-xl bg-white shadow-sm rounded-[2.5rem] border border-black/5 p-16">
                <div className="flex justify-center mb-10 text-indigo-600">
                    <Scale size={64} strokeWidth={1.5} />
                </div>

                <h2 className="text-4xl font-medium text-center mb-8 text-[#030213] tracking-tight">Принятие Базы</h2>

                <div className="bg-[#F3F3F5] p-8 rounded-3xl border border-black/5 mb-10 text-[#030213]/70 text-lg leading-relaxed">
                    <p className="mb-4">
                        Принимая Базу, вы подтверждаете свою готовность следовать
                        <strong className="text-[#030213] font-medium ml-1">Конституции, Кодексу Чести и Золотым Стандартам</strong> системы MatrixGin.
                    </p>

                    <ul className="space-y-3 mt-6">
                        <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-4 mt-2.5 shrink-0" />
                            <span>Нарушение Кодекса ведет к немедленному увольнению.</span>
                        </li>
                        <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-4 mt-2.5 shrink-0" />
                            <span>Результат (MDR) всегда приоритетнее усилий.</span>
                        </li>
                        <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-4 mt-2.5 shrink-0" />
                            <span>Экономика системы основана на личных заслугах.</span>
                        </li>
                    </ul>

                    <p className="text-xs font-medium uppercase tracking-widest text-indigo-600 mt-8 opacity-60">
                        Решение фиксируется в децентрализованном аудит-логе.
                    </p>
                </div>

                <div className="mb-10">
                    <label className={`
                        flex items-start space-x-4 p-6 rounded-2xl border transition-all cursor-pointer
                        ${agreed ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-black/10 hover:border-black/20'}
                    `}>
                        <div className="relative flex items-center mt-0.5">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="h-6 w-6 text-indigo-600 border-black/10 rounded-lg cursor-pointer transition-all"
                            />
                        </div>
                        <span className="text-[#030213] font-medium text-lg leading-snug select-none">
                            Я подтверждаю, что полностью осознаю Базу и ПРИНИМАЮ правила системы.
                        </span>
                    </label>
                </div>

                <div className="flex flex-col space-y-4">
                    <button
                        onClick={handleAccept}
                        disabled={!agreed || submitting}
                        className={`
                            w-full flex justify-center items-center px-8 py-6 rounded-2xl text-xl font-medium transition-all shadow-xl shadow-indigo-100
                            ${(!agreed || submitting)
                                ? 'bg-white border border-black/5 text-[#717182] cursor-not-allowed'
                                : 'bg-black text-white hover:bg-[#030213] active:scale-[0.98]'
                            }
                        `}
                    >
                        {submitting ? 'Запись в ядро...' : '📜 ПРИНЯТЬ БАЗУ'}
                    </button>

                    <button
                        onClick={handleDecline}
                        disabled={submitting}
                        className="w-full py-5 text-[#717182] hover:text-red-600 transition-colors font-medium text-lg"
                    >
                        Отказаться и покинуть систему
                    </button>
                </div>
            </div>
        </div>
    );
};
