import React, { useState } from 'react';
import {
    Target,
    Calendar,
    CheckSquare,
    Plus,
    MoreHorizontal,
    TrendingUp,
    AlertCircle,
    Flag
} from 'lucide-react';

interface IDPGoal {
    id: string;
    title: string;
    category: 'Professional' | 'Soft Skills' | 'Personal';
    deadline: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
    progress: number;
    tasks: { id: string; title: string; completed: boolean }[];
}

const SoftIDPPage: React.FC = () => {
    // Mock Data
    const [goals, setGoals] = useState<IDPGoal[]>([
        {
            id: '1',
            title: 'Развить навыки публичных выступлений',
            category: 'Soft Skills',
            deadline: '30.12.2024',
            status: 'in_progress',
            progress: 45,
            tasks: [
                { id: 't1', title: 'Пройти курс "Ораторское мастерство"', completed: true },
                { id: 't2', title: 'Выступить на внутреннем митапе', completed: false },
                { id: 't3', title: 'Получить обратную связь от ментора', completed: false }
            ]
        },
        {
            id: '2',
            title: 'Изучить основы управления проектами',
            category: 'Professional',
            deadline: '15.11.2024',
            status: 'overdue',
            progress: 20,
            tasks: [
                { id: 't4', title: 'Прочитать PMBOK (главы 1-3)', completed: true },
                { id: 't5', title: 'Пройти сертификацию PMP', completed: false }
            ]
        },
        {
            id: '3',
            title: 'Повысить уровень английского до C1',
            category: 'Personal',
            deadline: '01.06.2025',
            status: 'not_started',
            progress: 0,
            tasks: [
                { id: 't6', title: 'Записаться на курсы', completed: false },
                { id: 't7', title: 'Смотреть фильмы в оригинале', completed: false }
            ]
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'in_progress': return 'bg-blue-100 text-blue-700';
            case 'overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'Выполнено';
            case 'in_progress': return 'В процессе';
            case 'overdue': return 'Просрочено';
            default: return 'Не начато';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Индивидуальный План Развития</h1>
                    <p className="text-gray-500 mt-1">Ставьте амбициозные цели и отслеживайте свой прогресс</p>
                </div>
                <button className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center shadow-sm">
                    <Plus className="w-5 h-5 mr-2" />
                    Создать цель
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-500">Всего целей</h3>
                        <Target className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{goals.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-500">В процессе</h3>
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                        {goals.filter(g => g.status === 'in_progress').length}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-500">Требуют внимания</h3>
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                        {goals.filter(g => g.status === 'overdue').length}
                    </div>
                </div>
            </div>

            {/* Goals List */}
            <div className="space-y-6">
                {goals.map(goal => (
                    <div key={goal.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(goal.status)}`}>
                                        {getStatusText(goal.status)}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                                        {goal.category}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                            </div>
                            <div className="flex items-center mt-4 md:mt-0 space-x-4">
                                <div className="text-right">
                                    <div className="text-sm text-gray-500 flex items-center justify-end">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        Дедлайн: {goal.deadline}
                                    </div>
                                    <div className="text-xs text-red-500 font-medium mt-1">
                                        {goal.status === 'overdue' && 'Просрочено на 5 дней'}
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                                <span>Прогресс выполнения</span>
                                <span>{goal.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${goal.status === 'overdue' ? 'bg-red-500' :
                                            goal.status === 'completed' ? 'bg-green-500' : 'bg-indigo-600'
                                        }`}
                                    style={{ width: `${goal.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Tasks */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center">
                                <CheckSquare className="w-4 h-4 mr-2" />
                                Ключевые результаты (Key Results)
                            </h4>
                            <div className="space-y-2">
                                {goal.tasks.map(task => (
                                    <label key={task.id} className="flex items-start space-x-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300 group-hover:border-indigo-400'
                                            }`}>
                                            {task.completed && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                            {task.title}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SoftIDPPage;
