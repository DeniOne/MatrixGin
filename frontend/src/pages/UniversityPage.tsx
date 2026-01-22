/**
 * UniversityPage - Главная страница Корпоративного Университета
 */

import React, { useState } from 'react';
useGetMyCoursesQuery,
    useGetTrainerDashboardQuery
} from '../features/university/api/universityApi';
import { AcademyCard } from '../features/university/components/AcademyCard';
import { CourseCard } from '../features/university/components/CourseCard';
import { MyCoursesList } from '../features/university/components/MyCoursesList';
import { TrainerApplicationModal } from '../features/university/components/TrainerApplicationModal';
import { Link } from 'react-router-dom';
import {
    LayoutGrid,
    Compass,
    Trophy,
    Target,
    GraduationCap,
    ShieldCheck
} from 'lucide-react';

type ViewMode = 'academies' | 'catalog' | 'my-courses';

export const UniversityPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('academies');
    const [isAppModalOpen, setIsAppModalOpen] = useState(false);

    // API Hooks
    const academiesQuery = useGetAcademiesQuery(undefined, { skip: viewMode !== 'academies' });
    const catalogQuery = useGetAvailableCoursesQuery(undefined, { skip: viewMode !== 'catalog' });
    const myCoursesQuery = useGetMyCoursesQuery(undefined, { skip: viewMode !== 'my-courses' });
    const trainerQuery = useGetTrainerDashboardQuery();

    const isTrainer = !!trainerQuery.data?.data;

    const isLoading = academiesQuery.isLoading || catalogQuery.isLoading || myCoursesQuery.isLoading;

    const academies = academiesQuery.data?.data || [];
    const availableCourses = catalogQuery.data?.data || [];
    const myCoursesData = myCoursesQuery.data?.data;
    const activeEnrollments = myCoursesData?.active || [];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Premium Header */}
            <div className="bg-slate-900 relative overflow-hidden py-16 border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent opacity-50" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                                <Trophy size={14} />
                                Твой путь к мастерству
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                                Корпоративный <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Университет</span>
                            </h1>
                            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                                Получайте знания, подтверждайте экспертизу и развивайте карьеру
                                вместе с лучшими специалистами MatrixGin.
                            </p>
                        </div>

                        {/* Summary Stats & Actions */}
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl min-w-[120px]">
                                    <div className="text-2xl font-black text-white">{academies.length || 0}</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Академий</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl min-w-[120px]">
                                    <div className="text-2xl font-black text-white">{activeEnrollments.length}</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">В процессе</div>
                                </div>
                            </div>

                            {isTrainer ? (
                                <Link
                                    to="/university/trainer/dashboard"
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
                                >
                                    <ShieldCheck size={18} />
                                    Дашборд Тренера
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setIsAppModalOpen(true)}
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-sm transition-all backdrop-blur-sm"
                                >
                                    <GraduationCap size={18} />
                                    Стать тренером
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Tabs */}
            <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setViewMode('academies')}
                            className={`flex items-center gap-2 py-5 px-1 border-b-2 font-bold text-sm transition-all ${viewMode === 'academies'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            <LayoutGrid size={18} />
                            Академии
                        </button>
                        <button
                            onClick={() => setViewMode('catalog')}
                            className={`flex items-center gap-2 py-5 px-1 border-b-2 font-bold text-sm transition-all ${viewMode === 'catalog'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            <Compass size={18} />
                            Каталог курсов
                        </button>
                        <button
                            onClick={() => setViewMode('my-courses')}
                            className={`flex items-center gap-2 py-5 px-1 border-b-2 font-bold text-sm transition-all ${viewMode === 'my-courses'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            <Target size={18} />
                            Мое обучение
                            {activeEnrollments.length > 0 && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white">
                                    {activeEnrollments.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Academies View */}
                        {viewMode === 'academies' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-end justify-between">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Образовательные центры</h2>
                                    <span className="text-sm font-medium text-slate-400">Всего центров: {academies.length}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {academies.map((academy) => (
                                        <AcademyCard key={academy.id} academy={academy} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Catalog View */}
                        {viewMode === 'catalog' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Доступные курсы</h2>
                                        <p className="text-slate-500 text-sm mt-1">Курсы подобраны согласно вашей текущей квалификации</p>
                                    </div>
                                    <span className="text-sm font-medium text-slate-400">Найдено: {availableCourses.length}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {availableCourses.map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            isEnrolled={activeEnrollments.some(e => e.courseId === course.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* My Learning View */}
                        {viewMode === 'my-courses' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-end justify-between">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Твоё обучение</h2>
                                </div>
                                <MyCoursesList enrollments={activeEnrollments} />

                                {myCoursesData && myCoursesData.completed.length > 0 && (
                                    <div className="mt-12 opacity-60">
                                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                            <Trophy size={20} className="text-amber-500" />
                                            Завершенные курсы
                                        </h3>
                                        <MyCoursesList enrollments={myCoursesData.completed} />
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <TrainerApplicationModal
                isOpen={isAppModalOpen}
                onClose={() => setIsAppModalOpen(false)}
            />
        </div>
    );
};
