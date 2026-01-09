import React, { useState } from 'react';
import {
    Book,
    Headphones,
    FileText,
    Search,
    Filter,
    Star,
    Clock,
    Download,
    PlayCircle,
    Bookmark
} from 'lucide-react';

interface Resource {
    id: string;
    title: string;
    author: string;
    type: 'book' | 'podcast' | 'article';
    duration: string;
    rating: number;
    image: string;
    tags: string[];
    isNew?: boolean;
}

const SoftLibraryPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'book' | 'podcast' | 'article'>('all');

    // Mock Data
    const resources: Resource[] = [
        {
            id: '1',
            title: 'Эмоциональный интеллект. Почему он может значить больше, чем IQ',
            author: 'Дэниел Гоулман',
            type: 'book',
            duration: '450 стр.',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300',
            tags: ['EQ', 'Psychology'],
            isNew: true
        },
        {
            id: '2',
            title: 'Как управлять командой в кризис',
            author: 'HBR Podcast',
            type: 'podcast',
            duration: '45 мин',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&q=80&w=300',
            tags: ['Leadership', 'Crisis Management']
        },
        {
            id: '3',
            title: '7 навыков высокоэффективных людей',
            author: 'Стивен Кови',
            type: 'book',
            duration: '380 стр.',
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300',
            tags: ['Productivity', 'Self-development']
        },
        {
            id: '4',
            title: 'Искусство переговоров: Главные принципы',
            author: 'Harvard Business Review',
            type: 'article',
            duration: '15 мин чтения',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=300',
            tags: ['Negotiation', 'Business']
        }
    ];

    const filteredResources = activeTab === 'all' ? resources : resources.filter(r => r.type === activeTab);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Библиотека знаний</h1>
                    <p className="text-gray-500 mt-1">Книги, подкасты и статьи для вашего развития</p>
                </div>

                <div className="mt-4 md:mt-0 w-full md:w-auto relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Поиск материалов..."
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Все
                </button>
                <button
                    onClick={() => setActiveTab('book')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${activeTab === 'book' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Book className="w-4 h-4 mr-2" /> Книги
                </button>
                <button
                    onClick={() => setActiveTab('podcast')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${activeTab === 'podcast' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Headphones className="w-4 h-4 mr-2" /> Подкасты
                </button>
                <button
                    onClick={() => setActiveTab('article')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${activeTab === 'article' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <FileText className="w-4 h-4 mr-2" /> Статьи
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredResources.map(resource => (
                    <div key={resource.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
                        <div className="h-48 overflow-hidden relative">
                            <img src={resource.image} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {resource.isNew && (
                                <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
                                    NEW
                                </div>
                            )}
                            <div className="absolute top-3 right-3">
                                <button className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-indigo-600 transition-colors">
                                    <Bookmark className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm flex items-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    {resource.type === 'podcast' ? <PlayCircle className="w-4 h-4 mr-2" /> : <Book className="w-4 h-4 mr-2" />}
                                    Открыть
                                </button>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
                                <span className={`px-2 py-0.5 rounded bg-gray-100 font-medium uppercase tracking-wide ${resource.type === 'book' ? 'text-blue-600 bg-blue-50' :
                                        resource.type === 'podcast' ? 'text-purple-600 bg-purple-50' : 'text-orange-600 bg-orange-50'
                                    }`}>
                                    {resource.type === 'book' ? 'Книга' : resource.type === 'podcast' ? 'Подкаст' : 'Статья'}
                                </span>
                                <span className="flex items-center">
                                    <Star className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
                                    {resource.rating}
                                </span>
                            </div>

                            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{resource.title}</h3>
                            <p className="text-sm text-gray-500 mb-3">{resource.author}</p>

                            <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                                <span className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {resource.duration}
                                </span>
                                <div className="flex space-x-1">
                                    {resource.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="bg-gray-50 px-1.5 py-0.5 rounded text-gray-500">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SoftLibraryPage;
