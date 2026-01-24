import React, { useState } from 'react';
import {
    Heart,
    Users,
    Target,
    Lightbulb,
    PlayCircle,
    Star,
    ThumbsUp,
    MessageCircle
} from 'lucide-react';

interface Story {
    id: string;
    title: string;
    value: 'Клиентоцентричность' | 'Профессионализм' | 'Командная работа' | 'Инновации';
    author: string;
    authorRole: string;
    authorImage: string;
    thumbnail: string;
    type: 'video' | 'article';
    duration: string;
    likes: number;
    comments: number;
}

const CultureValuesPage: React.FC = () => {
    const [selectedValue, setSelectedValue] = useState<string>('all');

    const values = [
        { name: 'all', label: 'Все ценности', icon: <Star className="w-5 h-5" />, color: 'gray' },
        { name: 'Клиентоцентричность', label: 'Клиент в центре', icon: <Heart className="w-5 h-5" />, color: 'red' },
        { name: 'Профессионализм', label: 'Профессионализм', icon: <Target className="w-5 h-5" />, color: 'blue' },
        { name: 'Командная работа', label: 'Команда', icon: <Users className="w-5 h-5" />, color: 'green' },
        { name: 'Инновации', label: 'Инновации', icon: <Lightbulb className="w-5 h-5" />, color: 'purple' }
    ];

    const stories: Story[] = [
        {
            id: '1',
            title: 'Как мы спасли свадьбу за 2 часа до церемонии',
            value: 'Клиентоцентричность',
            author: 'Анна Иванова',
            authorRole: 'Senior фотограф',
            authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
            thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
            type: 'video',
            duration: '4:20',
            likes: 142,
            comments: 23
        },
        {
            id: '2',
            title: 'От стажёра до тимлида: мой путь развития',
            value: 'Профессионализм',
            author: 'Дмитрий Волков',
            authorRole: 'Руководитель студии',
            authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
            thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600',
            type: 'article',
            duration: '5 мин чтения',
            likes: 89,
            comments: 12
        },
        {
            id: '3',
            title: 'Как наша команда справилась с высоким сезоном',
            value: 'Командная работа',
            author: 'Елена Смирнова',
            authorRole: 'Team Lead',
            authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100',
            thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
            type: 'video',
            duration: '6:15',
            likes: 203,
            comments: 34
        }
    ];

    const filteredStories = selectedValue === 'all' ? stories : stories.filter(s => s.value === selectedValue);

    const getValueColor = (value: string) => {
        const val = values.find(v => v.name === value);
        return val?.color || 'gray';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-medium text-gray-900">Библиотека Ценностей</h1>
                <p className="text-[#717182] mt-1">Истории воплощения наших ценностей в реальной работе</p>
            </div>

            {/* Values Filter */}
            <div className="flex flex-wrap gap-3 mb-10">
                {values.map((value) => (
                    <button
                        key={value.name}
                        onClick={() => setSelectedValue(value.name)}
                        className={`flex items-center px-4 py-2.5 rounded-xl font-medium transition-all ${selectedValue === value.name
                                ? `bg-${value.color}-600 text-[#030213] shadow-md`
                                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {value.icon}
                        <span className="ml-2">{value.label}</span>
                    </button>
                ))}
            </div>

            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map((story) => (
                    <div key={story.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                        <div className="h-48 relative overflow-hidden bg-gray-100">
                            <img src={story.thumbnail} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {story.type === 'video' && (
                                <div className="absolute inset-0 bg-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                        <PlayCircle className="w-10 h-10 text-indigo-600 fill-current" />
                                    </div>
                                </div>
                            )}
                            <div className="absolute top-3 right-3 bg-white/70 text-[#030213] px-2 py-1 rounded text-xs font-medium">
                                {story.duration}
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-3">
                                <span className={`text-xs font-medium uppercase tracking-wide px-2 py-1 rounded bg-${getValueColor(story.value)}-100 text-${getValueColor(story.value)}-700`}>
                                    {story.value}
                                </span>
                            </div>
                            <h3 className="font-medium text-lg text-gray-900 mb-3 line-clamp-2">{story.title}</h3>
                            <div className="flex items-center mb-4">
                                <img src={story.authorImage} alt={story.author} className="w-8 h-8 rounded-full mr-2" />
                                <div className="text-sm">
                                    <div className="font-medium text-gray-900">{story.author}</div>
                                    <div className="text-[#717182] text-xs">{story.authorRole}</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex items-center text-[#717182] text-sm space-x-4">
                                    <span className="flex items-center">
                                        <ThumbsUp className="w-4 h-4 mr-1" />
                                        {story.likes}
                                    </span>
                                    <span className="flex items-center">
                                        <MessageCircle className="w-4 h-4 mr-1" />
                                        {story.comments}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CultureValuesPage;
