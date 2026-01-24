import React from 'react';
import { TrendingUp } from 'lucide-react';

const CultureSurveysPage: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-8">Пульс-опросы</h1>

            <div className="bg-white rounded-xl border p-8 shadow-sm mb-6">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Насколько вы удовлетворены текущей рабочей средой?</h2>
                <div className="flex space-x-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                        <button
                            key={score}
                            className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all font-medium text-gray-700 hover:text-indigo-600"
                        >
                            {score}
                        </button>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-[#717182] mt-2">
                    <span>Совсем нет</span>
                    <span>Полностью</span>
                </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-1">NPS текущего месяца</h3>
                        <p className="text-sm text-gray-600">Индекс лояльности сотрудников</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-medium text-green-600">+42</div>
                        <div className="text-xs text-[#717182] flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" /> +5 за месяц
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CultureSurveysPage;
