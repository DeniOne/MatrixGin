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
                    <h1 className="text-2xl font-bold text-white">Tasks</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Manage and track your tasks
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Task
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
                            placeholder="Search tasks..."
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
                        <option value="">All Statuses</option>
                        <option value={TaskStatus.TODO}>To Do</option>
                        <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                        <option value={TaskStatus.REVIEW}>Review</option>
                        <option value={TaskStatus.DONE}>Done</option>
                        <option value={TaskStatus.ARCHIVED}>Archived</option>
                    </select>

                    {/* Priority Filter */}
                    <select
                        value={filters.priority || ''}
                        onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
                        className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Priorities</option>
                        <option value={TaskPriority.LOW}>Low</option>
                        <option value={TaskPriority.MEDIUM}>Medium</option>
                        <option value={TaskPriority.HIGH}>High</option>
                        <option value={TaskPriority.URGENT}>Urgent</option>
                    </select>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-400 mt-4">Loading tasks...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
                        Failed to load tasks. Please try again.
                    </div>
                )}

                {data && data.data.length === 0 && (
                    <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                        <p className="text-gray-400">No tasks found</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-4 text-indigo-400 hover:text-indigo-300"
                        >
                            Create your first task
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
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-400">
                        Page {data.page} of {Math.ceil(data.total / data.limit)}
                    </span>
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                        Next
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
