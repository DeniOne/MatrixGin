/**
 * CourseCard - Карточка курса
 */

import React from 'react';
import { Course } from '../api/universityApi';
import { Link } from 'react-router-dom';

interface CourseCardProps {
    course: Course;
    baseUrl?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
    course,
    baseUrl = '/university/courses'
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {course.title}
                    </h3>
                    {course.academyName && (
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mb-2">
                            {course.academyName}
                        </span>
                    )}
                </div>
                {course.isMandatory && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Обязательный
                    </span>
                )}
            </div>

            {course.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                </p>
            )}

            <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center space-x-3">
                    {course.modulesCount !== undefined && (
                        <span className="text-gray-500">
                            📚 {course.modulesCount} модулей
                        </span>
                    )}
                    {course.totalDuration && (
                        <span className="text-gray-500">
                            ⏱️ {Math.round(course.totalDuration / 60)}ч
                        </span>
                    )}
                </div>
                {course.requiredGrade && (
                    <span className="text-xs text-gray-500">
                        Уровень: {course.requiredGrade}
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                    {course.rewardMC > 0 && (
                        <span className="text-sm font-semibold text-yellow-600">
                            🪙 {course.rewardMC} MC
                        </span>
                    )}
                    {course.rewardGMC > 0 && (
                        <span className="text-sm font-semibold text-purple-600">
                            💎 {course.rewardGMC} GMC
                        </span>
                    )}
                </div>
                <Link
                    to={`${baseUrl}/${course.id}`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Подробнее
                </Link>
            </div>
        </div>
    );
};
