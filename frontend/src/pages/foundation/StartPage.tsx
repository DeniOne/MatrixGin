import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { foundationApi } from '../../features/foundation/api/foundation.api';
import { FoundationStatus, ImmersionState } from '../../features/foundation/types/foundation.types';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

import { useLazyGetMeQuery } from '../../features/auth/authApi';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from '../../features/auth/authSlice';

export const StartPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation() as any;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [state, setState] = useState<ImmersionState | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [triggerGetMe] = useLazyGetMeQuery();
    const dispatch = useAppDispatch();

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        if (isProcessing) return;
        try {
            console.log('[StartPage] Checking status...');
            const state = await foundationApi.getStatus();
            console.log('[StartPage] Received status:', state.status);
            setState(state);

            // ARCHITECT OVERRIDE: Don't redirect if SUPERUSER (we want to see the page)
            const emulatedRole = localStorage.getItem('emulatedRole') || 'SUPERUSER';
            if (emulatedRole === 'SUPERUSER') {
                setIsLoading(false);
                return;
            }

            // Intelligent Routing based on Status
            // Only auto-redirect if NOT already on the start page by choice
            // If they are on /foundation/start intentionally, let them stay if they want to review.
            if (state.status === FoundationStatus.ACCEPTED && location.state?.forceReview !== true) {
                console.log('[StartPage] Status is ACCEPTED, syncing user...');
                setIsProcessing(true);
                const userData = await triggerGetMe().unwrap();
                if (userData) {
                    const token = localStorage.getItem('token');
                    if (token) {
                        dispatch(setCredentials({ user: userData, accessToken: token }));
                    }
                }
                navigate('/');
            } else if (state.status === FoundationStatus.IN_PROGRESS && location.state?.forceReview !== true) {
                const firstUnlocked = state.blocks.find(b => b.status !== 'COMPLETED');
                if (firstUnlocked) {
                    navigate(`/foundation/base/${firstUnlocked.id}`);
                }
            } else if (state.status === FoundationStatus.VERSION_MISMATCH) {
                setError('Системные правила обновлены. Требуется повторное подтверждение.');
            }
            setIsLoading(false);
        } catch (err) {
            console.error('Foundation Status Check Failed', err);
            setError('Не удалось связаться с Ядром Университета.');
            setIsLoading(false);
        }
    };

    const handleBegin = () => {
        if (state && state.blocks.length > 0) {
            navigate(`/foundation/base/${state.blocks[0].id}`);
        }
    };

    if (isLoading) return (
        <div className="flex-grow flex items-center justify-center bg-[#F3F3F5] font-sans">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mb-4" />
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#717182]">Kernel Sync...</span>
            </div>
        </div>
    );

    const isAccepted = state?.status === FoundationStatus.ACCEPTED;

    return (
        <div className="flex-grow flex flex-col items-center justify-center p-6 bg-[#F3F3F5] font-sans selection:bg-indigo-100/30">
            <div className="w-full max-w-xl bg-white shadow-sm rounded-[2.5rem] overflow-hidden border border-black/5 p-16 relative">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <ShieldAlert size={200} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-12">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <ShieldAlert size={20} className="text-white" />
                        </div>
                        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#717182]">MatrixGin Security Protocol</span>
                    </div>

                    <h2 className="text-5xl font-medium text-[#030213] tracking-tight mb-8 leading-[1.1]">
                        {isAccepted ? 'Базовые принципы' : 'Доступ ограничен'}
                    </h2>

                    <p className="text-xl text-[#717182] mb-12 leading-relaxed max-w-md">
                        {isAccepted
                            ? 'Вы успешно приняли Базу. Здесь вы можете повторно ознакомиться с фундаментальными правилами и ценностями системы.'
                            : <>Перед доступом к <strong className="text-[#030213] font-medium">Прикладным Знаниям</strong> и <strong className="text-[#030213] font-medium">Экономике</strong>, вам необходимо принять <strong className="text-indigo-600 font-medium whitespace-nowrap">Базу системы</strong>.</>
                        }
                    </p>

                    {error && (
                        <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-5 mb-10 flex items-start">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mr-4 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-amber-900 leading-snug">
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={handleBegin}
                            className="group w-full flex justify-between items-center px-8 py-6 text-lg font-medium rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
                        >
                            <span>{isAccepted ? 'Просмотреть Базу' : 'Узнать Базу'}</span>
                            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {isAccepted && (
                            <button
                                onClick={() => navigate('/')}
                                className="w-full px-8 py-6 text-lg font-medium rounded-2xl text-[#030213] bg-white border border-black/10 hover:bg-gray-50 transition-all active:scale-[0.98]"
                            >
                                Вернуться в Университет
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ARCHITECT DATA VIEW (Direct DB Reflection) */}
            {localStorage.getItem('emulatedRole') === 'SUPERUSER' && state && (
                <div className="mt-12 w-full max-w-4xl bg-[#030213] p-10 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mr-4">
                                <ShieldAlert size={24} className="text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-white tracking-tight">Architect Data View</h3>
                                <p className="text-[#717182] text-xs font-mono uppercase tracking-widest mt-1">FoundationBlock Entities</p>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-[10px] font-mono text-[#717182] uppercase tracking-[0.2em]">Version: {state.currentVersion}</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-xs">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="pb-4 px-2 text-[#717182] font-medium">ID (System)</th>
                                    <th className="pb-4 px-2 text-[#717182] font-medium">Title</th>
                                    <th className="pb-4 px-2 text-[#717182] font-medium">Ord</th>
                                    <th className="pb-4 px-2 text-[#717182] font-medium">Material ID</th>
                                    <th className="pb-4 px-2 text-[#717182] font-medium text-right">Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {state.blocks.map(block => (
                                    <tr key={block.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-4 px-2 text-indigo-400 group-hover:text-indigo-300 transition-colors uppercase font-bold">{block.id}</td>
                                        <td className="py-4 px-2 text-white/90">{block.title}</td>
                                        <td className="py-4 px-2 text-white/50">{block.order}</td>
                                        <td className="py-4 px-2 text-white/30 truncate max-w-[120px]">{block.materialId}</td>
                                        <td className="py-4 px-2 text-right">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${block.isCompleted
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                {block.isCompleted ? 'Viewed' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-10 flex items-center justify-between text-[10px] text-[#717182]">
                        <div className="flex items-center space-x-6">
                            <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2" /> Live Connection: Active</span>
                            <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" /> Entities: {state.blocks.length}</span>
                        </div>
                        <p className="italic opacity-40">MatrixGin Core Kernel Layer: DB_REFLECTION_ENABLED</p>
                    </div>
                </div>
            )}

            <footer className="mt-12 text-center text-[#717182] text-[10px] font-medium uppercase tracking-[0.3em] opacity-60">
                <p>Операционная Система MatrixGin v2.2</p>
                <p className="mt-2">Доступ строго контролируется. Действия логируются.</p>
            </footer>
        </div>
    );
};
