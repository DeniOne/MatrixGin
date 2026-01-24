import React from 'react';
import { TrendingUp, Users, Star, Target } from 'lucide-react';

const TrainersMetricsPage: React.FC = () => {
    const metrics = [
        { id: '1', title: 'NPS стажёров', value: '85', icon: <Star className="w-5 h-5" />, trend: '+5' },
        { id: '2', title: 'Удержание', value: '92%', icon: <Users className="w-5 h-5" />, trend: '+3%' },
        { id: '3', title: 'Рост KPI учеников', value: '+28%', icon: <Target className="w-5 h-5" />, trend: '+8%' }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-8">Метрики Наставника</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {metrics.map(metric => (
                    <div key={metric.id} className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-[#717182]">{metric.title}</h3>
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                {metric.icon}
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-medium text-gray-900">{metric.value}</span>
                            <span className="ml-2 text-sm font-medium text-green-600 flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {metric.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border p-6">
                <h2 className="font-medium text-gray-900 mb-4">Динамика эффективности</h2>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-[#717182]">
                    График (placeholder)
                </div>
            </div>
        </div>
    );
};

export default TrainersMetricsPage;
