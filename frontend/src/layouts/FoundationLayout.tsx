import React from 'react';
import { Outlet } from 'react-router-dom';

export const FoundationLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            {/* Strict Header: No Navigation */}
            <header className="bg-white border-b border-gray-200 px-8 py-6 flex justify-center items-center shadow-sm">
                <div className="text-center">
                    <h1 className="text-2xl font-medium text-gray-900 tracking-tight">КОРПОРАТИВНЫЙ УНИВЕРСИТЕТ</h1>
                    <p className="text-sm text-[#717182] uppercase tracking-widest mt-1">Фундаментальное погружение</p>
                </div>
            </header>

            {/* Focused Content Area */}
            <main className="flex-grow flex flex-col items-center justify-start pt-12 px-4 pb-12">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                    <Outlet />
                </div>

                <footer className="mt-8 text-center text-[#717182] text-xs">
                    <p>Операционная Система MatrixGin v2.2</p>
                    <p className="mt-1">Доступ строго контролируется. Действия логируются.</p>
                </footer>
            </main>
        </div>
    );
};
