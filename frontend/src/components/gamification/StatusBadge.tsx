import React from 'react';
import { useGetMyStatusQuery, EmployeeStatus, EmployeeRank } from '../../features/gamification/gamificationApi';
import { Trophy, Loader2 } from 'lucide-react';

const StatusBadge: React.FC = () => {
    const { data: status, isLoading, error } = useGetMyStatusQuery();

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error || !status) {
        return null;
    }

    const getStatusColor = (statusValue: EmployeeStatus) => {
        switch (statusValue) {
            case EmployeeStatus.PHOTON:
                return 'bg-gray-600 text-gray-200';
            case EmployeeStatus.TOPCHIK:
                return 'bg-blue-600 text-blue-100';
            case EmployeeStatus.KREMEN:
                return 'bg-green-600 text-green-100';
            case EmployeeStatus.CARBON:
                return 'bg-purple-600 text-purple-100';
            case EmployeeStatus.UNIVERSE:
                return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
            default:
                return 'bg-gray-600 text-gray-200';
        }
    };

    const getRankColor = (rank: EmployeeRank) => {
        switch (rank) {
            case EmployeeRank.TRAINEE:
                return 'text-gray-400';
            case EmployeeRank.EMPLOYEE:
                return 'text-blue-400';
            case EmployeeRank.SPECIALIST:
                return 'text-green-400';
            case EmployeeRank.EXPERT:
                return 'text-purple-400';
            case EmployeeRank.INVESTOR:
                return 'text-yellow-400';
            case EmployeeRank.MAGNATE:
                return 'text-orange-400';
            default:
                return 'text-gray-400';
        }
    };

    const getStatusLabel = (statusValue: EmployeeStatus) => {
        switch (statusValue) {
            case EmployeeStatus.PHOTON:
                return 'Фотон';
            case EmployeeStatus.TOPCHIK:
                return 'Топчик';
            case EmployeeStatus.KREMEN:
                return 'Кремень';
            case EmployeeStatus.CARBON:
                return 'Углерод';
            case EmployeeStatus.UNIVERSE:
                return 'UNIVERSE';
            default:
                return statusValue;
        }
    };

    const getRankLabel = (rank: EmployeeRank) => {
        switch (rank) {
            case EmployeeRank.TRAINEE:
                return 'Стажёр';
            case EmployeeRank.EMPLOYEE:
                return 'Сотрудник';
            case EmployeeRank.SPECIALIST:
                return 'Специалист';
            case EmployeeRank.EXPERT:
                return 'Эксперт';
            case EmployeeRank.INVESTOR:
                return 'Инвестор';
            case EmployeeRank.MAGNATE:
                return 'Магнат';
            default:
                return rank;
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-400">Статус</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(status.status)}`}>
                    {getStatusLabel(status.status)}
                </span>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">Ранг</span>
                <span className={`text-sm font-bold ${getRankColor(status.rank)}`}>
                    {getRankLabel(status.rank)}
                </span>
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Прогресс до следующего статуса</span>
                    <span className="text-xs font-medium text-white">
                        {status.progressPercent.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(status.progressPercent, 100)}%` }}
                    />
                </div>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                        {status.currentGMC.toLocaleString()} GMC
                    </span>
                    <span className="text-xs text-gray-500">
                        {status.nextStatusThreshold.toLocaleString()} GMC
                    </span>
                </div>
            </div>

            {status.privileges && status.privileges.length > 0 && (
                <div className="pt-3 border-t border-gray-700">
                    <div className="text-xs font-medium text-gray-400 mb-2">Привилегии</div>
                    <div className="flex flex-wrap gap-1">
                        {status.privileges.map((privilege, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded"
                            >
                                {privilege}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatusBadge;
