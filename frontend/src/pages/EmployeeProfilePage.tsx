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
            <header className="bg-white border border-black/10 rounded-3xl p-8 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <User className="w-48 h-48 text-[#030213]" />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-full border-4 border-[#F3F3F5] bg-[#F8FAFC] flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Аватар" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-16 h-16 text-[#717182]" />
                        )}
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-4xl font-medium text-[#030213] tracking-tight">
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[#717182]">
                            <span className="flex items-center gap-1.5 bg-[#F3F3F5] px-3 py-1 rounded-full text-xs font-medium border border-black/5">
                                <Briefcase className="w-3 h-3 text-indigo-600" />
                                {getRoleName(user?.role)}
                            </span>
                            <span className="flex items-center gap-1.5 bg-[#F3F3F5] px-3 py-1 rounded-full text-xs font-medium border border-black/5">
                                <Award className="w-3 h-3 text-amber-500" />
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
                    icon={<Zap className="w-5 h-5 text-indigo-500" />}
                />
                <ProfileStatCard
                    label="Баланс GMC"
                    value={wallet?.gmcBalance.toLocaleString() || '0'}
                    icon={<ShieldCheck className="w-5 h-5 text-amber-500" />}
                />
                <ProfileStatCard
                    label="Активные задачи"
                    value={activeTasks.length.toString()}
                    icon={<CheckSquare className="w-5 h-5 text-emerald-500" />}
                />
                <ProfileStatCard
                    label="Курсы в процессе"
                    value={activeCourses.length.toString()}
                    icon={<BookOpen className="w-5 h-5 text-cyan-500" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tasks Section */}
                <section className="bg-white border border-black/10 rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-medium text-[#030213] mb-6 flex items-center gap-3">
                        <CheckSquare className="w-5 h-5 text-indigo-600" />
                        Мои Задачи
                    </h2>
                    <div className="space-y-4">
                        {activeTasks.length === 0 ? (
                            <p className="text-[#717182] italic text-sm py-4">Нет активных задач</p>
                        ) : activeTasks.map(task => (
                            <div key={task.id} className="p-4 bg-white border border-black/10 rounded-2xl hover:border-indigo-200 transition-colors shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-sm font-medium text-[#030213]">{task.title}</h3>
                                    <span className="text-[10px] bg-[#F3F3F5] px-2 py-0.5 rounded text-[#717182] uppercase font-medium">{task.status}</span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] text-[#717182]">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
                                    </span>
                                    {task.mcReward && (
                                        <span className="text-indigo-600 font-medium">{task.mcReward} MC</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Training Section */}
                <section className="bg-white border border-black/10 rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-medium text-[#030213] mb-6 flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-amber-500" />
                        Обучение
                    </h2>
                    <div className="space-y-4">
                        {activeCourses.length === 0 ? (
                            <p className="text-[#717182] italic text-sm py-4">Нет активных курсов</p>
                        ) : activeCourses.map(course => (
                            <div key={course.id} className="p-4 bg-white border border-black/10 rounded-2xl shadow-sm">
                                <h3 className="text-sm font-medium text-[#030213] mb-3">{course.courseTitle || 'Course Title'}</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] mb-1">
                                        <span className="text-[#717182] uppercase font-medium tracking-widest text-[9px]">Прогресс</span>
                                        <span className="text-amber-600 font-medium">{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-[#F3F3F5] rounded-full h-1.5 overflow-hidden">
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
                <section className="lg:col-span-1 bg-white border border-black/10 rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-medium text-[#030213] mb-6 flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                        Статус и Ранг
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-white border border-black/10 rounded-2xl p-4 shadow-sm">
                            <p className="text-[10px] text-[#717182] font-medium uppercase tracking-widest mb-2">Текущий статус</p>
                            {statusData ? (
                                <StatusBadge code={statusData.statusCode} description={statusData.statusDescription} />
                            ) : (
                                <p className="text-[#717182] italic text-sm">Статус не назначен</p>
                            )}
                        </div>
                        <div className="bg-white border border-black/10 rounded-2xl p-4 shadow-sm">
                            <p className="text-[10px] text-[#717182] font-medium uppercase tracking-widest mb-2">Текущий ранг</p>
                            {rankData ? (
                                <RankBadge code={rankData.rankCode} description={rankData.rankDescription} gmcBalance={rankData.gmcBalance} />
                            ) : (
                                <p className="text-[#717182] italic text-sm">Ранг не определён</p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="lg:col-span-2 bg-white border border-black/10 rounded-3xl p-6 shadow-sm">
                    <h2 className="text-xl font-medium text-[#030213] mb-6 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        История статусов
                    </h2>
                    <StatusHistory userId={user?.id || ''} />
                </section>
            </div>
        </div>
    );
};

const ProfileStatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="bg-white border border-black/10 rounded-2xl p-5 hover:border-indigo-200 transition-colors shadow-sm">
        <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#F3F3F5] border border-black/5 rounded-lg">{icon}</div>
            <span className="text-[10px] text-[#717182] font-medium uppercase tracking-widest">{label}</span>
        </div>
        <div className="text-2xl font-medium text-[#030213]">{value}</div>
    </div>
);

export default EmployeeProfilePage;
