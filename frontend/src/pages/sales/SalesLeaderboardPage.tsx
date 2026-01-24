import React, { useState } from 'react';
import {
    Trophy,
    Medal,
    Filter,
    Download,
    User,
    ArrowUp,
    ArrowDown,
    Minus
} from 'lucide-react';

interface SalesAgent {
    id: string;
    rank: number;
    prevRank: number;
    name: string;
    avatar?: string;
    branch: string;
    revenue: number;
    deals: number;
    conversion: number;
    points: number;
}

const SalesLeaderboardPage: React.FC = () => {
    const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');

    // Mock Data
    const agents: SalesAgent[] = [
        { id: '1', rank: 1, prevRank: 2, name: 'Александра Миронова', branch: 'Москва, ТЦ Авиапарк', revenue: 450000, deals: 124, conversion: 28.5, points: 1250 },
        { id: '2', rank: 2, prevRank: 1, name: 'Дмитрий Волков', branch: 'СПб, Галерея', revenue: 425000, deals: 118, conversion: 26.2, points: 1180 },
        { id: '3', rank: 3, prevRank: 3, name: 'Елена Соколова', branch: 'Казань, Мега', revenue: 380000, deals: 95, conversion: 31.0, points: 1050 },
        { id: '4', rank: 4, prevRank: 6, name: 'Максим Петров', branch: 'Москва, Европейский', revenue: 310000, deals: 88, conversion: 22.5, points: 920 },
        { id: '5', rank: 5, prevRank: 4, name: 'Анна Иванова', branch: 'Екатеринбург, Гринвич', revenue: 295000, deals: 82, conversion: 24.1, points: 880 },
        { id: '6', rank: 6, prevRank: 5, name: 'Сергей Козлов', branch: 'Новосибирск, Аура', revenue: 280000, deals: 79, conversion: 21.8, points: 850 },
        { id: '7', rank: 7, prevRank: 9, name: 'Мария Смирнова', branch: 'Ростов, Горизонт', revenue: 265000, deals: 75, conversion: 23.5, points: 810 },
        { id: '8', rank: 8, prevRank: 8, name: 'Игорь Новиков', branch: 'Краснодар, Галерея', revenue: 250000, deals: 70, conversion: 20.5, points: 780 },
    ];

    const getRankChangeIcon = (current: number, prev: number) => {
        if (current < prev) return <ArrowUp className="w-4 h-4 text-green-500" />;
        if (current > prev) return <ArrowDown className="w-4 h-4 text-red-500" />;
        return <Minus className="w-4 h-4 text-[#717182]" />;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-gray-900 flex items-center">
                        <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
                        Рейтинг Продаж
                    </h1>
                    <p className="text-[#717182] mt-1">Топ лучших сотрудников по выручке и конверсии</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                    <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
                        <button
                            onClick={() => setPeriod('week')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${period === 'week' ? 'bg-gray-100 text-gray-900' : 'text-[#717182] hover:text-gray-700'
                                }`}
                        >
                            Неделя
                        </button>
                        <button
                            onClick={() => setPeriod('month')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${period === 'month' ? 'bg-gray-100 text-gray-900' : 'text-[#717182] hover:text-gray-700'
                                }`}
                        >
                            Месяц
                        </button>
                        <button
                            onClick={() => setPeriod('quarter')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${period === 'quarter' ? 'bg-gray-100 text-gray-900' : 'text-[#717182] hover:text-gray-700'
                                }`}
                        >
                            Квартал
                        </button>
                    </div>
                    <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Filter className="w-4 h-4 mr-2" />
                        Фильтры
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Download className="w-4 h-4 mr-2" />
                        Экспорт
                    </button>
                </div>
            </div>

            {/* Top 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* 2nd Place */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center relative mt-4 md:mt-8">
                    <div className="absolute -top-4 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-[#030213] font-medium border-4 border-white shadow-sm">
                        2
                    </div>
                    <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center overflow-hidden">
                        {agents[1].avatar ? (
                            <img src={agents[1].avatar} alt={agents[1].name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-[#717182]" />
                        )}
                    </div>
                    <h3 className="font-medium text-lg text-gray-900 text-center">{agents[1].name}</h3>
                    <p className="text-sm text-[#717182] mb-4 text-center">{agents[1].branch}</p>
                    <div className="w-full space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#717182]">Выручка</span>
                            <span className="font-medium text-gray-900">{agents[1].revenue.toLocaleString()} ₽</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[#717182]">Конверсия</span>
                            <span className="font-medium text-green-600">{agents[1].conversion}%</span>
                        </div>
                    </div>
                </div>

                {/* 1st Place */}
                <div className="bg-gradient-to-b from-yellow-50 to-white rounded-xl shadow-md border border-yellow-200 p-6 flex flex-col items-center relative z-10 transform md:-translate-y-4">
                    <div className="absolute -top-6">
                        <Medal className="w-12 h-12 text-yellow-500 drop-shadow-sm" />
                    </div>
                    <div className="w-24 h-24 bg-yellow-100 rounded-full mb-4 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm mt-6">
                        {agents[0].avatar ? (
                            <img src={agents[0].avatar} alt={agents[0].name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-12 h-12 text-yellow-600" />
                        )}
                    </div>
                    <h3 className="font-medium text-xl text-gray-900 text-center">{agents[0].name}</h3>
                    <p className="text-sm text-[#717182] mb-6 text-center">{agents[0].branch}</p>
                    <div className="w-full space-y-3 bg-white/50 p-4 rounded-lg">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Выручка</span>
                            <span className="font-medium text-gray-900 text-lg">{agents[0].revenue.toLocaleString()} ₽</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Конверсия</span>
                            <span className="font-medium text-green-600 text-lg">{agents[0].conversion}%</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                            <span className="text-gray-600">Баллы</span>
                            <span className="font-medium text-purple-600">{agents[0].points} XP</span>
                        </div>
                    </div>
                </div>

                {/* 3rd Place */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center relative mt-4 md:mt-8">
                    <div className="absolute -top-4 w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center text-[#030213] font-medium border-4 border-white shadow-sm">
                        3
                    </div>
                    <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center overflow-hidden">
                        {agents[2].avatar ? (
                            <img src={agents[2].avatar} alt={agents[2].name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-[#717182]" />
                        )}
                    </div>
                    <h3 className="font-medium text-lg text-gray-900 text-center">{agents[2].name}</h3>
                    <p className="text-sm text-[#717182] mb-4 text-center">{agents[2].branch}</p>
                    <div className="w-full space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#717182]">Выручка</span>
                            <span className="font-medium text-gray-900">{agents[2].revenue.toLocaleString()} ₽</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[#717182]">Конверсия</span>
                            <span className="font-medium text-green-600">{agents[2].conversion}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-xs font-medium text-[#717182] uppercase tracking-wider">Ранг</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-[#717182] uppercase tracking-wider">Сотрудник</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-[#717182] uppercase tracking-wider">Филиал</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-[#717182] uppercase tracking-wider">Сделки</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-[#717182] uppercase tracking-wider">Конверсия</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-[#717182] uppercase tracking-wider">Выручка</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {agents.slice(3).map((agent) => (
                                <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="font-medium text-gray-900 w-6">{agent.rank}</span>
                                            {getRankChangeIcon(agent.rank, agent.prevRank)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                                <User className="w-4 h-4 text-[#717182]" />
                                            </div>
                                            <span className="font-medium text-gray-900">{agent.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#717182]">
                                        {agent.branch}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                        {agent.deals}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                                        {agent.conversion}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                        {agent.revenue.toLocaleString()} ₽
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesLeaderboardPage;
