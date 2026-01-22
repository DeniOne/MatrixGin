import React from 'react';

export const HRDashboardPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">HR Dashboard</h2>
                <div className="text-center py-12 text-gray-500">
                    <p>Dashboard в разработке</p>
                    <p className="text-sm mt-2">
                        Здесь будут виджеты: истекающие документы, приказы на подпись, новые сотрудники
                    </p>
                    <p className="text-xs mt-4 text-gray-400">
                        ⚠️ Dashboard будет READ-ONLY (без mutation-кнопок)
                    </p>
                </div>
            </div>
        </div>
    );
};
