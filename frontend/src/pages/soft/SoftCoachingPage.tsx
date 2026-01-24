import React from 'react';
import {
    Calendar,
    Clock,
    User,
    Target,
    CheckCircle,
    Video
} from 'lucide-react';

interface Coach {
    id: string;
    name: string;
    role: string;
    specialization: string[];
    rating: number;
    image: string;
    availableSlots: string[];
}

interface Goal {
    id: string;
    title: string;
    deadline: string;
    status: 'in_progress' | 'completed' | 'blocked';
    progress: number;
}

const SoftCoachingPage: React.FC = () => {
    // const [selectedCoach, setSelectedCoach] = useState<string | null>(null);

    // Mock Data
    const coaches: Coach[] = [
        {
            id: '1',
            name: 'Елена Смирнова',
            role: 'Senior HR BP',
            specialization: ['Карьерный рост', 'Лидерство', 'Конфликты'],
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
            availableSlots: ['10:00', '14:00', '16:30']
        },
        {
            id: '2',
            name: 'Алексей Волков',
            role: 'Бизнес-тренер',
            specialization: ['Публичные выступления', 'Переговоры'],
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
            availableSlots: ['11:00', '15:00']
        }
    ];

    const goals: Goal[] = [
        {
            id: '1',
            title: 'Стать тимлидом команды ретушеров',
            deadline: '31.12.2024',
            status: 'in_progress',
            progress: 65
        },
        {
            id: '2',
            title: 'Провести 5 успешных переговоров',
            deadline: '15.11.2024',
            status: 'completed',
            progress: 100
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-gray-900">Коучинг и Менторство</h1>
                    <p className="text-[#717182] mt-1">Работайте с наставниками для достижения своих карьерных целей</p>
                </div>
                <button className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-[#030213] rounded-lg font-medium hover:bg-indigo-700 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Добавить цель
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coaches List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-medium text-gray-900 flex items-center">
                        <User className="w-5 h-5 mr-2 text-indigo-600" />
                        Доступные менторы
                    </h2>

                    <div className="grid gap-6">
                        {coaches.map(coach => (
                            <div key={coach.id} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                                <div className="flex-shrink-0">
                                    <img src={coach.image} alt={coach.name} className="w-24 h-24 rounded-full object-cover border-4 border-indigo-50" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{coach.name}</h3>
                                            <p className="text-indigo-600 font-medium text-sm">{coach.role}</p>
                                        </div>
                                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-xs font-medium text-yellow-700">
                                            <span className="mr-1">★</span> {coach.rating}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {coach.specialization.map(spec => (
                                            <span key={spec} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex space-x-2">
                                            {coach.availableSlots.map(slot => (
                                                <button key={slot} className="px-3 py-1 border border-gray-200 rounded text-sm hover:border-indigo-500 hover:text-indigo-600 transition-colors">
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                        <button className="px-4 py-2 bg-indigo-600 text-[#030213] rounded-lg text-sm font-medium hover:bg-indigo-700">
                                            Записаться
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Goals & Upcoming Sessions */}
                <div className="space-y-8">
                    {/* Goals Widget */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <Target className="w-5 h-5 mr-2 text-red-500" />
                            Мои цели
                        </h2>
                        <div className="space-y-4">
                            {goals.map(goal => (
                                <div key={goal.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`font-medium text-sm ${goal.status === 'completed' ? 'text-[#717182] line-through' : 'text-gray-900'}`}>
                                            {goal.title}
                                        </h3>
                                        {goal.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-[#717182] mb-2">
                                        <span>Дедлайн: {goal.deadline}</span>
                                        <span>{goal.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className={`h-1.5 rounded-full ${goal.status === 'completed' ? 'bg-green-500' : 'bg-indigo-600'}`}
                                            style={{ width: `${goal.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 text-center text-sm text-indigo-600 font-medium hover:text-indigo-800">
                            Показать все цели
                        </button>
                    </div>

                    {/* Upcoming Session */}
                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 text-[#030213] shadow-lg">
                        <h2 className="text-lg font-medium mb-4 flex items-center">
                            <Video className="w-5 h-5 mr-2" />
                            Ближайшая сессия
                        </h2>
                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                            <div className="flex items-center mb-3">
                                <img src={coaches[0].image} alt="Коуч" className="w-10 h-10 rounded-full mr-3 border-2 border-white/20" />
                                <div>
                                    <div className="font-medium text-sm">Елена Смирнова</div>
                                    <div className="text-xs opacity-70">Review прогресса</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm mb-4">
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1 opacity-70" />
                                    Завтра
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1 opacity-70" />
                                    10:00
                                </div>
                            </div>
                            <button className="w-full py-2 bg-white text-indigo-900 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
                                Подключиться
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoftCoachingPage;
