/**
 * MyCoursesPage - Страница "Мои курсы" (Персональный дашборд обучения)
 */

import React from 'react';
import { useGetMyCoursesQuery } from '../features/university/api/universityApi';
import { MyCoursesList } from '../features/university/components/MyCoursesList';
import { Link } from 'react-router-dom';
import {
    Trophy,
    ArrowLeft,
    Compass,
    GraduationCap
} from 'lucide-react';

export const MyCoursesPage: React.FC = () => {
    const { data, isLoading, error } = useGetMyCoursesQuery();

    const myCoursesData = data?.data;
    const activeEnrollments = myCoursesData?.active || [];
    const completedEnrollments = myCoursesData?.completed || [];

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="p-4 bg-red-50 text-red-500 rounded-full mb-4">
                    <Compass size={48} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Ошибка загрузки обучения</h2>
                <p className="text-slate-500 mb-6">Не удалось связаться с сервером университета.</p>
                <Link to="/university" className="text-indigo-600 font-bold hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} />
                    Вернуться в университет
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 pt-10 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">
                                <GraduationCap size={16} />
                                Личный кабинет обучения
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Моё обучение</h1>
                            <p className="text-slate-500 mt-2 max-w-xl">
                                Здесь собраны все твои активные курсы, история обучения и достижения.
                                Продолжай расти и открывать новые возможности!
                            </p>
                        </div>
                        <Link
                            to="/university"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                        >
                            <Compass size={18} />
                            Найти новые курсы
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                <div className="grid grid-cols-1 gap-10">

                    {/* Active Learning Section */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 md:p-10">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">В процессе обучения</h2>
                                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-black">
                                    {activeEnrollments.length} КУРСОВ
                                </span>
                            </div>
                            <MyCoursesList enrollments={activeEnrollments} isLoading={isLoading} />
                        </div>
                    </div>

                    {/* Achievements Summary Placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-8 text-white shadow-lg shadow-indigo-100">
                            <Trophy className="mb-4 opacity-80" size={32} />
                            <div className="text-3xl font-black mb-1">{completedEnrollments.length}</div>
                            <div className="text-xs font-bold uppercase tracking-wider opacity-80 text-blue-50">Курсов завершено</div>
                        </div>
                    </div>

                    {/* Completed Courses Section */}
                    {completedEnrollments.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                                    <Trophy size={20} />
                                </div>
                                Архив достижений
                            </h3>
                            <div className="opacity-70 grayscale-[0.5] hover:grayscale-0 transition-all duration-500">
                                <MyCoursesList enrollments={completedEnrollments} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
