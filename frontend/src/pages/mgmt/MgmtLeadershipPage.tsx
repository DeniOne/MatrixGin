import React from 'react';
import { Users, DollarSign, Award, BookOpen, Clock } from 'lucide-react';

const MgmtLeadershipPage: React.FC = () => {
    const programs = [
        {
            id: '1',
            title: 'Управление командой',
            level: 'Начинающий менеджер',
            duration: '6 недель',
            modules: 12,
            icon: <Users className="w-6 h-6" />,
            color: 'blue',
            enrolled: false
        },
        {
            id: '2',
            title: 'Финансы для менеджеров',
            level: 'Продвинутый',
            duration: '4 недели',
            modules: 8,
            icon: <DollarSign className="w-6 h-6" />,
            color: 'green',
            enrolled: true
        },
        {
            id: '3',
            title: 'HR для руководителей',
            level: 'Эксперт',
            duration: '8 недель',
            modules: 16,
            icon: <Award className="w-6 h-6" />,
            color: 'purple',
            enrolled: false
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Лидерские Программы</h1>
            <p className="text-gray-500 mb-8">Развитие управленческих компетенций для менеджеров всех уровней</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map(program => (
                    <div key={program.id} className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-all ${program.enrolled ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-200'
                        }`}>
                        <div className={`p-4 bg-${program.color}-100 rounded-xl inline-block mb-4`}>
                            <div className={`text-${program.color}-600`}>{program.icon}</div>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">{program.title}</h3>
                        <p className="text-sm text-indigo-600 font-medium mb-4">{program.level}</p>
                        <div className="space-y-2 text-sm text-gray-600 mb-6">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {program.duration}
                            </div>
                            <div className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-2" />
                                {program.modules} модулей
                            </div>
                        </div>
                        {program.enrolled ? (
                            <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                                Продолжить обучение
                            </button>
                        ) : (
                            <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                                Записаться
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MgmtLeadershipPage;
