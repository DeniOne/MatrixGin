import React from 'react';
import { Activity, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

const TechAnalyticsPage: React.FC = () => {
    const metrics = [
        { id: '1', title: 'Общая доступность', value: '96.5%', change: '+2%', trend: 'up', icon: <Activity className="w-5 h-5" /> },
        { id: '2', title: 'Среднее время простоя', value: '2.4ч', change: '-0.5ч', trend: 'down', icon: <Clock className="w-5 h-5" /> },
        { id: '3', title: 'Активные инциденты', value: '3', change: '+1', trend: 'up', icon: <AlertTriangle className="w-5 h-5" /> }
    ];

    const equipment = [
        { name: 'Canon EOS R5', uptime: 98, lastMaintenance: '3 дня назад' },
        { name: 'Godox AD600', uptime: 95, lastMaintenance: '1 неделю назад' },
        { name: 'Epson P800', uptime: 92, lastMaintenance: 'Сегодня' }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Аналитика Активов</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {metrics.map(metric => (
                    <div key={metric.id} className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                {metric.icon}
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                            <span className={`ml-2 text-sm font-medium flex items-center ${(metric.trend === 'up' && metric.id === '1') || metric.trend === 'down' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {metric.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-4">Состояние оборудования</h2>
                <div className="space-y-4">
                    {equipment.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
                            <div>
                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                <p className="text-xs text-gray-500">Последнее ТО: {item.lastMaintenance}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-gray-900">{item.uptime}%</div>
                                <div className="text-xs text-gray-500">uptime</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TechAnalyticsPage;
