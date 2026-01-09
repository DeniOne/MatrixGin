/**
 * MyCoursesPage - Страница "Мои курсы"
 */

import React from 'react';
import { useGetMyCoursesQuery } from '../features/university/api/universityApi';
import { Link } from 'react-router-dom';

export const MyCoursesPage: React.FC = () => {
    const { data, isLoading, error } = useGetMyCoursesQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Ошибка загрузки данных
                </div>
            </div>
        );
    }

    const courses = data?.data;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Мои курсы</h1>
                            <p className="text-gray-500 mt-1">Отслеживайте прогресс обучения</p>
                        </div>
                        <Link
                            to="/university"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Найти курсы
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Active Courses */}
                {courses?.active && courses.active.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Активные курсы ({courses.active.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.active.map((enrollment) => (
                                <div
                                    key={enrollment.id}
                                    className="bg-white rounded-lg shadow-md p-6"
                                >
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {enrollment.courseTitle}
                                        </h3>
                                        {enrollment.academyName && (
                                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                {enrollment.academyName}
                                            </span>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Прогресс</span>
                                            <span className="text-sm font-semibold text-blue-600">
                                                {enrollment.progress}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all"
                                                style={{ width: `${enrollment.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-500 mb-4">
                                        Начат: {new Date(enrollment.enrolledAt).toLocaleDateString('ru-RU')}
                                    </div>

                                    <Link
                                        to={`/university/courses/${enrollment.courseId}`}
                                        className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Продолжить
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed Courses */}
                {courses?.completed && courses.completed.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Завершенные курсы ({courses.completed.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.completed.map((enrollment) => (
                                <div
                                    key={enrollment.id}
                                    className="bg-white rounded-lg shadow-md p-6 border-2 border-green-200"
                                >
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {enrollment.courseTitle}
                                            </h3>
                                            <svg
                                                className="w-6 h-6 text-green-600"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        {enrollment.academyName && (
                                            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                {enrollment.academyName}
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        Завершен: {enrollment.completedAt && new Date(enrollment.completedAt).toLocaleDateString('ru-RU')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {(!courses?.active || courses.active.length === 0) &&
                    (!courses?.completed || courses.completed.length === 0) && (
                        <div className="text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                Нет активных курсов
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Начните обучение, выбрав курс из каталога
                            </p>
                            <div className="mt-6">
                                <Link
                                    to="/university"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Выбрать курс
                                </Link>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};
