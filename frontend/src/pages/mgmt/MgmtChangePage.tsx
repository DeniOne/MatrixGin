import React from 'react';
import { RefreshCw, BookOpen, Play } from 'lucide-react';

const MgmtChangePage: React.FC = () => {
    const playbooks = [
        { id: '1', title: 'Внедрение нового процесса', steps: 12, status: 'active' },
        { id: '2', title: 'Реорганизация команды', steps: 8, status: 'draft' },
        { id: '3', title: 'Цифровая трансформация', steps: 15, status: 'active' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление Изменениями</h1>
            <p className="text-gray-500 mb-8">Playbook для успешной трансформации</p>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 mb-8 border border-orange-200">
                <div className="flex items-center">
                    <RefreshCw className="w-8 h-8 text-orange-600 mr-4" />
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">Модель ADKAR</h3>
                        <p className="text-sm text-gray-600">Пошаговый фреймворк для управления изменениями</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {playbooks.map(playbook => (
                    <div key={playbook.id} className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <BookOpen className="w-6 h-6 text-orange-600 mr-4" />
                                <div>
                                    <h3 className="font-bold text-gray-900">{playbook.title}</h3>
                                    <p className="text-sm text-gray-500">{playbook.steps} шагов</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`text-xs font-medium px-2 py-1 rounded ${playbook.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {playbook.status === 'active' ? 'Активен' : 'Черновик'}
                                </span>
                                <button className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200">
                                    <Play className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MgmtChangePage;
