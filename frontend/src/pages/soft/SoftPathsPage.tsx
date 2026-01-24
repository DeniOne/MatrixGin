import React from 'react';
import {
    Map,
    Flag,
    CheckCircle,
    Lock,
    ArrowRight,
    Star,
    Compass,
    User
} from 'lucide-react';

interface PathStep {
    id: string;
    title: string;
    description: string;
    type: 'course' | 'practice' | 'assessment';
    status: 'completed' | 'current' | 'locked';
    duration?: string;
}

interface LearningPath {
    id: string;
    title: string;
    description: string;
    role: string;
    progress: number;
    totalSteps: number;
    completedSteps: number;
    steps: PathStep[];
}

const SoftPathsPage: React.FC = () => {
    // Mock Data
    const currentPath: LearningPath = {
        id: '1',
        title: 'Путь Лидера: Level 1',
        description: 'Базовая программа развития управленческих навыков для начинающих руководителей.',
        role: 'Team Lead',
        progress: 35,
        totalSteps: 5,
        completedSteps: 1,
        steps: [
            {
                id: 's1',
                title: 'Основы эмоционального интеллекта',
                description: 'Научитесь понимать свои эмоции и эмоции других людей.',
                type: 'course',
                status: 'completed',
                duration: '2ч 30мин'
            },
            {
                id: 's2',
                title: 'Практика активного слушания',
                description: 'Выполните 3 упражнения на развитие эмпатии в диалоге.',
                type: 'practice',
                status: 'current',
                duration: '3 дня'
            },
            {
                id: 's3',
                title: 'Тайм-менеджмент: Матрица Эйзенхауэра',
                description: 'Курс по эффективному планированию времени.',
                type: 'course',
                status: 'locked',
                duration: '1ч 45мин'
            },
            {
                id: 's4',
                title: 'Тест на стиль управления',
                description: 'Определите свой доминирующий стиль лидерства.',
                type: 'assessment',
                status: 'locked',
                duration: '30 мин'
            },
            {
                id: 's5',
                title: 'Финальный проект: План развития команды',
                description: 'Составьте план развития для 2 сотрудников.',
                type: 'practice',
                status: 'locked',
                duration: '1 неделя'
            }
        ]
    };

    const getStepIcon = (type: string) => {
        switch (type) {
            case 'course': return <Compass className="w-5 h-5" />;
            case 'practice': return <Star className="w-5 h-5" />;
            case 'assessment': return <Flag className="w-5 h-5" />;
            default: return <Compass className="w-5 h-5" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-medium text-gray-900 flex items-center">
                    <Map className="w-8 h-8 mr-3 text-indigo-600" />
                    Мой путь развития
                </h1>
                <p className="text-[#717182] mt-1">Персонализированная программа обучения для роли <span className="font-medium text-gray-700">{currentPath.role}</span></p>
            </div>

            {/* Path Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full transform translate-x-1/3 -translate-y-1/3 opacity-50"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-medium text-gray-900 mb-2">{currentPath.title}</h2>
                            <p className="text-gray-600 max-w-2xl">{currentPath.description}</p>
                        </div>
                        <div className="bg-indigo-50 px-4 py-2 rounded-lg flex items-center">
                            <User className="w-5 h-5 text-indigo-600 mr-2" />
                            <span className="font-medium text-indigo-900">{currentPath.role}</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between text-sm font-medium text-[#717182] mb-2">
                            <span>Прогресс курса</span>
                            <span>{currentPath.completedSteps} из {currentPath.totalSteps} этапов</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${currentPath.progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Steps */}
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                <div className="space-y-8">
                    {currentPath.steps.map((step) => (
                        <div key={step.id} className={`relative flex items-start group ${step.status === 'locked' ? 'opacity-60' : ''}`}>
                            {/* Step Indicator */}
                            <div className={`absolute left-0 w-16 flex justify-center pt-2 bg-gray-50 z-10`}>
                                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-colors ${step.status === 'completed' ? 'border-green-500 bg-green-50 text-green-600' :
                                    step.status === 'current' ? 'border-indigo-600 bg-white text-indigo-600 shadow-lg scale-110' :
                                        'border-gray-200 bg-gray-50 text-[#717182]'
                                    }`}>
                                    {step.status === 'completed' ? <CheckCircle className="w-8 h-8" /> :
                                        step.status === 'locked' ? <Lock className="w-6 h-6" /> :
                                            getStepIcon(step.type)}
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className={`ml-24 flex-1 bg-white rounded-xl border p-6 transition-all ${step.status === 'current'
                                ? 'border-indigo-200 shadow-md ring-1 ring-indigo-100'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className={`text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded ${step.type === 'course' ? 'bg-blue-50 text-blue-600' :
                                                step.type === 'practice' ? 'bg-green-50 text-green-600' :
                                                    'bg-purple-50 text-purple-600'
                                                }`}>
                                                {step.type === 'course' ? 'Курс' :
                                                    step.type === 'practice' ? 'Практика' : 'Тест'}
                                            </span>
                                            {step.duration && (
                                                <span className="text-xs text-[#717182]">• {step.duration}</span>
                                            )}
                                        </div>
                                        <h3 className={`text-lg font-medium mb-2 ${step.status === 'completed' ? 'text-[#717182] line-through' : 'text-gray-900'}`}>
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">{step.description}</p>
                                    </div>

                                    {step.status === 'current' && (
                                        <button className="flex items-center px-4 py-2 bg-indigo-600 text-[#030213] rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transform transition-transform hover:scale-105">
                                            Начать
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </button>
                                    )}

                                    {step.status === 'completed' && (
                                        <button className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg text-sm font-medium hover:bg-indigo-100">
                                            Повторить
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SoftPathsPage;
