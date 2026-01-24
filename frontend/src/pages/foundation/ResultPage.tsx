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
        <div className="p-12 text-center">
            {isAccepted ? (
                <div className="animate-fade-in">
                    <div className="flex justify-center mb-6 text-green-500">
                        <CheckCircle size={80} />
                    </div>
                    <h2 className="text-3xl font-medium text-gray-900 mb-4">Фундамент принят</h2>
                    <p className="text-lg text-gray-600">
                        Добро пожаловать в Матрицу, Коллега.<br />
                        Accessing Corporate University...
                    </p>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <div className="flex justify-center mb-6 text-[#717182]">
                        <XCircle size={80} />
                    </div>
                    <h2 className="text-3xl font-medium text-gray-900 mb-4">Доступ запрещен</h2>
                    <p className="text-lg text-gray-600">
                        Вы отклонили Фундамент.<br />
                        Выход...
                    </p>
                </div>
            )}
        </div>
    );
};
