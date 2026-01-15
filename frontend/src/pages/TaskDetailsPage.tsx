import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTaskQuery, useUpdateTaskMutation, useCompleteTaskMutation, TaskStatus, TaskPriority } from '../features/tasks/tasksApi';
import { ArrowLeft, Calendar, User, Tag, Clock, CheckCircle, Edit2 } from 'lucide-react';
import clsx from 'clsx';

const TaskDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: task, isLoading, error } = useGetTaskQuery(id!);
    const [updateTask] = useUpdateTaskMutation();
    const [completeTask, { isLoading: isCompleting }] = useCompleteTaskMutation();
    const [isEditing, setIsEditing] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => navigate('/tasks')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Tasks
                </button>
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-red-400">
                    Task not found
                </div>
            </div>
        );
    }

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



    const handleComplete = async () => {
        try {
            await completeTask(task.id).unwrap();
        } catch (error) {
            console.error('Failed to complete task:', error);
        }
    };

    const handleStatusChange = async (status: TaskStatus) => {
        try {
            await updateTask({ id: task.id, data: { status } }).unwrap();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/tasks')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Tasks
                </button>

                <div className="flex items-center gap-3">
                    {task.status !== TaskStatus.DONE && task.status !== TaskStatus.ARCHIVED && (
                        <button
                            onClick={handleComplete}
                            disabled={isCompleting}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            <CheckCircle className="w-5 h-5" />
                            {isCompleting ? 'Completing...' : 'Complete Task'}
                        </button>
                    )}
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                        <Edit2 className="w-5 h-5" />
                        Edit
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Task Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Description */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <div className="flex items-start gap-3 mb-4">
                            <h1 className="text-2xl font-bold text-white flex-1">{task.title}</h1>
                            <span className={clsx('px-3 py-1 text-sm font-medium rounded border', getPriorityColor(task.priority))}>
                                {task.priority}
                            </span>
                        </div>
                        <p className="text-gray-300 whitespace-pre-wrap">{task.description}</p>
                    </div>

                    {/* Comments Section (Placeholder) */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4">Comments</h2>
                        <div className="text-center py-8 text-gray-500">
                            No comments yet
                        </div>
                    </div>
                </div>

                {/* Right Column - Metadata */}
                <div className="space-y-6">
                    {/* Status */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-sm font-medium text-gray-400 mb-3">Status</h3>
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value={TaskStatus.TODO}>To Do</option>
                            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                            <option value={TaskStatus.REVIEW}>Review</option>
                            <option value={TaskStatus.DONE}>Done</option>
                            <option value={TaskStatus.ARCHIVED}>Archived</option>
                        </select>
                    </div>

                    {/* Details */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                        <h3 className="text-sm font-medium text-gray-400 mb-3">Details</h3>

                        {task.dueDate && (
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-500" />
                                <div>
                                    <div className="text-xs text-gray-500">Due Date</div>
                                    <div className="text-sm text-white">
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {task.assigneeId && (
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-gray-500" />
                                <div>
                                    <div className="text-xs text-gray-500">Assignee</div>
                                    <div className="text-sm text-white">Assigned</div>
                                </div>
                            </div>
                        )}

                        {task.mcReward && (
                            <div className="flex items-center gap-3">
                                <Tag className="w-5 h-5 text-yellow-500" />
                                <div>
                                    <div className="text-xs text-gray-500">Reward</div>
                                    <div className="text-sm text-yellow-400 font-semibold">
                                        +{task.mcReward} MC
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-gray-500" />
                            <div>
                                <div className="text-xs text-gray-500">Created</div>
                                <div className="text-sm text-white">
                                    {new Date(task.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {task.completedAt && (
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <div>
                                    <div className="text-xs text-gray-500">Completed</div>
                                    <div className="text-sm text-white">
                                        {new Date(task.completedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-sm font-medium text-gray-400 mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {task.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsPage;
