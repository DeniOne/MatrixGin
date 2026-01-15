import React from 'react';
import { Users, ChevronRight } from 'lucide-react';

const MgmtTalentPage: React.FC = () => {
    const talents = [
        {
            id: '1',
            name: 'Анна Смирнова',
            role: 'Senior Фотограф',
            readyFor: 'Руководитель студии',
            readiness: 85,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
        },
        {
            id: '2',
            name: 'Дмитрий Волков',
            role: 'Team Lead',
            readyFor: 'Менеджер филиала',
            readiness: 70,
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
        },
        {
            id: '3',
            name: 'Елена Петрова',
            role: 'Ретушер',
            readyFor: 'Team Lead',
            readiness: 60,
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Кадровый Резерв</h1>
            <p className="text-gray-500 mb-8">Планирование преемственности и развитие талантов</p>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">Talent Pipeline</h3>
                        <p className="text-sm text-gray-600">3 сотрудника готовы к повышению</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                </div>
            </div>

            <div className="space-y-4">
                {talents.map(talent => (
                    <div key={talent.id} className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <img src={talent.avatar} alt={talent.name} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <h3 className="font-bold text-gray-900">{talent.name}</h3>
                                    <p className="text-sm text-gray-500">{talent.role} → {talent.readyFor}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Готовность</span>
                                <span>{talent.readiness}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${talent.readiness >= 80 ? 'bg-green-600' :
                                        talent.readiness >= 60 ? 'bg-blue-600' : 'bg-yellow-600'
                                        }`}
                                    style={{ width: `${talent.readiness}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MgmtTalentPage;
