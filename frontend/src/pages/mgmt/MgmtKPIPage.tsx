import React from 'react';
import { Target, Plus } from 'lucide-react';

const MgmtKPIPage: React.FC = () => {
    const objectives = [
        {
            id: '1',
            title: 'Увеличить производительность команды',
            progress: 75,
            keyResults: [
                { title: 'Сократить время обработки заказа на 20%', done: true },
                { title: 'Повысить NPS до 85', done: true },
                { title: 'Внедрить новую CRM', done: false }
            ]
        },
        {
            id: '2',
            title: 'Развитие команды',
            progress: 60,
            keyResults: [
                { title: 'Обучить 100% команды новым техникам', done: true },
                { title: 'Провести 3 тимбилдинга', done: false }
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Студия KPI и OKR</h1>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Новая цель
                </button>
            </div>

            <div className="space-y-6">
                {objectives.map(obj => (
                    <div key={obj.id} className="bg-white rounded-xl border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <Target className="w-6 h-6 text-indigo-600 mr-3" />
                                <h3 className="font-bold text-lg text-gray-900">{obj.title}</h3>
                            </div>
                            <span className="text-sm font-bold text-indigo-600">{obj.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${obj.progress}%` }}></div>
                        </div>
                        <div className="space-y-2">
                            {obj.keyResults.map((kr, idx) => (
                                <div key={idx} className="flex items-center text-sm">
                                    <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${kr.done ? 'bg-green-500 border-green-500' : 'border-gray-300'
                                        }`}>
                                        {kr.done && <span className="text-white text-xs">✓</span>}
                                    </div>
                                    <span className={kr.done ? 'text-gray-500 line-through' : 'text-gray-700'}>{kr.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MgmtKPIPage;
