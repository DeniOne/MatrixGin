import React from 'react';
import {
    Activity,
    Brain,
    Target,
    CheckCircle,
    ArrowRight,
    Lock
} from 'lucide-react';

interface Assessment {
    id: string;
    title: string;
    description: string;
    questions: number;
    duration: string;
    status: 'available' | 'completed' | 'locked';
    score?: number;
    category: 'EQ' | 'Leadership' | 'Communication';
}

const SoftAssessmentPage: React.FC = () => {
    // Mock Data
    const assessments: Assessment[] = [
        {
            id: '1',
            title: 'Эмоциональный интеллект (EQ)',
            description: 'Оцените свой уровень эмпатии, саморегуляции и социальной компетентности.',
            questions: 45,
            duration: '30 мин',
            status: 'completed',
            score: 82,
            category: 'EQ'
        },
        {
            id: '2',
            title: 'Стиль коммуникации',
            description: 'Узнайте, какой стиль общения вы используете чаще всего и как его адаптировать.',
            questions: 20,
            duration: '15 мин',
            status: 'available',
            category: 'Communication'
        },
        {
            id: '3',
            title: 'Лидерский потенциал',
            description: 'Комплексная оценка ваших управленческих навыков.',
            questions: 60,
            duration: '45 мин',
            status: 'locked',
            category: 'Leadership'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-medium text-gray-900">Оценка и Тестирование</h1>
                <p className="text-[#717182] mt-1">Познайте себя лучше, чтобы эффективно развиваться</p>
            </div>

            {/* Results Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">Мой EQ Профиль</h3>
                        <Brain className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex items-center justify-center h-40">
                        {/* Placeholder for Radar Chart */}
                        <div className="relative w-32 h-32 rounded-full border-4 border-indigo-100 flex items-center justify-center">
                            <span className="text-3xl font-medium text-indigo-600">82</span>
                        </div>
                    </div>
                    <div className="mt-4 text-center text-sm text-[#717182]">
                        Высокий уровень эмпатии
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">Сильные стороны</h3>
                        <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span>Активное слушание</span>
                            <span className="font-medium text-green-600">9.5/10</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '95%' }}></div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span>Управление конфликтами</span>
                            <span className="font-medium text-green-600">8.0/10</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">Зоны роста</h3>
                        <Target className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span>Публичные выступления</span>
                            <span className="font-medium text-orange-600">4.5/10</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span>Делегирование</span>
                            <span className="font-medium text-orange-600">5.2/10</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '52%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assessments List */}
            <h2 className="text-xl font-medium text-gray-900 mb-6">Доступные тесты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessments.map(test => (
                    <div key={test.id} className={`bg-white rounded-xl border p-6 flex flex-col ${test.status === 'locked' ? 'border-gray-200 opacity-70' :
                        test.status === 'completed' ? 'border-green-200 bg-green-50/10' :
                            'border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all'
                        }`}>
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wide ${test.category === 'EQ' ? 'bg-purple-100 text-purple-700' :
                                test.category === 'Leadership' ? 'bg-blue-100 text-blue-700' :
                                    'bg-orange-100 text-orange-700'
                                }`}>
                                {test.category}
                            </span>
                            {test.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {test.status === 'locked' && <Lock className="w-5 h-5 text-[#717182]" />}
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 mb-2">{test.title}</h3>
                        <p className="text-sm text-[#717182] mb-6 flex-1">{test.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="text-xs text-[#717182]">
                                {test.questions} вопросов • {test.duration}
                            </div>

                            {test.status === 'available' && (
                                <button className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                    Начать тест <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            )}

                            {test.status === 'completed' && (
                                <span className="text-sm font-medium text-green-600">
                                    Результат: {test.score}/100
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SoftAssessmentPage;
