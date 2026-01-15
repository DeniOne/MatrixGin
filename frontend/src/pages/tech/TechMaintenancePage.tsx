import React from 'react';
import { Wrench } from 'lucide-react';

const TechMaintenancePage: React.FC = () => {
    const tickets = [
        { id: '1', equipment: 'Canon EOS R5', issue: 'Чистка матрицы', priority: 'high', status: 'open', date: '24.11.2024' },
        { id: '2', equipment: 'Godox AD600', issue: 'Плановое ТО', priority: 'medium', status: 'in-progress', date: '22.11.2024' },
        { id: '3', equipment: 'Epson P800', issue: 'Замена картриджа', priority: 'low', status: 'completed', date: '20.11.2024' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Обслуживание и Инциденты</h1>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                    Создать заявку
                </button>
            </div>
            <div className="space-y-4">
                {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-white p-6 rounded-xl border flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Wrench className="w-6 h-6 text-gray-400" />
                            <div>
                                <h3 className="font-bold text-gray-900">{ticket.equipment}</h3>
                                <p className="text-sm text-gray-600">{ticket.issue}</p>
                                <p className="text-xs text-gray-400 mt-1">Создано: {ticket.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`text-xs font-bold px-2 py-1 rounded ${ticket.status === 'completed' ? 'bg-green-100 text-green-700' :
                                ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                {ticket.status === 'completed' ? 'Выполнено' :
                                    ticket.status === 'in-progress' ? 'В работе' : 'Открыто'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechMaintenancePage;
