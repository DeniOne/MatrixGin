import React from 'react';
import { Star, TrendingUp } from 'lucide-react';

const TrainersQAPage: React.FC = () => {
    const audits = [
        { id: '1', session: 'Обучающая смена 24.11', score: 4.8, status: 'excellent', auditor: 'Петр Сергеев' },
        { id: '2', session: 'Наставничество 20.11', score: 4.5, status: 'good', auditor: 'Елена Волкова' },
        { id: '3', session: 'Консультация 15.11', score: 4.2, status: 'good', auditor: 'Дмитрий Козлов' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-8">Контроль Качества</h1>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-[#717182] mb-1">Средний балл качества</h3>
                        <div className="text-3xl font-medium text-gray-900 flex items-center">
                            4.6
                            <Star className="w-6 h-6 text-yellow-500 ml-2 fill-current" />
                        </div>
                    </div>
                    <TrendingUp className="w-12 h-12 text-green-600" />
                </div>
            </div>

            <h2 className="text-xl font-medium text-gray-900 mb-4">История аудитов</h2>
            <div className="space-y-3">
                {audits.map(audit => (
                    <div key={audit.id} className="bg-white p-5 rounded-xl border">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">{audit.session}</h3>
                            <div className="flex items-center">
                                <span className="text-lg font-medium text-gray-900 mr-1">{audit.score}</span>
                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-[#717182]">Аудитор: {audit.auditor}</p>
                            <span className={`text-xs font-medium px-2 py-1 rounded ${audit.status === 'excellent' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {audit.status === 'excellent' ? 'Отлично' : 'Хорошо'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainersQAPage;
