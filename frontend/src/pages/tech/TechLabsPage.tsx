import React from 'react';
import { Beaker, Lock } from 'lucide-react';

const TechLabsPage: React.FC = () => {
    const labs = [
        { id: '1', title: 'Тестирование новых пресетов AI', status: 'active', access: true },
        { id: '2', title: 'Бета-тест нового ПО для ретуши', status: 'active', access: true },
        { id: '3', title: 'Песочница для экспериментов', status: 'maintenance', access: false }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-2">Песочница и Лаборатория</h1>
            <p className="text-[#717182] mb-8">Тестируйте новые технологии и функции в безопасной среде</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {labs.map(lab => (
                    <div key={lab.id} className={`bg-white rounded-xl border p-6 ${lab.access ? 'hover:shadow-md transition-shadow' : 'opacity-70'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <Beaker className="w-8 h-8 text-purple-600" />
                            {!lab.access && <Lock className="w-5 h-5 text-[#717182]" />}
                        </div>
                        <h3 className="font-medium text-lg text-gray-900 mb-2">{lab.title}</h3>
                        <p className={`text-xs font-medium mb-4 ${lab.status === 'active' ? 'text-green-600' : 'text-orange-600'
                            }`}>
                            {lab.status === 'active' ? '🟢 Активно' : '🔧 На обслуживании'}
                        </p>
                        <button
                            className={`w-full py-2 rounded-lg text-sm font-medium ${lab.access
                                ? 'bg-indigo-600 text-[#030213] hover:bg-indigo-700'
                                : 'bg-gray-200 text-[#717182] cursor-not-allowed'
                                }`}
                            disabled={!lab.access}
                        >
                            {lab.access ? 'Войти в лабораторию' : 'Доступ ограничен'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechLabsPage;
