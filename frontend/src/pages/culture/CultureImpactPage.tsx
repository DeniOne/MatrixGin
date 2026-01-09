import React from 'react';
import { TrendingUp, TrendingDown, Users, Clock, Heart } from 'lucide-react';

const CultureImpactPage: React.FC = () => {
    const metrics = [
        { id: '1', title: 'Вовлечённость', value: '78%', change: '+5%', trend: 'up', icon: <Heart className="w-5 h-5" /> },
        { id: '2', title: 'Текучка кадров', value: '8%', change: '-2%', trend: 'down', icon: <Users className="w-5 h-5" /> },
        { id: '3', title: 'Средний срок работы', value: '2.4 года', change: '+0.3', trend: 'up', icon: <Clock className="w-5 h-5" /> }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Метрики Влияния</h1>
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
                            <span className={`ml-2 text-sm font-medium flex items-center ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {metric.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                {metric.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-4">Динамика вовлечённости</h2>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    График (placeholder)
                </div>
            </div>
        </div>
    );
};

export default CultureImpactPage;
