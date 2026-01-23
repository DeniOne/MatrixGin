import React, { useState } from 'react';
import { useGetTasksQuery, TaskStatus, TaskPriority } from '../features/tasks/tasksApi';
import { Plus, Search } from 'lucide-react';
import TaskCard from '../components/tasks/TaskCard';
import CreateTaskModal from '../components/tasks/CreateTaskModal';

const TasksPage: React.FC = () => {
    const [filters, setFilters] = useState({
        status: undefined as TaskStatus | undefined,
        priority: undefined as TaskPriority | undefined,
        search: '',
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    console.log('TasksPage: Fetching tasks with filters:', filters);
    const { data, isLoading, error } = useGetTasksQuery(filters);
    console.log('TasksPage: Query result:', { data, isLoading, error });

    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Задачи</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Управляйте задачами и отслеживайте их
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Создать задачу
                </button>
            </div>

            {/* Filters */}
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Поиск задач..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={filters.status || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                        className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Все статусы</option>
                        <option value={TaskStatus.TODO}>Нужно сделать</option>
                        <option value={TaskStatus.IN_PROGRESS}>В работе</option>
                        <option value={TaskStatus.REVIEW}>Проверка</option>
                        <option value={TaskStatus.DONE}>Готово</option>
                        <option value={TaskStatus.ARCHIVED}>Архив</option>
                    </select>

                    {/* Priority Filter */}
                    <select
                        value={filters.priority || ''}
                        onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
                        className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Все приоритеты</option>
                        <option value={TaskPriority.LOW}>Низкий</option>
                        <option value={TaskPriority.MEDIUM}>Средний</option>
                        <option value={TaskPriority.HIGH}>Высокий</option>
                        <option value={TaskPriority.URGENT}>Срочно</option>
                    </select>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-400 mt-4">Загрузка задач...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
                        Ошибка загрузки задач. Повторите попытку.
                    </div>
                )}

                {data && data.data.length === 0 && (
                    <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                        <p className="text-gray-400">Задачи не найдены</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-4 text-indigo-400 hover:text-indigo-300"
                        >
                            Создайте вашу первую задачу
                        </button>
                    </div>
                )}

                {data && data.data.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>

            {/* Pagination */}
            {data && data.total > data.limit && (
                <div className="flex justify-center gap-2 mt-6">
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                        Назад
                    </button>
                    <span className="px-4 py-2 text-gray-400">
                        Страница {data.page} из {Math.ceil(data.total / data.limit)}
                    </span>
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                        Вперед
                    </button>
                </div>
            )}

            {/* Create Task Modal */}
            {isCreateModalOpen && (
                <CreateTaskModal onClose={() => setIsCreateModalOpen(false)} />
            )}
        </div>
    );
};

export default TasksPage;
