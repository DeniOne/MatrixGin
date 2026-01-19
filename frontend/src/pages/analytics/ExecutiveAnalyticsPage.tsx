import React from 'react';
import { useGetExecutiveAnalyticsQuery } from '../../features/analytics/analyticsApi';
import { ShieldCheck, BarChart3, Users, Briefcase } from 'lucide-react';

const ExecutiveAnalyticsPage: React.FC = () => {
    const { data, isLoading, error } = useGetExecutiveAnalyticsQuery();

    if (isLoading) return <div className="flex items-center justify-center h-full text-indigo-500 animate-pulse">Loading executive analytics...</div>;
    if (error) return <div className="p-6 text-red-500">Error loading analytics. Executive access required.</div>;

    const stats = data?.data;

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-indigo-400" />
                    Executive Dashboard
                </h1>
                <p className="text-gray-400 font-light max-w-2xl">
                    Обзор состояния системы и макро-трендов. Прозрачность без микро-контроля.
                </p>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-gray-200 border-b border-gray-800 pb-2">Системные Агрегаты</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ExecutiveStatCard
                            title="Суммарная Эмиссия (24ч)"
                            value={`${stats?.daily.totalReward || 0} MC`}
                            hint="Награды за задачи"
                        />
                        <ExecutiveStatCard
                            title="Оборот Системы (24ч)"
                            value={`${stats?.daily.totalTransaction || 0} MC`}
                            hint="Все транзакции"
                        />
                    </div>

                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-6 tracking-widest">Макро-тренды (Система)</h3>
                        <div className="h-48 flex items-center justify-center border border-dashed border-gray-800 rounded-xl">
                            <span className="text-gray-600 text-sm">Агрегированные данные за текущий квартал.</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-200 border-b border-gray-800 pb-2">Структурный Разрез</h2>
                    <div className="space-y-4">
                        <DepartmentActivityRow name="Production" value={85} />
                        <DepartmentActivityRow name="Sales" value={62} />
                        <DepartmentActivityRow name="Support" value={45} />
                        <DepartmentActivityRow name="Academy" value={92} />
                    </div>

                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl mt-8">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-bold text-indigo-400 uppercase">Privacy Guard Active</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed italic">
                            Персональные данные скрыты в соответствии с политикой MatrixGin.
                            Визуализация ограничена структурными единицами.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

const ExecutiveStatCard: React.FC<{ title: string; value: string; hint: string }> = ({ title, value, hint }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-indigo-500/30 transition-colors">
        <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">{title}</div>
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-[10px] text-indigo-400/60 mt-2">{hint}</div>
    </div>
);

const DepartmentActivityRow: React.FC<{ name: string; value: number }> = ({ name, value }) => (
    <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-300">{name}</span>
        </div>
        <div className="flex items-center gap-4">
            <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${value}%` }}></div>
            </div>
            <span className="text-xs font-bold text-indigo-400">{value}%</span>
        </div>
    </div>
);

export default ExecutiveAnalyticsPage;
