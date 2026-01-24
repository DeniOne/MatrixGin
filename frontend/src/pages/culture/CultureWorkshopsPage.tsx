import React from 'react';
import { Calendar, Users, MapPin } from 'lucide-react';

const CultureWorkshopsPage: React.FC = () => {
    const workshops = [
        {
            id: '1',
            title: 'Тимбилдинг: Квест в городе',
            date: '2 Декабря',
            time: '14:00',
            location: 'Центр города',
            participants: 24,
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: '2',
            title: 'Ретрит команды менеджеров',
            date: '15 Декабря',
            time: '10:00',
            location: 'Загородный клуб',
            participants: 12,
            image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=400'
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-8">Командные Воркшопы</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {workshops.map(ws => (
                    <div key={ws.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
                        <img src={ws.image} alt={ws.title} className="w-full h-48 object-cover" />
                        <div className="p-6">
                            <h3 className="font-medium text-lg text-gray-900 mb-4">{ws.title}</h3>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" /> {ws.date}, {ws.time}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" /> {ws.location}
                                </div>
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-2" /> {ws.participants} участников
                                </div>
                            </div>
                            <button className="w-full py-2 bg-indigo-600 text-[#030213] rounded-lg font-medium hover:bg-indigo-700">
                                Записаться
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CultureWorkshopsPage;
