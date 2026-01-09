import React, { useState } from 'react';
import {
    Play,
    MessageCircle,
    CheckCircle,
    XCircle,
    Award,
    RefreshCw,
    ChevronRight,
    User
} from 'lucide-react';

interface Scenario {
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    duration: string;
    description: string;
    completed: boolean;
    score?: number;
    image: string;
}

const PhotoSimulatorsPage: React.FC = () => {
    const [activeScenario, setActiveScenario] = useState<string | null>(null);
    const [step, setStep] = useState(0);

    // Mock Scenarios
    const scenarios: Scenario[] = [
        {
            id: '1',
            title: 'Капризный ребенок',
            difficulty: 'medium',
            duration: '10 мин',
            description: 'Ребенок 5 лет отказывается фотографироваться и плачет. Ваша задача — найти подход и сделать 5 удачных кадров.',
            completed: false,
            image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=300'
        },
        {
            id: '2',
            title: 'Стеснительная пара',
            difficulty: 'easy',
            duration: '15 мин',
            description: 'Молодая пара впервые на фотосессии. Они зажаты и не знают, как встать. Помогите им расслабиться.',
            completed: true,
            score: 85,
            image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=300'
        },
        {
            id: '3',
            title: 'Большая семья (10 человек)',
            difficulty: 'hard',
            duration: '20 мин',
            description: 'Нужно расставить большую семью так, чтобы всех было видно и никто не моргнул. У вас мало времени.',
            completed: false,
            image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=300'
        }
    ];

    // Mock Chat Steps for Scenario 1
    const chatSteps = [
        {
            speaker: 'Ребенок',
            text: 'Не хочу фоткаться! Хочу домой! 😭',
            options: [
                { text: 'Ну-ка перестань плакать, ты же мужчина!', correct: false, feedback: 'Это только усилит истерику.' },
                { text: 'Смотри, какая у меня есть игрушка на камере! Кто это там прячется?', correct: true, feedback: 'Отлично! Отвлечение внимания сработало.' },
                { text: 'Мама, успокойте ребенка.', correct: false, feedback: 'Перекладывание ответственности может обидеть родителей.' }
            ]
        },
        {
            speaker: 'Ребенок',
            text: '(Смотрит с интересом) Это зайчик?',
            options: [
                { text: 'Да! А давай покажем зайчику, как ты умеешь улыбаться?', correct: true, feedback: 'Супер! Контакт установлен.' },
                { text: 'Да. Встань ровно.', correct: false, feedback: 'Слишком сухо, ребенок может снова закрыться.' }
            ]
        }
    ];

    const handleOptionClick = (isCorrect: boolean) => {
        if (isCorrect) {
            if (step < chatSteps.length - 1) {
                setStep(step + 1);
            } else {
                alert('Сценарий пройден! Вы молодец!');
                setActiveScenario(null);
                setStep(0);
            }
        } else {
            alert('Попробуйте другой вариант.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Симуляторы ситуаций</h1>
                <p className="text-gray-500 mt-1">Тренируйте навыки общения с клиентами в безопасной среде</p>
            </div>

            {activeScenario ? (
                // Active Simulation View
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-4xl mx-auto">
                    <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-white font-bold text-lg">Сценарий: Капризный ребенок</h2>
                        <button
                            onClick={() => { setActiveScenario(null); setStep(0); }}
                            className="text-gray-400 hover:text-white"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-6 h-[500px] flex flex-col">
                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="bg-blue-50 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                                    <p className="text-gray-800">{chatSteps[step].speaker}: {chatSteps[step].text}</p>
                                </div>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="grid gap-3">
                            {chatSteps[step].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionClick(option.correct)}
                                    className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700 group-hover:text-indigo-900 font-medium">{option.text}</span>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                // Scenario List
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scenarios.map(scenario => (
                        <div key={scenario.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                            <div className="h-48 overflow-hidden relative">
                                <img src={scenario.image} alt={scenario.title} className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide ${scenario.difficulty === 'easy' ? 'bg-green-500' :
                                            scenario.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}>
                                        {scenario.difficulty}
                                    </span>
                                </div>
                                {scenario.completed && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="bg-white/90 rounded-full p-3">
                                            <CheckCircle className="w-8 h-8 text-green-600" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900">{scenario.title}</h3>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 flex-1">{scenario.description}</p>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-gray-400 text-xs">
                                        <RefreshCw className="w-4 h-4 mr-1" />
                                        {scenario.duration}
                                    </div>
                                    {scenario.completed ? (
                                        <div className="flex items-center text-green-600 font-bold">
                                            <Award className="w-5 h-5 mr-1" />
                                            {scenario.score}%
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setActiveScenario(scenario.id)}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Начать
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PhotoSimulatorsPage;
