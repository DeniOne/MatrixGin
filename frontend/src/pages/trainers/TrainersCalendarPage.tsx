import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const TrainersCalendarPage: React.FC = () => {
    const sessions = [
        { id: '1', title: 'Наставничество: Мария Соколова', time: '10:00 - 12:00', date: '25 ноября', location: 'Студия А' },
        { id: '2', title: 'Обучающая смена: Портреты', time: '14:00 - 18:00', date: '25 ноября', location: 'Студия B' },
        { id: '3', title: 'Консультация: Группа новичков', time: '10:00 - 11:00', date: '26 ноября', location: 'Онлайн' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Календарь и Расписание</h1>

            <div className="bg-white rounded-xl border p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Ноябрь 2024</h2>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                        + Добавить слот
                    </button>
                </div>

                <div className="space-y-4">
                    {sessions.map(session => (
                        <div key={session.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-2">{session.title}</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {session.date}
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {session.time}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {session.location}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainersCalendarPage;
