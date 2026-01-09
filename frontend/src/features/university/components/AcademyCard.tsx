/**
 * AcademyCard - Карточка академии
 */

import React from 'react';
import { Academy } from '../api/universityApi';
import { Link } from 'react-router-dom';

interface AcademyCardProps {
    academy: Academy;
}

export const AcademyCard: React.FC<AcademyCardProps> = ({ academy }) => {
    return (
        <Link
            to={`/university/academies/${academy.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
        >
            <div className="flex items-start space-x-4">
                {academy.iconUrl && (
                    <img
                        src={academy.iconUrl}
                        alt={academy.name}
                        className="w-16 h-16 rounded-lg object-cover"
                    />
                )}
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {academy.name}
                    </h3>
                    {academy.description && (
                        <p className="text-gray-600 text-sm mb-4">
                            {academy.description}
                        </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                            <svg
                                className="w-4 h-4 mr-1"
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
                            {academy.coursesCount} курсов
                        </span>
                        <span className="flex items-center">
                            <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {academy.skillsCount} навыков
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
