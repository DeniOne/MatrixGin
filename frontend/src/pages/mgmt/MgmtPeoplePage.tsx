import React from 'react';
import { FileText, Users, BarChart3, Download } from 'lucide-react';

const MgmtPeoplePage: React.FC = () => {
    const tools = [
        { id: '1', title: 'Шаблон 1:1 встречи', type: 'template', icon: <FileText className="w-5 h-5" /> },
        { id: '2', title: 'Карточка Роли (OFS)', type: 'guide', icon: <BarChart3 className="w-5 h-5" /> },
        { id: '3', title: 'Принципы Взаимозависимости', type: 'process', icon: <Users className="w-5 h-5" /> },
        { id: '4', title: 'Соглашение об Уровне Сервиса (SLA)', type: 'template', icon: <FileText className="w-5 h-5" /> }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-8">People Ops</h1>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border border-indigo-100">
                <h2 className="font-medium text-gray-900 mb-2">Инструменты для управления людьми</h2>
                <p className="text-sm text-gray-600">Готовые шаблоны и гайды для эффективной работы с командой</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map(tool => (
                    <div key={tool.id} className="bg-white p-5 rounded-xl border hover:shadow-md transition-shadow group cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 mr-4">
                                    {tool.icon}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{tool.title}</h3>
                                    <p className="text-xs text-[#717182] capitalize">{tool.type}</p>
                                </div>
                            </div>
                            <Download className="w-5 h-5 text-[#717182] group-hover:text-indigo-600" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MgmtPeoplePage;
