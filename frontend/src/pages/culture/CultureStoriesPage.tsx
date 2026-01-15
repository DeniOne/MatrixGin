import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

const CultureStoriesPage: React.FC = () => {
    const stories = [
        {
            id: '1',
            author: 'Мария Соколова',
            role: 'Ретушер',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
            text: 'Огромное спасибо Анне за помощь в освоении новых техник ретуши! Благодаря её менторству я повысила свой уровень и теперь работаю с VIP-клиентами.',
            likes: 47,
            comments: 8
        },
        {
            id: '2',
            author: 'Дмитрий Иванов',
            role: 'Фотограф',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
            text: 'Наша команда провела невероятную семейную фотосессию для клиента с особыми потребностями. Это было непросто, но мы справились и получили искренние слезы радости!',
            likes: 89,
            comments: 15
        }
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Истории Успеха</h1>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                    Поделиться историей
                </button>
            </div>
            <div className="space-y-6">
                {stories.map(story => (
                    <div key={story.id} className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center mb-4">
                            <img src={story.avatar} alt={story.author} className="w-12 h-12 rounded-full mr-3" />
                            <div>
                                <div className="font-bold text-gray-900">{story.author}</div>
                                <div className="text-sm text-gray-500">{story.role}</div>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4">{story.text}</p>
                        <div className="flex items-center space-x-6 text-gray-500 text-sm">
                            <button className="flex items-center hover:text-red-600 transition-colors">
                                <Heart className="w-4 h-4 mr-1" /> {story.likes}
                            </button>
                            <button className="flex items-center hover:text-indigo-600 transition-colors">
                                <MessageCircle className="w-4 h-4 mr-1" /> {story.comments}
                            </button>
                            <button className="flex items-center hover:text-indigo-600 transition-colors">
                                <Share2 className="w-4 h-4 mr-1" /> Поделиться
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CultureStoriesPage;
