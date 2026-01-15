import React, { useState } from 'react';
import {
    Sun,
    Check,
    Flame,
    Zap,
    Smile,
    Moon
} from 'lucide-react';

interface Practice {
    id: string;
    title: string;
    description: string;
    duration: string;
    timeOfDay: 'morning' | 'day' | 'evening';
    completed: boolean;
    xp: number;
}

const SoftPracticesPage: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

    // Mock Data
    const weekDays = [
        { day: 20, name: 'Пн', status: 'completed' },
        { day: 21, name: 'Вт', status: 'completed' },
        { day: 22, name: 'Ср', status: 'completed' },
        { day: 23, name: 'Чт', status: 'completed' },
        { day: 24, name: 'Пт', status: 'current' },
        { day: 25, name: 'Сб', status: 'future' },
        { day: 26, name: 'Вс', status: 'future' },
    ];

    const practices: Practice[] = [
        {
            id: '1',
            title: 'Утренняя настройка',
            description: 'Запишите 3 главные цели на день.',
            duration: '5 мин',
            timeOfDay: 'morning',
            completed: true,
            xp: 50
        },
        {
            id: '2',
            title: 'Техника "Помодоро"',
            description: 'Сделайте один цикл глубокой работы без отвлечений.',
            duration: '25 мин',
            timeOfDay: 'day',
            completed: false,
            xp: 100
        },
        {
            id: '3',
            title: 'Благодарность',
            description: 'Вспомните 3 хороших события за день.',
            duration: '3 мин',
            timeOfDay: 'evening',
            completed: false,
            xp: 30
        }
    ];

    const getTimeIcon = (time: string) => {
        switch (time) {
            case 'morning': return <Sun className="w-5 h-5 text-orange-500" />;
            case 'day': return <Sun className="w-5 h-5 text-yellow-500" />;
            case 'evening': return <Moon className="w-5 h-5 text-indigo-500" />;
            default: return <Sun className="w-5 h-5" />;
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900">Микро-практики</h1>
                <p className="text-gray-500 mt-2">Маленькие шаги к большим изменениям. Выполняйте задания ежедневно.</p>
            </div>

            {/* Streak Card */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg mb-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Flame className="w-6 h-6 animate-pulse" />
                        <span className="font-bold text-lg">5 дней подряд!</span>
                    </div>
                    <p className="text-white/90 text-sm">Вы в ударе! Продолжайте в том же духе.</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold">Level 5</div>
                    <div className="text-xs opacity-80">Мастер привычек</div>
                </div>
            </div>

            {/* Calendar Strip */}
            <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                {weekDays.map((day) => (
                    <button
                        key={day.day}
                        onClick={() => setSelectedDay(day.day)}
                        className={`flex flex-col items-center justify-center w-12 h-16 rounded-lg transition-all ${selectedDay === day.day
                            ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                            : 'hover:bg-gray-50 text-gray-500'
                            }`}
                    >
                        <span className="text-xs font-medium mb-1">{day.name}</span>
                        <span className="text-lg font-bold">{day.day}</span>
                        {day.status === 'completed' && (
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Practices List */}
            <div className="space-y-4">
                {practices.map((practice) => (
                    <div
                        key={practice.id}
                        className={`bg-white rounded-xl border p-5 transition-all ${practice.completed
                            ? 'border-green-200 bg-green-50/30'
                            : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                            }`}
                    >
                        <div className="flex items-start">
                            <div className={`p-3 rounded-full mr-4 flex-shrink-0 ${practice.completed ? 'bg-green-100' : 'bg-gray-100'
                                }`}>
                                {practice.completed ? (
                                    <Check className="w-6 h-6 text-green-600" />
                                ) : (
                                    getTimeIcon(practice.timeOfDay)
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold text-lg ${practice.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                        {practice.title}
                                    </h3>
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full flex items-center">
                                        <Zap className="w-3 h-3 mr-1" />
                                        +{practice.xp} XP
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-3">{practice.description}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm text-gray-400">
                                        <div className="w-4 h-4 mr-1" />
                                        {practice.duration}
                                    </div>

                                    {!practice.completed && (
                                        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                                            Выполнить
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State / Motivation */}
            <div className="mt-8 text-center p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                <Smile className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                <h3 className="font-bold text-indigo-900">Все задания на сегодня?</h3>
                <p className="text-indigo-700 text-sm mt-1">Вы можете выбрать дополнительные практики из библиотеки или просто отдохнуть.</p>
            </div>
        </div>
    );
};

export default SoftPracticesPage;
