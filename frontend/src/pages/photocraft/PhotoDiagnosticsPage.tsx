import React, { useState } from 'react';
import {
    BarChart2,
    PieChart,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    FileText
} from 'lucide-react';

interface Audit {
    id: string;
    date: string;
    photographer: string;
    auditor: string;
    score: number;
    status: 'passed' | 'failed' | 'warning';
    issues: number;
}

const PhotoDiagnosticsPage: React.FC = () => {
    const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');

    // Mock Data
    const audits: Audit[] = [
        { id: '1', date: '20.11.2024', photographer: 'Александра Миронова', auditor: 'Дмитрий Волков', score: 95, status: 'passed', issues: 0 },
        { id: '2', date: '19.11.2024', photographer: 'Иван Петров', auditor: 'Елена Соколова', score: 72, status: 'warning', issues: 3 },
        { id: '3', date: '18.11.2024', photographer: 'Мария Смирнова', auditor: 'Дмитрий Волков', score: 45, status: 'failed', issues: 8 },
        { id: '4', date: '18.11.2024', photographer: 'Сергей Козлов', auditor: 'Елена Соколова', score: 88, status: 'passed', issues: 1 },
        { id: '5', date: '17.11.2024', photographer: 'Анна Иванова', auditor: 'Дмитрий Волков', score: 92, status: 'passed', issues: 0 },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'passed': return 'text-green-600 bg-green-50 border-green-200';
            case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'failed': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Диагностика и Аудиты</h1>
                    <p className="text-gray-500 mt-1">Контроль качества работы фотографов и соблюдения стандартов</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                    <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
                        <button
                            onClick={() => setPeriod('week')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${period === 'week' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Неделя
                        </button>
                        <button
                            onClick={() => setPeriod('month')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${period === 'month' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Месяц
                        </button>
                    </div>
                    <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                        <FileText className="w-4 h-4 mr-2" />
                        Новый аудит
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Средний балл (Качество)</h3>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-gray-900">8.4</span>
                        <span className="ml-2 text-sm font-medium text-green-600 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +0.2
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Ошибки (Критические)</h3>
                        <div className="p-2 bg-red-50 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-gray-900">12</span>
                        <span className="ml-2 text-sm font-medium text-red-600 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +3
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">NPS (Клиенты)</h3>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <PieChart className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-gray-900">72%</span>
                        <span className="ml-2 text-sm font-medium text-green-600 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +5%
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Проведено аудитов</h3>
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <BarChart2 className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-gray-900">45</span>
                        <span className="ml-2 text-sm font-medium text-gray-500">
                            за месяц
                        </span>
                    </div>
                </div>
            </div>

            {/* Recent Audits Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="font-bold text-gray-900">Последние аудиты</h2>
                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">Показать все</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Фотограф</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Аудитор</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Оценка</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {audits.map((audit) => (
                                <tr key={audit.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {audit.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{audit.photographer}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {audit.auditor}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="text-sm font-bold text-gray-900">{audit.score}%</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(audit.status)}`}>
                                            {audit.status === 'passed' ? 'Пройден' :
                                                audit.status === 'warning' ? 'Замечания' : 'Не пройден'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">Отчет</button>
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

export default PhotoDiagnosticsPage;
