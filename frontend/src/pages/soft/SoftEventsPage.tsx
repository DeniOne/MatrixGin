import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Video,
    Search
} from 'lucide-react';

interface Event {
    id: string;
    title: string;
    type: 'workshop' | 'webinar' | 'meetup';
    date: string;
    time: string;
    duration: string;
    speaker: string;
    speakerRole: string;
    speakerImage: string;
    image: string;
    participants: number;
    maxParticipants?: number;
    isOnline: boolean;
    tags: string[];
    registered: boolean;
}

const SoftEventsPage: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'workshop' | 'webinar'>('all');

    // Mock Data
    const events: Event[] = [
        {
            id: '1',
            title: 'Эффективная коммуникация в команде',
            type: 'workshop',
            date: '25 Ноября',
            time: '14:00',
            duration: '2 часа',
            speaker: 'Анна Петрова',
            speakerRole: 'HR Director',
            speakerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
            image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=400',
            participants: 12,
            maxParticipants: 20,
            isOnline: false,
            tags: ['Teamwork', 'Communication'],
            registered: true
        },
        {
            id: '2',
            title: 'Управление стрессом в высокий сезон',
            type: 'webinar',
            date: '28 Ноября',
            time: '11:00',
            duration: '1.5 часа',
            speaker: 'Игорь Соколов',
            speakerRole: 'Психолог',
            speakerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
            image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
            participants: 45,
            isOnline: true,
            tags: ['Well-being', 'Stress Management'],
            registered: false
        },
        {
            id: '3',
            title: 'Лидерство без полномочий',
            type: 'meetup',
            date: '2 Декабря',
            time: '18:30',
            duration: '3 часа',
            speaker: 'Мария Иванова',
            speakerRole: 'Team Lead',
            speakerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
            image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=400',
            participants: 28,
            maxParticipants: 50,
            isOnline: false,
            tags: ['Leadership', 'Networking'],
            registered: false
        }
    ];

    const filteredEvents = filter === 'all' ? events : events.filter(e => e.type === filter);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-gray-900">События и Воркшопы</h1>
                    <p className="text-[#717182] mt-1">Учитесь у лучших и обменивайтесь опытом с коллегами</p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#717182] w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Поиск событий..."
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                        />
                    </div>
                    <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-[#717182] hover:text-gray-700'
                                }`}
                        >
                            Все
                        </button>
                        <button
                            onClick={() => setFilter('workshop')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'workshop' ? 'bg-gray-100 text-gray-900' : 'text-[#717182] hover:text-gray-700'
                                }`}
                        >
                            Воркшопы
                        </button>
                        <button
                            onClick={() => setFilter('webinar')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'webinar' ? 'bg-gray-100 text-gray-900' : 'text-[#717182] hover:text-gray-700'
                                }`}
                        >
                            Вебинары
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Events List */}
                <div className="lg:col-span-2 space-y-6">
                    {filteredEvents.map(event => (
                        <div key={event.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row">
                            <div className="md:w-64 h-48 md:h-auto relative">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wide text-[#030213] ${event.type === 'workshop' ? 'bg-purple-600' :
                                        event.type === 'webinar' ? 'bg-blue-600' : 'bg-orange-500'
                                        }`}>
                                        {event.type === 'workshop' ? 'Воркшоп' :
                                            event.type === 'webinar' ? 'Вебинар' : 'Митап'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center text-sm text-[#717182] space-x-4">
                                        <span className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {event.date}
                                        </span>
                                        <span className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {event.time}
                                        </span>
                                    </div>
                                    {event.isOnline ? (
                                        <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            <Video className="w-3 h-3 mr-1" />
                                            Online
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            Офис
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-medium text-gray-900 mb-2">{event.title}</h3>

                                <div className="flex items-center mb-4">
                                    <img src={event.speakerImage} alt={event.speaker} className="w-6 h-6 rounded-full mr-2" />
                                    <span className="text-sm text-gray-600">
                                        <span className="font-medium text-gray-900">{event.speaker}</span>, {event.speakerRole}
                                    </span>
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-sm text-[#717182]">
                                        <Users className="w-4 h-4 mr-1" />
                                        {event.participants} {event.maxParticipants ? `/ ${event.maxParticipants}` : 'участников'}
                                    </div>

                                    {event.registered ? (
                                        <button className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200 cursor-default">
                                            Вы записаны
                                        </button>
                                    ) : (
                                        <button className="px-4 py-2 bg-indigo-600 text-[#030213] rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                            Записаться
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Calendar & Filters */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-medium text-gray-900 mb-4">Календарь событий</h3>
                        {/* Simplified Calendar Visual */}
                        <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                            <div className="text-[#717182] text-xs">Пн</div>
                            <div className="text-[#717182] text-xs">Вт</div>
                            <div className="text-[#717182] text-xs">Ср</div>
                            <div className="text-[#717182] text-xs">Чт</div>
                            <div className="text-[#717182] text-xs">Пт</div>
                            <div className="text-[#717182] text-xs">Сб</div>
                            <div className="text-[#717182] text-xs">Вс</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                            {/* Previous month days */}
                            <div className="p-2 text-gray-300">28</div>
                            <div className="p-2 text-gray-300">29</div>
                            <div className="p-2 text-gray-300">30</div>
                            <div className="p-2 text-gray-300">31</div>
                            {/* Current month days */}
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">1</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">2</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">3</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">4</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">5</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">6</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">7</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">8</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">9</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">10</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">11</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">12</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">13</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">14</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">15</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">16</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">17</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">18</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">19</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">20</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">21</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">22</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">23</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">24</div>
                            <div className="p-2 bg-indigo-600 text-[#030213] rounded-full font-medium shadow-md cursor-pointer">25</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">26</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">27</div>
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-full font-medium cursor-pointer">28</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">29</div>
                            <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">30</div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center text-xs text-[#717182] mb-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></div>
                                Воркшопы
                            </div>
                            <div className="flex items-center text-xs text-[#717182]">
                                <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                                Вебинары
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                        <h3 className="font-medium text-indigo-900 mb-2">Хотите выступить?</h3>
                        <p className="text-sm text-indigo-700 mb-4">Поделитесь своим опытом с коллегами. Мы поможем подготовить презентацию.</p>
                        <button className="w-full py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                            Стать спикером
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoftEventsPage;
