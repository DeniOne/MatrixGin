import React, { useState } from 'react';
import {
    Search,
    Download,
    FileText,
    Image,
    Video,
    Grid,
    List,
    Star
} from 'lucide-react';

interface Resource {
    id: string;
    title: string;
    type: 'preset' | 'guide' | 'checklist' | 'video';
    category: string;
    author: string;
    downloads: number;
    rating: number;
    size: string;
    date: string;
    preview?: string;
    isNew?: boolean;
}

const PhotoLibraryPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterType, setFilterType] = useState<string>('all');

    // Mock Data
    const resources: Resource[] = [
        {
            id: '1',
            title: 'Matrix Color Pack 2024',
            type: 'preset',
            category: 'Обработка',
            author: 'Арт-директор',
            downloads: 1250,
            rating: 4.9,
            size: '15 MB',
            date: '20.11.2024',
            preview: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=300',
            isNew: true
        },
        {
            id: '2',
            title: 'Гайд по позированию: Дети',
            type: 'guide',
            category: 'Съемка',
            author: 'Мария Иванова',
            downloads: 850,
            rating: 4.8,
            size: '5.2 MB',
            date: '15.11.2024',
            preview: 'https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?auto=format&fit=crop&q=80&w=300'
        },
        {
            id: '3',
            title: 'Чек-лист подготовки студии',
            type: 'checklist',
            category: 'Организация',
            author: 'Администрация',
            downloads: 2100,
            rating: 5.0,
            size: '0.5 MB',
            date: '01.11.2024'
        },
        {
            id: '4',
            title: 'Свет: Схемы для Fashion',
            type: 'guide',
            category: 'Свет',
            author: 'Дмитрий Петров',
            downloads: 670,
            rating: 4.7,
            size: '12 MB',
            date: '10.11.2024',
            preview: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=300'
        },
        {
            id: '5',
            title: 'Ретушь кожи: Быстрый метод',
            type: 'video',
            category: 'Обработка',
            author: 'Елена Сидорова',
            downloads: 920,
            rating: 4.9,
            size: '150 MB',
            date: '05.11.2024',
            preview: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=300'
        }
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'preset': return <Image className="w-5 h-5 text-purple-500" />;
            case 'guide': return <FileText className="w-5 h-5 text-blue-500" />;
            case 'checklist': return <FileText className="w-5 h-5 text-green-500" />;
            case 'video': return <Video className="w-5 h-5 text-red-500" />;
            default: return <FileText className="w-5 h-5 text-[#717182]" />;
        }
    };

    const filteredResources = filterType === 'all'
        ? resources
        : resources.filter(r => r.type === filterType);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-gray-900">Библиотека ресурсов</h1>
                    <p className="text-[#717182] mt-1">Пресеты, гайды, чек-листы и полезные материалы</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#717182] w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Поиск материалов..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-[#717182] hover:text-gray-600'}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-[#717182] hover:text-gray-600'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex overflow-x-auto pb-4 mb-4 space-x-2 scrollbar-hide">
                {['all', 'preset', 'guide', 'checklist', 'video'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterType === type
                            ? 'bg-indigo-600 text-[#030213]'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {type === 'all' ? 'Все материалы' :
                            type === 'preset' ? 'Пресеты' :
                                type === 'guide' ? 'Гайды' :
                                    type === 'checklist' ? 'Чек-листы' : 'Видео'}
                    </button>
                ))}
            </div>

            {/* Grid View */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredResources.map(resource => (
                        <div key={resource.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                {resource.preview ? (
                                    <img src={resource.preview} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <FileText className="w-12 h-12" />
                                    </div>
                                )}
                                {resource.isNew && (
                                    <span className="absolute top-2 right-2 bg-green-500 text-[#030213] text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                                        NEW
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm flex items-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                        <Download className="w-4 h-4 mr-2" />
                                        Скачать
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-[#717182] uppercase tracking-wider">{resource.category}</span>
                                    <div className="flex items-center text-yellow-500 text-xs font-medium">
                                        <Star className="w-3 h-3 mr-1 fill-current" />
                                        {resource.rating}
                                    </div>
                                </div>
                                <h3 className="font-medium text-gray-900 mb-1 line-clamp-1" title={resource.title}>{resource.title}</h3>
                                <div className="flex items-center text-xs text-[#717182] mb-4">
                                    <span className="mr-2">{resource.author}</span>
                                    <span>• {resource.date}</span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center text-[#717182] text-xs">
                                        {getIcon(resource.type)}
                                        <span className="ml-2 capitalize">{resource.type}</span>
                                    </div>
                                    <span className="text-xs font-medium text-[#717182]">{resource.size}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#717182] uppercase tracking-wider">Название</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#717182] uppercase tracking-wider">Категория</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#717182] uppercase tracking-wider">Автор</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#717182] uppercase tracking-wider">Дата</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-[#717182] uppercase tracking-wider">Размер</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-[#717182] uppercase tracking-wider">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredResources.map(resource => (
                                <tr key={resource.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                                {getIcon(resource.type)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                                                <div className="text-xs text-[#717182] flex items-center mt-0.5">
                                                    <Download className="w-3 h-3 mr-1" /> {resource.downloads} скачиваний
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#717182]">
                                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                                            {resource.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#717182]">
                                        {resource.author}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#717182]">
                                        {resource.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#717182] text-right">
                                        {resource.size}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                                            Скачать
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PhotoLibraryPage;
