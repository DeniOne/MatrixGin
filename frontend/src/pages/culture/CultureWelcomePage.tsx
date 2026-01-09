import React, { useState } from 'react';
import {
    Heart,
    Users,
    Target,
    Award,
    CheckCircle,
    ArrowRight,
    PlayCircle,
    FileText,
    Sparkles
} from 'lucide-react';

interface OnboardingStep {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    content: {
        type: 'video' | 'text' | 'quiz';
        data: any;
    };
    completed: boolean;
}

const CultureWelcomePage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const steps: OnboardingStep[] = [
        {
            id: 1,
            title: 'Добро пожаловать в Фотоматрица!',
            description: 'Узнайте о нашей миссии и истории компании',
            icon: <Heart className="w-6 h-6" />,
            content: {
                type: 'video',
                data: {
                    title: 'Наша история',
                    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
                    duration: '5:30'
                }
            },
            completed: currentStep > 1
        },
        {
            id: 2,
            title: 'Наши ценности',
            description: 'Клиентоцентричность, профессионализм, командная работа',
            icon: <Users className="w-6 h-6" />,
            content: {
                type: 'text',
                data: {
                    values: [
                        { name: 'Клиент — в центре', description: 'Мы делаем всё для создания идеального клиентского опыта' },
                        { name: 'Профессионализм', description: 'Постоянное развитие и стремление к совершенству' },
                        { name: 'Командная работа', description: 'Вместе мы достигаем большего' },
                        { name: 'Инновации', description: 'Открыты новому и не боимся экспериментировать' }
                    ]
                }
            },
            completed: currentStep > 2
        },
        {
            id: 3,
            title: 'Конституция компании',
            description: 'Принципы работы и корпоративная этика',
            icon: <FileText className="w-6 h-6" />,
            content: {
                type: 'text',
                data: {
                    sections: [
                        'Кодекс этики',
                        'Правила внутреннего распорядка',
                        'Политика конфиденциальности',
                        'Антикоррупционная политика'
                    ]
                }
            },
            completed: currentStep > 3
        },
        {
            id: 4,
            title: 'Проверка знаний',
            description: 'Короткий тест на понимание наших ценностей',
            icon: <Target className="w-6 h-6" />,
            content: {
                type: 'quiz',
                data: {
                    questions: 5
                }
            },
            completed: currentStep > 4
        }
    ];

    const handleNextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const currentStepData = steps[currentStep - 1];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4 shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome-трек</h1>
                <p className="text-lg text-gray-600">Добро пожаловать в команду! Пройдите онбординг и познакомьтесь с нашей культурой</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600">Ваш прогресс</span>
                    <span className="text-sm font-bold text-indigo-600">{Math.round((currentStep / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Steps Navigation */}
            <div className="grid grid-cols-4 gap-4 mb-12">
                {steps.map((step) => (
                    <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${step.id === currentStep
                                ? 'border-indigo-600 bg-indigo-50 shadow-md'
                                : step.completed
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-lg ${step.id === currentStep ? 'bg-indigo-600 text-white' :
                                    step.completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {step.completed ? <CheckCircle className="w-5 h-5" /> : step.icon}
                            </div>
                            <span className="text-xs font-bold text-gray-400">Шаг {step.id}</span>
                        </div>
                        <h3 className="font-bold text-sm text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{step.description}</p>
                    </button>
                ))}
            </div>

            {/* Current Step Content */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
                    <h2 className="text-2xl font-bold mb-2">{currentStepData.title}</h2>
                    <p className="text-indigo-100">{currentStepData.description}</p>
                </div>

                <div className="p-8">
                    {currentStepData.content.type === 'video' && (
                        <div className="space-y-6">
                            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative group cursor-pointer">
                                <img
                                    src={currentStepData.content.data.thumbnail}
                                    alt="Video thumbnail"
                                    className="w-full h-full object-cover opacity-70"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                                        <PlayCircle className="w-12 h-12 text-indigo-600 fill-current" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                                    {currentStepData.content.data.duration}
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">Посмотрите это короткое видео о нашей компании</p>
                            </div>
                        </div>
                    )}

                    {currentStepData.content.type === 'text' && currentStep === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentStepData.content.data.values.map((value: any, idx: number) => (
                                <div key={idx} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
                                    <h3 className="font-bold text-lg text-indigo-900 mb-2">{value.name}</h3>
                                    <p className="text-gray-700">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStepData.content.type === 'text' && currentStep === 3 && (
                        <div className="space-y-4">
                            <p className="text-gray-600 mb-6">
                                Ознакомьтесь с основными документами, регулирующими работу в нашей компании.
                            </p>
                            {currentStepData.content.data.sections.map((section: string, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer group">
                                    <div className="flex items-center">
                                        <FileText className="w-5 h-5 text-gray-400 mr-3 group-hover:text-indigo-600" />
                                        <span className="font-medium text-gray-900">{section}</span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStepData.content.type === 'quiz' && (
                        <div className="text-center py-12">
                            <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Завершающий тест</h3>
                            <p className="text-gray-600 mb-6">
                                Проверьте свои знания и получите сертификат о прохождении онбординга
                            </p>
                            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                Начать тест ({currentStepData.content.data.questions} вопросов)
                            </button>
                        </div>
                    )}
                </div>

                <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <button
                        onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentStep === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-200'
                            }`}
                        disabled={currentStep === 1}
                    >
                        Назад
                    </button>
                    <button
                        onClick={handleNextStep}
                        className={`px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center ${currentStep === steps.length ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={currentStep === steps.length}
                    >
                        {currentStep === steps.length ? 'Завершено!' : 'Далее'}
                        {currentStep < steps.length && <ArrowRight className="w-5 h-5 ml-2" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CultureWelcomePage;
