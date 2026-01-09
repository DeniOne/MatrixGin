import React from 'react';
import { useAuth } from '../features/auth/useAuth';
import StatusBadge from '../components/gamification/StatusBadge';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.firstName}!
                </h1>
                <p className="text-gray-400">
                    Here's what's happening with your account today.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Status Badge */}
                <div className="lg:col-span-1">
                    <StatusBadge />
                </div>

                {/* Placeholder Cards */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Active Tasks</h3>
                    <p className="text-3xl font-bold text-indigo-500">0</p>
                    <p className="text-sm text-gray-400 mt-2">Tasks in progress</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Completed This Week</h3>
                    <p className="text-3xl font-bold text-green-500">0</p>
                    <p className="text-sm text-gray-400 mt-2">Tasks completed</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
