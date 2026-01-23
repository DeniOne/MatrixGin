import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, TaskStatus, TaskPriority, useCompleteTaskMutation } from '../../features/tasks/tasksApi';
import { Calendar, User, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const navigate = useNavigate();
    const [completeTask, { isLoading }] = useCompleteTaskMutation();

    const getPriorityColor = (priority: TaskPriority) => {
        switch (priority) {
            case TaskPriority.URGENT:
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            case TaskPriority.HIGH:
                return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case TaskPriority.MEDIUM:
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case TaskPriority.LOW:
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.TODO:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            case TaskStatus.IN_PROGRESS:
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case TaskStatus.REVIEW:
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case TaskStatus.DONE:
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            case TaskStatus.ARCHIVED:
                return 'bg-gray-700/10 text-gray-500 border-gray-700/20';
        }
    };

    const handleComplete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await completeTask(task.id).unwrap();
        } catch (error) {
            console.error('Failed to complete task:', error);
        }
    };

    return (
        <div
            onClick={() => navigate(`/tasks/${task.id}`)}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
                            {task.title}
                        </h3>
                        <span className={clsx('px-2 py-1 text-xs font-medium rounded border', getPriorityColor(task.priority))}>
                            {task.priority}
                        </span>
                        <span className={clsx('px-2 py-1 text-xs font-medium rounded border', getStatusColor(task.status))}>
                            {task.status.replace('_', ' ')}
                        </span>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                        {task.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        {task.dueDate && (
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                        )}
                        {task.assigneeId && (
                            <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                Назначено
                            </div>
                        )}
                        {task.mcReward && (
                            <div className="flex items-center gap-1 text-yellow-500">
                                <span className="font-semibold">+{task.mcReward} MC</span>
                            </div>
                        )}
                    </div>
                </div>

                {task.status !== TaskStatus.DONE && task.status !== TaskStatus.ARCHIVED && (
                    <button
                        onClick={handleComplete}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600/10 hover:bg-green-600/20 text-green-400 rounded-lg transition-colors border border-green-600/20 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Clock className="w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle className="w-4 h-4" />
                        )}
                        Завершить
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
