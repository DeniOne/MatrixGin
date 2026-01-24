import React from 'react';
import { CheckCircle, AlertTriangle, FileText } from 'lucide-react';

const TechSecurityPage: React.FC = () => {
    const policies = [
        { id: '1', title: 'Политика информационной безопасности', status: 'read', date: '15.11.2024' },
        { id: '2', title: 'Правила безопасной работы в сети', status: 'pending', date: null },
        { id: '3', title: 'Инструкция по защите данных клиентов', status: 'read', date: '10.10.2024' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-8">IT-Безопасность</h1>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-medium text-red-900 mb-1">Внимание!</h3>
                        <p className="text-sm text-red-800">У вас есть непрочитанные политики безопасности. Пожалуйста, ознакомьтесь с ними.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {policies.map(policy => (
                    <div key={policy.id} className="bg-white p-6 rounded-xl border flex items-center justify-between">
                        <div className="flex items-center">
                            <FileText className="w-6 h-6 text-indigo-600 mr-4" />
                            <div>
                                <h3 className="font-medium text-gray-900">{policy.title}</h3>
                                {policy.status === 'read' && (
                                    <p className="text-xs text-green-600 flex items-center mt-1">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Прочитано {policy.date}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button className={`px-4 py-2 rounded-lg text-sm font-medium ${policy.status === 'read'
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-indigo-600 text-[#030213] hover:bg-indigo-700'
                            }`}>
                            {policy.status === 'read' ? 'Повторить' : 'Прочитать'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechSecurityPage;
