import React from 'react';
import { UserPlus, Users, ArrowRight } from 'lucide-react';

const TrainersAssignPage: React.FC = () => {
    const assignments = [
        {
            id: '1',
            student: 'Мария Соколова',
            role: 'Стажёр фотограф',
            trainer: null,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
        },
        {
            id: '2',
            student: 'Петр Сидоров',
            role: 'Младший ретушер',
            trainer: 'Анна Иванова',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Назначения Наставников</h1>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Новое назначение
                </button>
            </div>

            <div className="space-y-4">
                {assignments.map(assign => (
                    <div key={assign.id} className="bg-white p-6 rounded-xl border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={assign.avatar} alt={assign.student} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <h3 className="font-bold text-gray-900">{assign.student}</h3>
                                    <p className="text-sm text-gray-500">{assign.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {assign.trainer ? (
                                    <>
                                        <ArrowRight className="w-5 h-5 text-gray-400" />
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Наставник:</p>
                                            <p className="font-medium text-gray-900">{assign.trainer}</p>
                                        </div>
                                    </>
                                ) : (
                                    <button className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-200">
                                        Назначить наставника
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainersAssignPage;
