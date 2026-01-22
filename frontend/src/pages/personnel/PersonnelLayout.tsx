import React from 'react';
import { Outlet } from 'react-router-dom';

export const PersonnelLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Кадровый учёт</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Управление личными делами, приказами и договорами
                    </p>
                </div>

                <nav className="mb-6 border-b border-gray-200">
                    <div className="flex space-x-8">
                        <a
                            href="/personnel"
                            className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600"
                        >
                            Личные дела
                        </a>
                        <a
                            href="/personnel/orders"
                            className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        >
                            Приказы
                        </a>
                        <a
                            href="/personnel/contracts"
                            className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        >
                            Договоры
                        </a>
                        <a
                            href="/personnel/dashboard"
                            className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        >
                            Dashboard
                        </a>
                    </div>
                </nav>

                <Outlet />
            </div>
        </div>
    );
};
