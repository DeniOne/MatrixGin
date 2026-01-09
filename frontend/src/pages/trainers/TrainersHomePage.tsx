import React from 'react';
import { Trophy, Award, TrendingUp, Users, Star } from 'lucide-react';

const TrainersHomePage: React.FC = () => {
    const topTrainers = [
        { id: '1', name: 'Анна Иванова', rating: 4.9, students: 45, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
        { id: '2', name: 'Дмитрий Волков', rating: 4.8, students: 38, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
        { id: '3', name: 'Елена Петрова', rating: 4.7, students: 32, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100' }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Институт Обучающих</h1>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 mb-8 border border-yellow-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Стань наставником!</h2>
                        <p className="text-gray-600 mb-4">Получи аккредит ацию и начни зарабатывать, делясь знаниями</p>
                        <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700">
                            Начать путь тренера
                        </button>
                    </div>
                    <Trophy className="w-24 h-24 text-yellow-600" />
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-6">🏆 Топ наставников месяца</h2>
            <div className="space-y-4">
                {topTrainers.map((trainer, idx) => (
                    <div key={trainer.id} className="bg-white p-6 rounded-xl border flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="text-3xl font-bold text-gray-300 mr-4 w-8">#{idx + 1}</div>
                            <img src={trainer.avatar} alt={trainer.name} className="w-14 h-14 rounded-full mr-4" />
                            <div>
                                <h3 className="font-bold text-gray-900">{trainer.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                                        {trainer.rating}
                                    </span>
                                    <span className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        {trainer.students} учеников
                                    </span>
                                </div>
                            </div>
                        </div>
                        {idx === 0 && <Trophy className="w-8 h-8 text-yellow-500" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainersHomePage;
