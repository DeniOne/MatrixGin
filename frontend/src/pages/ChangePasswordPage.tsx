import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChangePasswordMutation } from '../features/auth/authApi';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { Lock, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';

/**
 * ChangePasswordPage - Force reset for new employees
 */
const ChangePasswordPage: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (newPassword !== confirmPassword) {
            setErrorMsg('Пароли не совпадают');
            return;
        }

        if (newPassword.length < 8) {
            setErrorMsg('Новый пароль должен быть не менее 8 символов');
            return;
        }

        try {
            await changePassword({ currentPassword, newPassword }).unwrap();
            setSuccess(true);

            // Wait a bit and redirect or logout
            setTimeout(() => {
                dispatch(logout());
                navigate('/login', { state: { message: 'Пароль успешно изменен. Войдите с новым паролем.' } });
            }, 2000);
        } catch (err: any) {
            console.error('Password change failed', err);
            setErrorMsg(err.data?.message || 'Не удалось сменить пароль. Проверьте текущий пароль.');
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F3F3F5] px-4">
                <div className="max-w-md w-full bg-white p-10 rounded-[32px] text-center space-y-4 border border-green-100 shadow-xl">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-4">
                        <ShieldCheck className="h-10 w-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-medium text-[#030213]">Пароль изменен!</h2>
                    <p className="text-[#717182]">Сейчас вы будете перенаправлены на страницу входа...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3F3F5] px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[32px] border border-black/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl mb-6 shadow-lg shadow-amber-100">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-medium text-[#030213] tracking-tighter">
                        Безопасность
                    </h2>
                    <p className="mt-3 text-[#717182] font-normal text-sm uppercase tracking-widest leading-relaxed">
                        Необходимо сменить <br /> временный пароль
                    </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-normal">
                        Для первого входа в систему MatrixGin необходимо заменить пароль, присланный на почту, на ваш собственный.
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#A1A1B5] uppercase tracking-wider pl-1">Текущий пароль</label>
                            <input
                                type="password"
                                required
                                className="block w-full px-4 py-4 bg-[#F9F9FB] border border-black/[0.03] rounded-2xl text-[#030213] focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all placeholder:text-[#A1A1B5] sm:text-sm font-medium"
                                placeholder="Введите временный пароль"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#A1A1B5] uppercase tracking-wider pl-1">Новый пароль</label>
                            <input
                                type="password"
                                required
                                className="block w-full px-4 py-4 bg-[#F9F9FB] border border-black/[0.03] rounded-2xl text-[#030213] focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all placeholder:text-[#A1A1B5] sm:text-sm font-medium"
                                placeholder="Минимум 8 символов"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#A1A1B5] uppercase tracking-wider pl-1">Подтверждение</label>
                            <input
                                type="password"
                                required
                                className="block w-full px-4 py-4 bg-[#F9F9FB] border border-black/[0.03] rounded-2xl text-[#030213] focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all placeholder:text-[#A1A1B5] sm:text-sm font-medium"
                                placeholder="Повторите новый пароль"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="text-[#FF3B30] text-xs font-medium text-center bg-[#FF3B30]/5 p-3 rounded-xl border border-[#FF3B30]/10 animate-in slide-in-from-top-2">
                            {errorMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-4 px-4 bg-[#030213] text-white rounded-2xl text-sm font-medium hover:bg-black focus:outline-none shadow-lg shadow-black/10 disabled:opacity-50 transition-all active:scale-[0.98] mt-4"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                            'СМЕНИТЬ ПАРОЛЬ И ВОЙТИ'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
