import React from 'react';
import { FileText, Download, BookOpen } from 'lucide-react';

const TrainersResourcesPage: React.FC = () => {
    const resources = [
        { id: '1', title: 'Методика обучения новичков', type: 'PDF', size: '2.4 MB' },
        { id: '2', title: 'Чек-лист первой смены', type: 'DOCX', size: '156 KB' },
        { id: '3', title: 'Шаблон плана развития', type: 'XLSX', size: '89 KB' },
        { id: '4', title: 'Гайд по обратной связи', type: 'PDF', size: '1.2 MB' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Ресурсы Наставника</h1>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
                <div className="flex items-center">
                    <BookOpen className="w-8 h-8 text-blue-600 mr-4" />
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">Библиотека методичек</h3>
                        <p className="text-sm text-gray-600">Все материалы для эффективного наставничества</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map(resource => (
                    <div key={resource.id} className="bg-white p-5 rounded-xl border hover:shadow-md transition-shadow group cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600 mr-4">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm mb-1">{resource.title}</h3>
                                    <p className="text-xs text-gray-500">{resource.type} • {resource.size}</p>
                                </div>
                            </div>
                            <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainersResourcesPage;
