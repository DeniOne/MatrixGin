import React from 'react';
import { CheckCircle, Circle, Lock } from 'lucide-react';

const TrainersAccreditPage: React.FC = () => {
    const steps = [
        { id: 1, title: 'Базовый курс', status: 'completed', progress: 100 },
        { id: 2, title: 'Практика наставничества', status: 'current', progress: 60 },
        { id: 3, title: 'Экзамен', status: 'locked', progress: 0 },
        { id: 4, title: 'Сертификация', status: 'locked', progress: 0 }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Аккредитация Тренера</h1>

            <div className="bg-white rounded-xl border p-8 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Путь к сертификации</h2>
                <div className="space-y-6">
                    {steps.map((step, idx) => (
                        <div key={step.id} className="flex items-start">
                            <div className="mr-4 flex-shrink-0">
                                {step.status === 'completed' ? (
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                ) : step.status === 'current' ? (
                                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                                        <Circle className="w-6 h-6 text-white" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <Lock className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-bold mb-2 ${step.status === 'locked' ? 'text-gray-400' : 'text-gray-900'}`}>
                                    Шаг {step.id}: {step.title}
                                </h3>
                                {step.status === 'current' && (
                                    <div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${step.progress}%` }}></div>
                                        </div>
                                        <p className="text-sm text-gray-500">{step.progress}% завершено</p>
                                        <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                                            Продолжить
                                        </button>
                                    </div>
                                )}
                                {step.status === 'completed' && (
                                    <p className="text-sm text-green-600">✓ Завершено</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainersAccreditPage;
