import React from 'react';
import { Search, BookOpen, ChevronRight } from 'lucide-react';

const TechTroubleshootPage: React.FC = () => {
    const guides = [
        { id: '1', title: 'Камера не включается', category: 'Камеры', views: 245 },
        { id: '2', title: 'Проблемы с балансом белого', category: 'Освещение', views: 189 },
        { id: '3', title: 'Принтер печатает с полосами', category: 'Принтеры', views: 156 },
        { id: '4', title: 'Компьютер тормозит при обработке', category: 'ПК', views: 312 }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-8">Устранение Неполадок</h1>

            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#717182] w-5 h-5" />
                <input
                    type="text"
                    placeholder="Поиск решений..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="space-y-3">
                {guides.map(guide => (
                    <div key={guide.id} className="bg-white p-4 rounded-lg border hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer group flex items-center justify-between">
                        <div className="flex items-center">
                            <BookOpen className="w-5 h-5 text-[#717182] mr-3 group-hover:text-indigo-600" />
                            <div>
                                <h3 className="font-medium text-gray-900">{guide.title}</h3>
                                <p className="text-xs text-[#717182]">{guide.category} • {guide.views} просмотров</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#717182] group-hover:text-indigo-600" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechTroubleshootPage;
