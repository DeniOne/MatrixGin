/**
 * MyCoursesList - Список активных курсов пользователя с прогрессом
 */

import React from 'react';
import { Enrollment } from '../api/universityApi';
import { Link } from 'react-router-dom';
import {
    PlayCircle,
    Trophy
} from 'lucide-react';

interface MyCoursesListProps {
    enrollments: Enrollment[];
    isLoading?: boolean;
}

export const MyCoursesList: React.FC<MyCoursesListProps> = ({
    enrollments,
    isLoading = false
}) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
                ))}
            </div>
        );
    }

    if (enrollments.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="p-4 bg-white rounded-full shadow-sm inline-block mb-4">
                    <Trophy size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">У тебя пока нет активных курсов</h3>
                <p className="text-[#717182] text-sm max-w-xs mx-auto">
                    Загляни в каталог, чтобы начать своё обучение и прокачать навыки.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {enrollments.map((enrollment) => (
                <Link
                    key={enrollment.id}
                    to={`/university/course/${enrollment.id}`}
                    className="group block bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:border-indigo-100"
                >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Course Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-medium text-indigo-500 uppercase tracking-widest">
                                    {enrollment.academyName || 'Курс'}
                                </span>
                            </div>
                            <h3 className="text-base font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {enrollment.courseTitle}
                            </h3>
                        </div>

                        {/* Progress */}
                        <div className="flex-1 min-w-[200px]">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-medium text-[#717182] uppercase">Прогресс</span>
                                <span className="text-xs font-medium text-indigo-600">{enrollment.progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-1000 ease-out"
                                    style={{ width: `${enrollment.progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="flex items-center justify-between md:justify-end gap-6 md:w-32">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-medium text-[#717182] uppercase">Последняя активность</span>
                                <span className="text-xs text-gray-600">
                                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-[#030213] transition-all transform group-hover:scale-110">
                                <PlayCircle size={20} />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};
