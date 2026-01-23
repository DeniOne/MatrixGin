import React from 'react';
import {
    Award,
    Zap,
    Users,
    MessageSquare,
    Heart,
    Shield
} from 'lucide-react';

interface Badge {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    category: 'Skill' | 'Social' | 'Activity';
    level: number;
    maxLevel: number;
    progress: number;
    unlocked: boolean;
    dateUnlocked?: string;
}

const SoftBadgesPage: React.FC = () => {
    // Mock Data
    const badges: Badge[] = [
        {
            id: '1',
            title: 'Мастер эмпатии',
            description: 'Пройти курс по эмоциональному интеллекту и получить 5 лайков за поддержку коллег.',
            icon: <Heart className="w-8 h-8 text-pink-500" />,
            category: 'Skill',
            level: 1,
            maxLevel: 3,
            progress: 100,
            unlocked: true,
            dateUnlocked: '20.11.2024'
        },
        {
            id: '2',
            title: 'Душа компании',
            description: 'Активное участие в 10 обсуждениях в сообществе.',
            icon: <Users className="w-8 h-8 text-blue-500" />,
            category: 'Social',
            level: 2,
            maxLevel: 5,
            progress: 40,
            unlocked: true,
            dateUnlocked: '15.10.2024'
        },
        {
            id: '3',
            title: 'Железный оратор',
            description: 'Выступить спикером на 3 воркшопах.',
            icon: <MessageSquare className="w-8 h-8 text-purple-500" />,
            category: 'Skill',
            level: 0,
            maxLevel: 3,
            progress: 33,
            unlocked: false
        },
        {
            id: '4',
            title: 'Хранитель времени',
            description: 'Не пропустить ни одного дедлайна в течение месяца.',
            icon: <Shield className="w-8 h-8 text-green-500" />,
            category: 'Activity',
            level: 0,
            maxLevel: 1,
            progress: 80,
            unlocked: false
        },
        {
            id: '5',
            title: 'Инноватор',
            description: 'Предложить идею, которая будет внедрена в процессы.',
            icon: <Zap className="w-8 h-8 text-yellow-500" />,
            category: 'Activity',
            level: 0,
            maxLevel: 1,
            progress: 0,
            unlocked: false
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900">Стена Достижений</h1>
                <p className="text-gray-500 mt-2">Коллекционируйте награды за свое развитие и активность</p>
            </div>

            {/* Level Overview */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-12 max-w-4xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-6 md:mb-0">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 mr-6">
                            <Award className="w-12 h-12 text-white" />
                        </div>
                        <div>
                            <div className="text-sm font-medium opacity-80 uppercase tracking-wider">Текущий уровень</div>
                            <div className="text-4xl font-bold">Уровень 5</div>
                            <div className="text-sm opacity-90 mt-1">Гуру коммуникации</div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className="flex justify-between text-sm font-medium mb-2">
                            <span>1,250 XP</span>
                            <span>1,500 XP</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-3">
                            <div className="bg-white h-3 rounded-full shadow-sm" style={{ width: '83%' }}></div>
                        </div>
                        <div className="text-right text-xs opacity-70 mt-2">Осталось 250 XP до следующего уровня</div>
                    </div>
                </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map(badge => (
                    <div key={badge.id} className={`bg-white rounded-xl border p-6 flex flex-col items-center text-center transition-all ${badge.unlocked
                        ? 'border-indigo-100 shadow-sm hover:shadow-md'
                        : 'border-gray-200 bg-gray-50 opacity-70 grayscale'
                        }`}>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${badge.unlocked ? 'bg-indigo-50' : 'bg-gray-200'
                            }`}>
                            {badge.icon}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">{badge.title}</h3>
                        <p className="text-sm text-gray-500 mb-4 h-10">{badge.description}</p>

                        <div className="w-full mt-auto">
                            {badge.unlocked ? (
                                <div className="text-xs font-bold text-green-600 bg-green-50 py-1 px-3 rounded-full inline-block">
                                    Получен {badge.dateUnlocked}
                                </div>
                            ) : (
                                <div className="w-full">
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>Прогресс</span>
                                        <span>{badge.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div
                                            className="bg-indigo-500 h-1.5 rounded-full"
                                            style={{ width: `${badge.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SoftBadgesPage;
