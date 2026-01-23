import React from 'react';
import { useAuth } from '../features/auth/useAuth';
import { useGetWalletQuery } from '../features/economy/economyApi';
import { useGetTasksQuery, TaskStatus } from '../features/tasks/tasksApi';
import { useGetMyCoursesQuery } from '../features/university/api/universityApi';
import {
    User,
    Briefcase,
    Award,
    CheckSquare,
    BookOpen,
    Zap,
    ShieldCheck,
    Clock
} from 'lucide-react';

import {
    useGetUserStatusQuery,
    useGetUserRankQuery
} from '../features/participation/participationApi';
import { StatusBadge } from '../components/status/StatusBadge';
import { RankBadge } from '../components/status/RankBadge';
import { StatusHistory } from '../components/status/StatusHistory';

import { getRoleName } from '../features/auth/roleTranslations';

const EmployeeProfilePage: React.FC = () => {
    const { user } = useAuth();
    const { data: wallet } = useGetWalletQuery();
    const { data: tasksData } = useGetTasksQuery({ assigneeId: user?.id, limit: 10 });
    const { data: universityData } = useGetMyCoursesQuery();

    // Status and Rank data
    const { data: statusData } = useGetUserStatusQuery(user?.id || '', { skip: !user?.id });
    const { data: rankData } = useGetUserRankQuery(user?.id || '', { skip: !user?.id });

    const activeTasks = tasksData?.data.filter(t => t.status !== TaskStatus.DONE && t.status !== TaskStatus.ARCHIVED) || [];
    const activeCourses = universityData?.data.active || [];

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header / Basic Info */}
            <header className="bg-gradient-to-r from-gray-900 to-indigo-950/20 border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <User className="w-48 h-48 text-white" />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-full border-4 border-indigo-500/30 bg-gray-800 flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Аватар" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-16 h-16 text-gray-600" />
                        )}
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-400">
                            <span className="flex items-center gap-1.5 bg-gray-800/50 px-3 py-1 rounded-full text-xs font-bold border border-gray-700">
                                <Briefcase className="w-3 h-3 text-indigo-400" />
                                {getRoleName(user?.role)}
                            </span>
                            <span className="flex items-center gap-1.5 bg-gray-800/50 px-3 py-1 rounded-full text-xs font-bold border border-gray-700">
                                <Award className="w-3 h-3 text-amber-400" />
                                ID Департамента: {user?.departmentId || 'Не назначен'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ProfileStatCard
                    label="Баланс MC"
                    value={wallet?.mcBalance.toLocaleString() || '0'}
                    icon={<Zap className="w-5 h-5 text-indigo-400" />}
                />
                <ProfileStatCard
                    label="Баланс GMC"
                    value={wallet?.gmcBalance.toLocaleString() || '0'}
                    icon={<ShieldCheck className="w-5 h-5 text-amber-400" />}
                />
                <ProfileStatCard
                    label="Активные задачи"
                    value={activeTasks.length.toString()}
                    icon={<CheckSquare className="w-5 h-5 text-emerald-400" />}
                />
                <ProfileStatCard
                    label="Курсы в процессе"
                    value={activeCourses.length.toString()}
                    icon={<BookOpen className="w-5 h-5 text-cyan-400" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tasks Section */}
                <section className="bg-gray-900/30 border border-gray-800/50 rounded-3xl p-6 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <CheckSquare className="w-5 h-5 text-indigo-400" />
                        Мои Задачи
                    </h2>
                    <div className="space-y-4">
                        {activeTasks.length === 0 ? (
                            <p className="text-gray-600 italic text-sm py-4">Нет активных задач</p>
                        ) : activeTasks.map(task => (
                            <div key={task.id} className="p-4 bg-gray-900 border border-gray-800 rounded-2xl hover:border-indigo-500/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-sm font-bold text-gray-200">{task.title}</h3>
                                    <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-400 uppercase font-black">{task.status}</span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
                                    </span>
                                    {task.mcReward && (
                                        <span className="text-indigo-400 font-bold">{task.mcReward} MC</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Training Section */}
                <section className="bg-gray-900/30 border border-gray-800/50 rounded-3xl p-6 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-amber-400" />
                        Обучение
                    </h2>
                    <div className="space-y-4">
                        {activeCourses.length === 0 ? (
                            <p className="text-gray-600 italic text-sm py-4">Нет активных курсов</p>
                        ) : activeCourses.map(course => (
                            <div key={course.id} className="p-4 bg-gray-900 border border-gray-800 rounded-2xl">
                                <h3 className="text-sm font-bold text-gray-200 mb-3">{course.courseTitle || 'Course Title'}</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] mb-1">
                                        <span className="text-gray-500 uppercase font-bold tracking-widest text-[9px]">Прогресс</span>
                                        <span className="text-amber-400 font-black">{course.progress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Participation Status & Rank Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-1 bg-gray-900/30 border border-gray-800/50 rounded-3xl p-6 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-indigo-400" />
                        Статус и Ранг
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Текущий статус</p>
                            {statusData ? (
                                <StatusBadge code={statusData.statusCode} description={statusData.statusDescription} />
                            ) : (
                                <p className="text-gray-600 italic text-sm">Статус не назначен</p>
                            )}
                        </div>
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Текущий ранг</p>
                            {rankData ? (
                                <RankBadge code={rankData.rankCode} description={rankData.rankDescription} gmcBalance={rankData.gmcBalance} />
                            ) : (
                                <p className="text-gray-600 italic text-sm">Ранг не определён</p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="lg:col-span-2 bg-gray-900/30 border border-gray-800/50 rounded-3xl p-6 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-indigo-400" />
                        История статусов
                    </h2>
                    <StatusHistory userId={user?.id || ''} />
                </section>
            </div>
        </div>
    );
};

const ProfileStatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
        <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-black/40 border border-gray-800 rounded-lg">{icon}</div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{label}</span>
        </div>
        <div className="text-2xl font-black text-white">{value}</div>
    </div>
);

export default EmployeeProfilePage;
