import React from 'react';
import { useGetPersonalAnalyticsQuery } from '../../features/analytics/analyticsApi';
import { TrendingUp, Award, Activity, Calendar } from 'lucide-react';

const PersonalAnalyticsPage: React.FC = () => {
    const { data, isLoading, error } = useGetPersonalAnalyticsQuery();

    if (isLoading) return <div className="flex items-center justify-center h-full text-indigo-500 animate-pulse">Loading analytics...</div>;
    if (error) return <div className="p-6 text-red-500">Error loading analytics. Please try again later.</div>;

    const stats = data?.data;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-indigo-400" />
                    Моя Аналитика
                </h1>
                <p className="text-gray-400 font-light max-w-2xl">
                    Ваш личный тренд активности и участия в экономике MatrixGin. Объективные данные о ваших достижениях.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Сегодня"
                    stats={stats?.daily}
                    icon={<Calendar className="w-5 h-5" />}
                    color="indigo"
                />
                <StatCard
                    title="Эта Неделя"
                    stats={stats?.weekly}
                    icon={<Activity className="w-5 h-5" />}
                    color="amber"
                />
                <StatCard
                    title="Этот Месяц"
                    stats={stats?.monthly}
                    icon={<Award className="w-5 h-5" />}
                    color="emerald"
                />
            </div>

            <section className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6">Динамика вклада</h2>
                <div className="h-64 flex items-center justify-center border border-dashed border-gray-800 rounded-xl bg-black/20">
                    <span className="text-gray-600 italic">График динамики будет доступен после накопления данных за 7 дней.</span>
                </div>
            </section>
        </div>
    );
};

interface StatCardProps {
    title: string;
    stats: any;
    icon: React.ReactNode;
    color: 'indigo' | 'amber' | 'emerald';
}

const StatCard: React.FC<StatCardProps> = ({ title, stats, icon, color }) => {
    const colorClasses = {
        indigo: 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5',
        amber: 'border-amber-500/20 text-amber-400 bg-amber-500/5',
        emerald: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5',
    };

    return (
        <div className={`border rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-${color}-500/10 ${colorClasses[color]}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-gray-900 border border-gray-800`}>
                    {icon}
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-300">{title}</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Транзакции (MC)</p>
                    <p className="text-2xl font-black text-white">{stats?.totalTransaction || 0}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Награды за задачи</p>
                    <p className="text-2xl font-black text-white">{stats?.totalReward || 0}</p>
                </div>
                <div className="pt-4 border-t border-gray-800/50 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Всего операций</span>
                    <span className="text-sm font-bold text-gray-300">{stats?.transactionCount || 0}</span>
                </div>
            </div>
        </div>
    );
};

export default PersonalAnalyticsPage;
