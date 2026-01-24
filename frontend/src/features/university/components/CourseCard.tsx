/**
 * CourseCard - Улучшенная карточка курса в премиум-стиле
 */

import React from 'react';
import { Course, useEnrollInCourseMutation } from '../api/universityApi';
import { Link } from 'react-router-dom';
import {
    BookOpen,
    Clock,
    Award,
    ChevronRight,
    Loader2,
    GraduationCap,
    AlertCircle
} from 'lucide-react';

interface CourseCardProps {
    course: Course;
    isEnrolled?: boolean;
    baseUrl?: string;
    onEnrollSuccess?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
    course,
    isEnrolled = false,
    baseUrl = '/university/courses',
    onEnrollSuccess
}) => {
    const [enroll, { isLoading }] = useEnrollInCourseMutation();

    const handleEnroll = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await enroll({ courseId: course.id }).unwrap();
            if (onEnrollSuccess) onEnrollSuccess();
        } catch (err) {
            console.error('Failed to enroll:', err);
        }
    };

    const getGradeColor = (grade?: string) => {
        switch (grade) {
            case 'INTERN': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'SPECIALIST': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'PROFESSIONAL': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'EXPERT': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'MASTER': return 'bg-amber-50 text-amber-700 border-amber-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
            {/* Header / Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                {course.isMandatory && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-rose-500 text-[#030213] text-[10px] font-medium uppercase tracking-wider rounded-md shadow-sm">
                        <AlertCircle size={10} />
                        Обязательный
                    </div>
                )}
                {course.requiredGrade && (
                    <div className={`flex items-center gap-1 px-2 py-1 border text-[10px] font-medium uppercase tracking-wider rounded-md shadow-sm ${getGradeColor(course.requiredGrade)}`}>
                        <GraduationCap size={10} />
                        {course.requiredGrade}
                    </div>
                )}
            </div>

            {/* Background Accent */}
            <div className="h-24 bg-gradient-to-br from-indigo-50 to-blue-50 relative">
                <div className="absolute -bottom-6 right-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <BookOpen size={80} className="text-indigo-600" />
                </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 pt-8 flex-1 flex flex-col">
                <div className="mb-2">
                    <span className="text-[10px] font-medium text-indigo-500 uppercase tracking-widest block mb-1">
                        {course.academyName || 'Академия'}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                        {course.title}
                    </h3>
                </div>

                {course.description && (
                    <p className="text-[#717182] text-sm mb-6 line-clamp-2 flex-grow">
                        {course.description}
                    </p>
                )}

                {/* Meta Stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                            <BookOpen size={14} />
                        </div>
                        <span className="text-xs font-medium">{course.modulesCount || 0} модулей</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                            <Clock size={14} />
                        </div>
                        <span className="text-xs font-medium">{course.totalDuration ? Math.round(course.totalDuration / 60) : 1} ч</span>
                    </div>
                </div>

                {/* Footer / Action */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                        {course.rewardMC > 0 && (
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                <Award size={14} className="text-amber-500" />
                                <span className="text-xs font-medium text-amber-700">{course.rewardMC} MC</span>
                            </div>
                        )}
                    </div>

                    {isEnrolled ? (
                        <Link
                            to={`${baseUrl}/${course.id}`}
                            className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-[#030213] text-xs font-medium rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5"
                        >
                            Продолжить
                            <ChevronRight size={14} />
                        </Link>
                    ) : (
                        <button
                            onClick={handleEnroll}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border-2 border-indigo-600 text-xs font-medium rounded-xl hover:bg-indigo-50 transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <GraduationCap size={14} />
                            )}
                            Записаться
                        </button>
                    )}
                </div>
            </div>

            {/* Completed Overlay if status were here */}
            {/* ... */}
        </div>
    );
};
