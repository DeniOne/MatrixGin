import React, { Suspense } from 'react';
import { useAuth } from '../features/auth/useAuth';
import StatusBadge from '../components/gamification/StatusBadge';
import GrowthRadarChart from '../components/dash/GrowthRadarChart';
import LearningWidget from '../components/dash/LearningWidget';
import AdaptationWidget from '../components/dash/AdaptationWidget';
import FoundationWidget from '../components/dash/FoundationWidget';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { ForecastSimulator } from '../features/simulation/ForecastSimulator';
import { useGetGrowthPulseQuery, useGetAdaptationStatusQuery } from '../features/gamification/growthApi';
import { useGetMyCoursesQuery } from '../features/university/api/universityApi';
import { useGetMyShiftQuery } from '../features/mes/mesApi';

import { StartGrowthWeb3D } from '../features/motivation/StartGrowthWeb3D';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    // Fetch All Data (Canon Requirement: Hooks at Top)
    const pulseResult = useGetGrowthPulseQuery();
    const adaptationResult = useGetAdaptationStatusQuery();
    const universityResult = useGetMyCoursesQuery();
    const shiftResult = useGetMyShiftQuery();

    if (!user) {
        return (
            <div className="flex h-full items-center justify-center p-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[#717182] font-medium animate-pulse">Инициализация профиля...</span>
                </div>
            </div>
        );
    }

    const pulseData = pulseResult?.data || [];
    const adaptationData = adaptationResult?.data || { mentor: null, nextMeeting: null };
    const universityData = universityResult?.data;
    const shiftData = shiftResult?.data || {
        forecastEarnings: 0,
        companiesCreated: 0,
        companiesSold: 0
    };

    const learningCourses = universityData?.success ? (universityData?.data?.active || []) : [];

    // Map Pulse to Stats (safe defaults)
    const getMetric = (label: string) => {
        if (!Array.isArray(pulseData)) return 60;
        return pulseData.find(p => p?.axis === label)?.value || 60;
    };

    const stats3D = {
        quality: getMetric('Качество'),
        speed: getMetric('Скорость'),
        sales: getMetric('Продажи'),
        team: getMetric('Команда')
    };

    // Current Stats for Simulator
    const currentStats = {
        quality: stats3D.quality,
        speed: 12,
        sales: 15000,
        mcEarnings: shiftData?.forecastEarnings || 0
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 bg-[#F3F3F5] min-h-screen">
            {/* Header - Geist Canon Standard */}
            <div>
                <h1 className="text-4xl font-medium text-[#030213] mb-3 tracking-tight">
                    Привет, {user?.firstName || 'Герой'}! 🚀
                </h1>
                <p className="text-[#717182] text-lg font-normal">
                    Твой персональный навигатор роста и мотивации.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column - Wider layout to close the gap */}
                <div className="lg:col-span-8 flex flex-col gap-10">
                    {/* FOUNDATION WIDGET - CANON: Always First if not accepted */}
                    {user?.foundationStatus !== 'ACCEPTED' && (
                        <div className="w-full">
                            <FoundationWidget />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
                        <div className="md:col-span-4 h-full">
                            <StatusBadge />
                        </div>
                        <div className="md:col-span-8 relative h-full">
                            <ErrorBoundary fallback={<GrowthRadarChart data={pulseData} size={300} />}>
                                <StartGrowthWeb3D {...stats3D} />
                            </ErrorBoundary>
                        </div>
                    </div>

                    <div className="w-full">
                        <ForecastSimulator
                            currentStats={currentStats}
                            onSuggestGoal={() => window.location.hash = '#tasks/goals'}
                        />
                    </div>

                    <div className="w-full">
                        <AdaptationWidget data={adaptationData} />
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 flex flex-col gap-10">
                    <LearningWidget courses={learningCourses} />

                    {/* Stats Widget - Canon Clean Version */}
                    <div className="bg-white rounded-2xl p-8 border border-black/10 shadow-sm">
                        <h3 className="text-xs font-medium text-indigo-600 uppercase tracking-[0.2em] mb-8">
                            Пульс активности
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-baseline py-2 border-b border-black/[0.05]">
                                <span className="text-sm font-normal text-[#717182]">Фото-компании</span>
                                <span className="text-2xl font-medium text-[#030213]">
                                    {shiftData?.companiesCreated || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline py-2 border-b border-black/[0.05]">
                                <span className="text-sm font-normal text-[#717182]">Продано сегодня</span>
                                <span className="text-2xl font-medium text-[#030213]">
                                    {shiftData?.companiesSold || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline py-2">
                                <span className="text-sm font-normal text-[#717182]">Прогноз (факт)</span>
                                <span className="text-2xl font-medium text-[#030213]">
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
