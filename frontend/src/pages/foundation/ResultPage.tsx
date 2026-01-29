import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

export const ResultPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const outcome = searchParams.get('outcome');
    const isAccepted = outcome === 'accepted';

    useEffect(() => {
        if (isAccepted) {
            // Auto redirect to dashboard after delay
            const timer = setTimeout(() => {
                navigate('/');
                // Force reload to refresh guards/state might be needed if state is global and not reactive
                // window.location.href = '/'; 
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            // Logout logic
            const timer = setTimeout(() => {
                // Clear token
                localStorage.removeItem('token');
                window.location.href = '/login';
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isAccepted, navigate]);

    return (
        <div className="flex-grow flex flex-col items-center justify-center p-6 bg-[#F3F3F5] font-sans selection:bg-indigo-100/30">
            <div className="w-full max-w-xl bg-white shadow-sm rounded-[2.5rem] border border-black/5 p-16 text-center">
                {isAccepted ? (
                    <div className="animate-in fade-in zoom-in duration-1000">
                        <div className="flex justify-center mb-10 text-emerald-500">
                            <CheckCircle size={100} strokeWidth={1} />
                        </div>
                        <h2 className="text-4xl font-medium text-[#030213] mb-6 tracking-tight">Принятие подтверждено</h2>
                        <p className="text-xl text-[#717182] leading-relaxed">
                            Добро пожаловать в Университет, Коллега.<br />
                            <span className="text-xs font-mono uppercase tracking-[0.3em] mt-8 block opacity-40">Accessing Corporate University Core...</span>
                        </p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex justify-center mb-10 text-[#717182]/30">
                            <XCircle size={100} strokeWidth={1} />
                        </div>
                        <h2 className="text-4xl font-medium text-[#030213] mb-6 tracking-tight">Доступ отклонен</h2>
                        <p className="text-xl text-[#717182] leading-relaxed">
                            Вы выбрали не принимать Базу.<br />
                            Доступ к системе ограничен.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
