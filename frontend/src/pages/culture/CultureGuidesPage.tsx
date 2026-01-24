import React from 'react';
import { BookOpen, MessageCircle, Shield, Users } from 'lucide-react';

const CultureGuidesPage: React.FC = () => {
    const guides = [
        { id: '1', title: 'Правила эффективной коммуникации', icon: <MessageCircle className="w-6 h-6" />, color: 'blue' },
        { id: '2', title: 'Разрешение конфликтов', icon: <Shield className="w-6 h-6" />, color: 'red' },
        { id: '3', title: 'Работа в команде', icon: <Users className="w-6 h-6" />, color: 'green' },
        { id: '4', title: 'Обратная связь и признание', icon: <BookOpen className="w-6 h-6" />, color: 'purple' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-8">Гайдлайны Сообщества</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guides.map(guide => (
                    <div key={guide.id} className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow cursor-pointer group">
                        <div className={`w-12 h-12 bg-${guide.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-${guide.color}-600`}>
                            {guide.icon}
                        </div>
                        <h3 className="font-medium text-lg text-gray-900">{guide.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CultureGuidesPage;
