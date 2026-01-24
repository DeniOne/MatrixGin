import React, { Suspense } from 'react';
import { useAuth } from '../features/auth/useAuth';
import StatusBadge from '../components/gamification/StatusBadge';
import GrowthRadarChart from '../components/dash/GrowthRadarChart';
import LearningWidget from '../components/dash/LearningWidget';
import AdaptationWidget from '../components/dash/AdaptationWidget';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { ForecastSimulator } from '../features/simulation/ForecastSimulator';
import { useGetGrowthPulseQuery, useGetAdaptationStatusQuery } from '../features/gamification/growthApi';
import { useGetMyCoursesQuery } from '../features/university/api/universityApi';
import { useGetMyShiftQuery } from '../features/mes/mesApi';

// Lazy load 3D component to save bundle size
const StartGrowthWeb3D = React.lazy(() =>
    import('../features/motivation/StartGrowthWeb3D').then(module => ({ default: module.StartGrowthWeb3D }))
);

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    // Fetch All Data
    const { data: pulseData = [] } = useGetGrowthPulseQuery();
    const { data: adaptationData = { mentor: null, nextMeeting: null } } = useGetAdaptationStatusQuery();
    const { data: universityData } = useGetMyCoursesQuery();
    const { data: shiftData } = useGetMyShiftQuery();

    const learningCourses = universityData?.success ? universityData.data.active : [];

    // Map Pulse to 3D Props (safe defaults)
    const getMetric = (label: string) => pulseData.find(p => p.axis === label)?.value || 60;
    const stats3D = {
        quality: getMetric('Качество'),
        speed: getMetric('Скорость'),
        sales: getMetric('Продажи'),
        team: getMetric('Команда')
    };

    // Current Stats for Simulator
    const currentStats = {
        quality: stats3D.quality,
        speed: 12, // TODO: Fetch real avg speed from MES
        sales: 15000, // TODO: Fetch real avg sales
        mcEarnings: shiftData?.forecastEarnings || 0
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-medium text-[#030213] mb-2 tracking-tight">
                    Привет, {user?.firstName || 'Герой'}! 🚀
                </h1>
                <p className="text-[#717182] text-lg">
                    Твой персональный навигатор роста и мотивации.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Visualization & Status */}
                <div className="lg:col-span-8 flex flex-col gap-8">

                    {/* 3D Growth Web with Fallback */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <StatusBadge />
                        <div className="relative">
                            <ErrorBoundary fallback={<GrowthRadarChart data={pulseData} size={320} />}>
                                <Suspense fallback={
                                    <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-black/10">
                                        <span className="text-[#717182] animate-pulse">Загрузка Матрицы...</span>
                                    </div>
                                }>
                                    <StartGrowthWeb3D {...stats3D} />
                                </Suspense>
                            </ErrorBoundary>
                        </div>
                    </div>

                    {/* Simulation Section */}
                    <div className="w-full">
                        <ForecastSimulator
                            currentStats={currentStats}
                            onSuggestGoal={() => window.location.hash = '#tasks/goals'}
                        />
                    </div>

                    {/* Adaptation */}
                    <div className="w-full">
                        <AdaptationWidget data={adaptationData} />
                    </div>
                </div>

                {/* Right Column: Learning & Activity */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <LearningWidget courses={learningCourses} />

                    {/* Real Stats / Activity */}
                    <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm">
                        <h3 className="text-lg font-medium text-[#030213] mb-6 italic">Пульс активности</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-black/5">
                                <span className="text-sm text-[#717182]">Фото-компании</span>
                                <span className="text-lg font-medium text-indigo-600">
                                    {shiftData?.companiesCreated || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-black/5">
                                <span className="text-sm text-[#717182]">Продано сегодня</span>
                                <span className="text-lg font-medium text-emerald-600">
                                    {shiftData?.companiesSold || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-[#717182]">Прогноз (факт)</span>
                                <span className="text-lg font-medium text-amber-500">
                                    {shiftData?.forecastEarnings || 0} ₽
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DashboardPage;
