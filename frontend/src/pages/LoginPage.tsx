import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useLoginMutation,
    useInitTelegramLoginMutation,
    useLazyVerifyTelegramLoginQuery
} from '../features/auth/authApi';
import { useAppDispatch } from '../app/hooks';
import { setCredentials } from '../features/auth/authSlice';
import { Lock, Mail, Loader2, Send, MessageSquare } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [loginMode, setLoginMode] = useState<'password' | 'telegram'>('telegram');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telegramUsername, setTelegramUsername] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [sessionId, setSessionId] = useState<string | null>(null);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [initTelegram, { isLoading: isInitLoading }] = useInitTelegramLoginMutation();
    const [triggerVerify] = useLazyVerifyTelegramLoginQuery();

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            const userData = await login({ email, password }).unwrap();
            handleAuthSuccess(userData);
        } catch (err: any) {
            setErrorMsg(err.data?.message || 'Ошибка входа');
        }
    };

    const handleTelegramSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            const { sessionId: newSessionId } = await initTelegram({ username: telegramUsername }).unwrap();
            setSessionId(newSessionId);
        } catch (err: any) {
            setErrorMsg(err.data?.message || 'Ошибка инициации входа');
        }
    };

    const handleAuthSuccess = (userData: any) => {
        dispatch(setCredentials(userData));
        if (userData.user.mustResetPassword) {
            navigate('/change-password');
        } else {
            navigate('/');
        }
    };

    // Polling Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (sessionId) {
            interval = setInterval(async () => {
                try {
                    const result = await triggerVerify(sessionId).unwrap();
                    if (result && result.accessToken) {
                        clearInterval(interval);
                        handleAuthSuccess(result);
                    }
                } catch (err: any) {
                    if (err.status !== 202) {
                        clearInterval(interval);
                        setErrorMsg(err.data?.message || 'Ошибка проверки сессии');
                        setSessionId(null);
                    }
                }
            }, 2000);
        }

        return () => clearInterval(interval);
    }, [sessionId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3F3F5] px-4 animate-in fade-in duration-700">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[32px] border border-black/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-6 shadow-lg shadow-indigo-100">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-medium text-[#030213] tracking-tighter">
                        MatrixGin v2.0
                    </h2>
                    <p className="mt-3 text-[#717182] font-normal text-sm uppercase tracking-widest">
                        Центр управления доступом
                    </p>
                </div>

                <div className="flex bg-[#F9F9FB] p-1 rounded-2xl border border-black/[0.03]">
                    <button
                        onClick={() => { setLoginMode('telegram'); setSessionId(null); setErrorMsg(''); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${loginMode === 'telegram' ? 'bg-white text-indigo-600 shadow-sm' : 'text-[#717182] hover:text-[#030213]'}`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Telegram
                    </button>
                    <button
                        onClick={() => { setLoginMode('password'); setSessionId(null); setErrorMsg(''); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${loginMode === 'password' ? 'bg-white text-indigo-600 shadow-sm' : 'text-[#717182] hover:text-[#030213]'}`}
                    >
                        <Lock className="w-4 h-4" />
                        Пароль
                    </button>
                </div>

                {loginMode === 'password' ? (
                    <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#717182]">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full px-4 py-4 pl-12 bg-[#F9F9FB] border border-black/[0.03] rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all sm:text-sm font-medium"
                                    placeholder="E-mail адрес"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#717182]">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full px-4 py-4 pl-12 bg-[#F9F9FB] border border-black/[0.03] rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all sm:text-sm font-medium"
                                    placeholder="Пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="text-[#FF3B30] text-xs font-medium text-center bg-[#FF3B30]/5 p-3 rounded-xl border border-[#FF3B30]/10">
                                {errorMsg}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoginLoading}
                            className="w-full flex justify-center items-center py-4 bg-indigo-600 text-white rounded-2xl text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all active:scale-[0.98]"
                        >
                            {isLoginLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Войти'}
                        </button>
                    </form>
                ) : (
                    <div className="mt-8 space-y-6">
                        {!sessionId ? (
                            <form onSubmit={handleTelegramSubmit} className="space-y-6">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#717182]">
                                        <Send className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full px-4 py-4 pl-12 bg-[#F9F9FB] border border-black/[0.03] rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all sm:text-sm font-medium"
                                        placeholder="@твой_ник_в_тг"
                                        value={telegramUsername}
                                        onChange={(e) => setTelegramUsername(e.target.value)}
                                    />
                                </div>

                                {errorMsg && (
                                    <div className="text-[#FF3B30] text-xs font-medium text-center bg-[#FF3B30]/5 p-3 rounded-xl border border-[#FF3B30]/10">
                                        {errorMsg}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isInitLoading}
                                    className="w-full flex justify-center items-center py-4 bg-indigo-600 text-white rounded-2xl text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all active:scale-[0.98]"
                                >
                                    {isInitLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Прислать пуш в Telegram'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center space-y-6 py-4 animate-in zoom-in duration-300">
                                <div className="relative w-16 h-16 mx-auto">
                                    <div className="absolute inset-0 bg-indigo-600/20 rounded-full animate-ping"></div>
                                    <div className="relative flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full">
                                        <MessageSquare className="w-8 h-8 text-indigo-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[#030213] font-medium">Ожидаем подтверждения...</p>
                                    <p className="text-[#717182] text-sm">Мы отправили запрос в бота. Пожалуйста, подтвердите вход в Telegram.</p>
                                </div>
                                <button
                                    onClick={() => setSessionId(null)}
                                    className="text-indigo-600 text-sm font-medium hover:underline"
                                >
                                    Отмена
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className="text-center pt-4">
                    <p className="text-[10px] text-[#A1A1B5] font-medium uppercase tracking-[0.2em]">
                        Protective Layer v4.5.1
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
