import React from 'react';
import { MessageCircle, BookOpen, Target, Users } from 'lucide-react';

const MgmtCoachingPage: React.FC = () => {
    const resources = [
        { id: '1', title: 'GROW модель коучинга', type: 'Методика', icon: <Target className="w-5 h-5" /> },
        { id: '2', title: 'Активное слушание', type: 'Техника', icon: <MessageCircle className="w-5 h-5" /> },
        { id: '3', title: 'Развивающая обратная связь', type: 'Гайд', icon: <BookOpen className="w-5 h-5" /> },
        { id: '4', title: 'Коучинг в команде', type: 'Практика', icon: <Users className="w-5 h-5" /> }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Коучинг и Наставничество</h1>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 mb-8 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Toolkit коуча</h2>
                <p className="text-gray-600 mb-4">Методики и инструменты для развития сотрудников</p>
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
                    Начать коуч-сессию
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map(resource => (
                    <div key={resource.id} className="bg-white p-5 rounded-xl border hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg text-purple-600 mr-4">
                                {resource.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-purple-600">{resource.title}</h3>
                                <p className="text-xs text-gray-500">{resource.type}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MgmtCoachingPage;
