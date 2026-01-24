import React from 'react';
import { useGetMyStatusQuery, EmployeeStatus, EmployeeRank } from '../../features/gamification/gamificationApi';
import { Trophy, Loader2 } from 'lucide-react';

const StatusBadge: React.FC = () => {
    const { data: status, isLoading, error } = useGetMyStatusQuery();

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-[#717182]" />
            </div>
        );
    }

    if (error || !status) {
        return null;
    }

    const getStatusColor = (statusValue: EmployeeStatus) => {
        switch (statusValue) {
            case EmployeeStatus.PHOTON:
                return 'bg-gray-100 text-gray-600 border border-black/5';
            case EmployeeStatus.TOPCHIK:
                return 'bg-blue-50 text-blue-600 border border-blue-200';
            case EmployeeStatus.KREMEN:
                return 'bg-green-50 text-green-600 border border-green-200';
            case EmployeeStatus.CARBON:
                return 'bg-purple-50 text-purple-600 border border-purple-200';
            case EmployeeStatus.UNIVERSE:
                return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-[#030213] shadow-lg shadow-orange-500/20';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getRankColor = (rank: EmployeeRank) => {
        switch (rank) {
            case EmployeeRank.TRAINEE:
                return 'text-[#717182]';
            case EmployeeRank.EMPLOYEE:
                return 'text-blue-600';
            case EmployeeRank.SPECIALIST:
                return 'text-green-600';
            case EmployeeRank.EXPERT:
                return 'text-purple-600';
            case EmployeeRank.INVESTOR:
                return 'text-yellow-600';
            case EmployeeRank.MAGNATE:
                return 'text-orange-600';
            default:
                return 'text-[#717182]';
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
        <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-sm space-y-4 h-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-[#717182]">Статус</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status.status)}`}>
                    {getStatusLabel(status.status)}
                </span>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#717182]">Ранг</span>
                <span className={`text-sm font-medium ${getRankColor(status.rank)}`}>
                    {getRankLabel(status.rank)}
                </span>
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#717182]">Прогресс до следующего статуса</span>
                    <span className="text-xs font-medium text-[#030213]">
                        {status.progressPercent.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full bg-[#F3F3F5] rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(status.progressPercent, 100)}%` }}
                    />
                </div>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-[#717182]">
                        {status.currentGMC.toLocaleString()} GMC
                    </span>
                    <span className="text-xs text-[#717182]">
                        {status.nextStatusThreshold.toLocaleString()} GMC
                    </span>
                </div>
            </div>

            {status.privileges && status.privileges.length > 0 && (
                <div className="pt-3 border-t border-black/5">
                    <div className="text-xs font-medium text-[#717182] mb-2">Привилегии</div>
                    <div className="flex flex-wrap gap-1">
                        {status.privileges.map((privilege, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-[#F3F3F5] text-xs text-[#030213] rounded border border-black/5"
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
