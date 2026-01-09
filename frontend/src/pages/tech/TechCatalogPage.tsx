import React from 'react';
import { Camera, Lightbulb, Printer, Monitor, FileText, Download } from 'lucide-react';

const TechCatalogPage: React.FC = () => {
    const equipment = [
        {
            id: '1',
            name: 'Canon EOS R5',
            category: 'Камеры',
            icon: <Camera className="w-6 h-6" />,
            status: 'available',
            location: 'Студия А',
            manual: true
        },
        {
            id: '2',
            name: 'Godox AD600',
            category: 'Освещение',
            icon: <Lightbulb className="w-6 h-6" />,
            status: 'in-use',
            location: 'Студия B',
            manual: true
        },
        {
            id: '3',
            name: 'Epson SureColor P800',
            category: 'Принтеры',
            icon: <Printer className="w-6 h-6" />,
            status: 'maintenance',
            location: 'Печатный цех',
            manual: true
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'text-green-600 bg-green-50';
            case 'in-use': return 'text-blue-600 bg-blue-50';
            case 'maintenance': return 'text-orange-600 bg-orange-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available': return 'Доступно';
            case 'in-use': return 'Используется';
            case 'maintenance': return 'На обслуживании';
            default: return 'Неизвестно';
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Каталог Оборудования</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipment.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                {item.icon}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                                {getStatusText(item.status)}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                        <p className="text-sm text-gray-500 mb-4">📍 {item.location}</p>
                        {item.manual && (
                            <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center">
                                <FileText className="w-4 h-4 mr-2" />
                                Инструкция
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechCatalogPage;
