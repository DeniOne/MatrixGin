import React, { useState } from 'react';

/**
 * EconomyDashboard - Панель аналитики и прозрачности
 * PHASE 4 — Analytics, Observability & Governance
 */
const EconomyDashboard: React.FC = () => {
    // Mock role for UI presentation (in real app comes from AuthContext)
    const [userRole] = useState<'ADMIN' | 'EMPLOYEE'>('ADMIN');

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Аналитика и Прозрачность (Govenance)</h1>
                <p className="text-gray-400 font-light italic">Объективные данные о движении MatrixCoin в системе.</p>
            </header>

            {/* Глобальная аналитика (Management View) */}
            {userRole === 'ADMIN' && (
                <section className="space-y-6">
                    <h2 className="text-xl font-bold text-indigo-400 border-b border-indigo-500/20 pb-2">Глобальное состояние (Management)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <MetricCard title="Всего выпущено MC" value="124,500" hint="Суммарная эмиссия" />
                        <MetricCard title="Всего потрачено MC" value="89,200" hint="Освоено в магазине" />
                        <MetricCard title="В обращении" value="35,300" hint="Текущая ликвидность" />
                        <MetricCard title="Активных кошельков" value="42" hint="Участие в экономике" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Heatmap Placeholder */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">Популярность ресурсов (Heatmap)</h3>
                            <div className="space-y-4">
                                <HeatmapRow label="Слоты обучения" value={75} />
                                <HeatmapRow label="Аудиты" value={45} />
                                <HeatmapRow label="Премиум-статусы" value={15} />
                            </div>
                        </div>

                        {/* Anomaly Indicators */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">Индикаторы аномалий</h3>
                            <div className="flex items-center justify-center h-32 text-emerald-500/50 italic text-sm">
                                Аномалий в движении MC не обнаружено
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Личная аналитика (Personal View) */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-amber-400 border-b border-amber-500/20 pb-2">Мой тренд участия (Personal)</h2>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 h-64 flex items-center justify-center">
                    <div className="text-gray-600 italic">График накопления MC (Visual trend placeholder)</div>
                </div>
            </section>

            {/* Журнал Аудита (Governance & Audit) */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-gray-200">Журнал Аудита</h2>
                <div className="bg-black/40 border border-gray-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-800/50 text-gray-400 uppercase text-[10px] font-bold tracking-tighter">
                            <tr>
                                <th className="px-6 py-3">Дата</th>
                                <th className="px-6 py-3">Событие</th>
                                <th className="px-6 py-3">Детали</th>
                                <th className="px-6 py-3 text-right">Статус</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50 text-gray-300">
                            <AuditRow date="18.01.2026 14:20" event="PURCHASE: Slot" details="500 MC" status="SUCCESS" />
                            <AuditRow date="17.01.2026 18:05" event="EARN: Module 07" details="1000 MC" status="COMPLETED" />
                            <AuditRow date="16.01.2026 10:15" event="GMC: Recognition" details="0.5 GMC" status="STRATEGIC" />
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

const MetricCard: React.FC<{ title: string, value: string, hint: string }> = ({ title, value, hint }) => (
    <div className="bg-gray-900 border border-indigo-500/10 rounded-xl p-5 hover:border-indigo-500/30 transition-colors">
        <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">{title}</div>
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-[10px] text-indigo-400/60 mt-2 italic">{hint}</div>
    </div>
);

const HeatmapRow: React.FC<{ label: string, value: number }> = ({ label, value }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-xs">
            <span className="text-gray-400">{label}</span>
            <span className="text-indigo-400 font-bold">{value}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${value}% ` }}></div>
        </div>
    </div>
);

const AuditRow: React.FC<{ date: string, event: string, details: string, status: string }> = ({ date, event, details, status }) => (
    <tr className="hover:bg-white/5 transition-colors">
        <td className="px-6 py-4 font-mono text-gray-500">{date}</td>
        <td className="px-6 py-4 font-medium">{event}</td>
        <td className="px-6 py-4 text-gray-400">{details}</td>
        <td className="px-6 py-4 text-right">
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">{status}</span>
        </td>
    </tr>
);

export default EconomyDashboard;
