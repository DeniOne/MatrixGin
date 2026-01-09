import React, { useState } from 'react';
import {
    MessageSquare,
    Heart,
    Share2,
    MoreHorizontal,
    Image as ImageIcon,
    Send,
    ThumbsUp,
    Award
} from 'lucide-react';

interface Post {
    id: string;
    author: {
        name: string;
        avatar?: string;
        role: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    timeAgo: string;
    isLiked?: boolean;
    tags: string[];
}

const PhotoCommunityPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'feed' | 'battles' | 'discussions'>('feed');

    // Mock Data
    const posts: Post[] = [
        {
            id: '1',
            author: {
                name: 'Анна Смирнова',
                role: 'Фотограф (Pro)',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
            },
            content: 'Сегодня была невероятная съемка в стиле Cyberpunk! Использовали 3 источника света с цветными фильтрами. Как вам результат? 📸✨',
            image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=800',
            likes: 45,
            comments: 12,
            timeAgo: '2 часа назад',
            isLiked: true,
            tags: ['#cyberpunk', '#neon', '#portrait']
        },
        {
            id: '2',
            author: {
                name: 'Дмитрий Козлов',
                role: 'Наставник',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
            },
            content: 'Коллеги, напоминаю про важность общения с моделью во время съемки. Не молчите! Хвалите, направляйте, создавайте атмосферу. Это 50% успеха кадра. 👇',
            likes: 89,
            comments: 24,
            timeAgo: '5 часов назад',
            tags: ['#советы', '#работасмоделью']
        },
        {
            id: '3',
            author: {
                name: 'Мария Петрова',
                role: 'Стажёр',
            },
            content: 'Моя первая самостоятельная смена! Было страшно, но я справилась. Спасибо наставнику за поддержку! 🎉',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
            likes: 156,
            comments: 32,
            timeAgo: '1 день назад',
            tags: ['#дебют', '#стажировка']
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex space-x-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center">
                                <span className="font-bold text-gray-500">Я</span>
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Поделитесь своими успехами или задайте вопрос..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                                />
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                            <ImageIcon className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                            <Award className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center">
                                        <Send className="w-4 h-4 mr-2" />
                                        Опубликовать
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-4 border-b border-gray-200 pb-1">
                        <button
                            onClick={() => setActiveTab('feed')}
                            className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'feed' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Лента
                            {activeTab === 'feed' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('battles')}
                            className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'battles' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Фото-баттлы
                            {activeTab === 'battles' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('discussions')}
                            className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'discussions' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Обсуждения
                            {activeTab === 'discussions' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
                        </button>
                    </div>

                    {/* Posts */}
                    {posts.map(post => (
                        <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.name}&background=random`} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{post.author.name}</h3>
                                        <p className="text-xs text-gray-500">{post.author.role} • {post.timeAgo}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="px-4 pb-3">
                                <p className="text-gray-800 text-sm leading-relaxed mb-3">{post.content}</p>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="text-indigo-600 text-xs font-medium hover:underline cursor-pointer">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {post.image && (
                                <div className="w-full bg-gray-100">
                                    <img src={post.image} alt="Post content" className="w-full h-auto max-h-[500px] object-cover" />
                                </div>
                            )}

                            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex space-x-6">
                                    <button className={`flex items-center space-x-2 text-sm ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors`}>
                                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                        <span>{post.likes}</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                        <MessageSquare className="w-5 h-5" />
                                        <span>{post.comments}</span>
                                    </button>
                                </div>
                                <button className="text-gray-500 hover:text-gray-700">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Trending Topics */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <h3 className="font-bold text-gray-900 mb-4">Популярные темы</h3>
                        <div className="space-y-3">
                            {['#свет', '#позирование', '#обработка', '#клиенты', '#техника'].map(tag => (
                                <div key={tag} className="flex items-center justify-between group cursor-pointer">
                                    <span className="text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">{tag}</span>
                                    <span className="text-xs text-gray-400">120+ постов</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Contributors */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <h3 className="font-bold text-gray-900 mb-4">Топ авторов недели</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-xs text-gray-500">
                                        {i}
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2 bg-gray-100 rounded w-24 mb-1"></div>
                                        <div className="h-2 bg-gray-100 rounded w-16"></div>
                                    </div>
                                    <ThumbsUp className="w-4 h-4 text-gray-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoCommunityPage;
