import React from 'react';
import { useGetAnalyticsQuery } from '../../features/ai/aiApi';
import { BarChart3, TrendingUp, Users, Loader2, AlertCircle } from 'lucide-react';

const AIFeedbackAnalyticsPage: React.FC = () => {
    const { data, isLoading, error } = useGetAnalyticsQuery();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <p className="text-[#717182] uppercase tracking-widest text-xs font-medium">Загрузка аналитики...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
                <p className="text-[#717182]">Ошибка загрузки аналитики</p>
                <p className="text-xs text-gray-600 mt-2">Доступ ограничен для AI Team / Admin</p>
            </div>
        );
    }

    if (!data) return null;

    const { totalFeedback, byType, percentages } = data;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <header className="space-y-4">
                <div className="flex items-center gap-4">
                    <BarChart3 className="w-10 h-10 text-indigo-500" />
                    <h1 className="text-4xl font-medium text-[#030213] tracking-tighter">
                        AI Feedback Analytics
                    </h1>
                </div>
                <p className="text-[#717182] font-light max-w-2xl">
                    Агрегированная статистика обратной связи на AI-рекомендации.
                    Данные анонимизированы и не содержат персональной информации.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Restricted Access: AI Team / Admin Only</span>
                </div>
            </header>

            {/* Total Feedback */}
            <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-2">
                            Всего отзывов
                        </p>
                        <p className="text-5xl font-medium text-[#030213]">{totalFeedback}</p>
                    </div>
                    <TrendingUp className="w-16 h-16 text-indigo-500/30" />
                </div>
            </div>

            {/* Breakdown by Type */}
            <div className="space-y-4">
                <h2 className="text-sm font-medium text-[#717182] uppercase tracking-widest flex items-center gap-4">
                    Распределение по типам
                    <div className="h-px flex-1 bg-white"></div>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Helpful */}
                    <MetricCard
                        label="👍 Полезно"
                        count={byType.HELPFUL}
                        percentage={percentages.helpful}
                        color="emerald"
                    />

                    {/* Not Applicable */}
                    <MetricCard
                        label="👎 Не применимо"
                        count={byType.NOT_APPLICABLE}
                        percentage={percentages.notApplicable}
                        color="amber"
                    />

                    {/* Unsure */}
                    <MetricCard
                        label="🤔 Не уверен"
                        count={byType.UNSURE}
                        percentage={percentages.unsure}
                        color="gray"
                    />
                </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="space-y-4">
                <h2 className="text-sm font-medium text-[#717182] uppercase tracking-widest flex items-center gap-4">
                    Визуализация
                    <div className="h-px flex-1 bg-white"></div>
                </h2>

                <div className="p-6 bg-white/40 border border-black/10 rounded-3xl space-y-4">
                    <BarItem label="Полезно" percentage={percentages.helpful} color="bg-emerald-500" />
                    <BarItem label="Не применимо" percentage={percentages.notApplicable} color="bg-amber-500" />
                    <BarItem label="Не уверен" percentage={percentages.unsure} color="bg-gray-500" />
                </div>
            </div>

            {/* Period Info */}
            <div className="p-4 bg-white/20 border border-black/10 rounded-2xl">
                <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Период: {new Date(data.periodStart).toLocaleDateString()} — {new Date(data.periodEnd).toLocaleDateString()}</span>
                    <span>Обновлено: {new Date(data.generatedAt).toLocaleString()}</span>
                </div>
            </div>

            {/* Privacy Notice */}
            <div className="p-6 bg-white/60 border border-black/10 rounded-2xl">
                <h3 className="text-sm font-medium text-[#717182] uppercase tracking-widest mb-3">
                    🔒 Политика конфиденциальности
                </h3>
                <ul className="space-y-2 text-sm text-[#717182]">
                    <li>✓ Данные агрегированы и анонимизированы</li>
                    <li>✓ Нет user-level breakdown</li>
                    <li>✓ Нет доступа к индивидуальным комментариям</li>
                    <li>✓ Используется только для улучшения качества AI</li>
                </ul>
            </div>
        </div>
    );
};

// Metric Card Component
interface MetricCardProps {
    label: string;
    count: number;
    percentage: number;
    color: 'emerald' | 'amber' | 'gray';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, count, percentage, color }) => {
    const colorClasses = {
        emerald: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10',
        amber: 'text-amber-500 border-amber-500/20 bg-amber-500/10',
        gray: 'text-[#717182] border-gray-500/20 bg-gray-500/10',
    };

    return (
        <div className={`p-6 border rounded-3xl ${colorClasses[color]}`}>
            <p className="text-xs font-medium uppercase tracking-widest mb-3 opacity-70">{label}</p>
            <div className="flex items-baseline gap-3">
                <p className="text-4xl font-medium">{count}</p>
                <p className="text-2xl font-medium opacity-50">{percentage}%</p>
            </div>
        </div>
    );
};

// Bar Item Component
interface BarItemProps {
    label: string;
    percentage: number;
    color: string;
}

const BarItem: React.FC<BarItemProps> = ({ label, percentage, color }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#717182] font-medium">{label}</span>
                <span className="text-[#030213] font-medium">{percentage}%</span>
            </div>
            <div className="h-3 bg-gray-950 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default AIFeedbackAnalyticsPage;
