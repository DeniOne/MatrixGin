import React from 'react';
import { useGetLeaderboardQuery } from '../features/gamification/gamificationApi';
import { Trophy, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { useAuth } from '../features/auth/useAuth';

const LeaderboardPage: React.FC = () => {
    const { data: leaderboard, isLoading, error } = useGetLeaderboardQuery();
    const { user } = useAuth();

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
        if (rank === 2) return <Trophy className="w-6 h-6 text-gray-400" />;
        if (rank === 3) return <Trophy className="w-6 h-6 text-orange-600" />;
        return <span className="w-6 text-center text-gray-400 font-bold">{rank}</span>;
    };

    const getRankChangeIcon = (change: number) => {
        if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
        return <Minus className="w-4 h-4 text-gray-500" />;
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
                <p className="text-gray-400">Top performers ranked by score</p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
            ) : error ? (
                <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
                    <p className="text-red-500">Failed to load leaderboard</p>
                </div>
            ) : !leaderboard || leaderboard.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                    <p className="text-gray-400">No leaderboard data available</p>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Position
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Change
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {leaderboard.map((entry, index) => {
                                    const rank = index + 1;
                                    const isCurrentUser = user && entry.userId === user.id;

                                    return (
                                        <tr
                                            key={entry.userId}
                                            className={`${isCurrentUser
                                                    ? 'bg-indigo-900/30 border-l-4 border-indigo-500'
                                                    : 'hover:bg-gray-750'
                                                } transition-colors`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getRankIcon(rank)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    {entry.avatar ? (
                                                        <img
                                                            src={entry.avatar}
                                                            alt={entry.fullName}
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                                            <span className="text-white font-bold text-sm">
                                                                {entry.fullName.charAt(0)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-white">
                                                            {entry.fullName}
                                                            {isCurrentUser && (
                                                                <span className="ml-2 text-xs text-indigo-400 font-normal">
                                                                    (You)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-300">
                                                    {entry.position}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-lg font-bold text-white">
                                                    {entry.score.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1">
                                                    {getRankChangeIcon(entry.rankChange)}
                                                    {entry.rankChange !== 0 && (
                                                        <span className={`text-sm font-medium ${entry.rankChange > 0
                                                                ? 'text-green-500'
                                                                : 'text-red-500'
                                                            }`}>
                                                            {Math.abs(entry.rankChange)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaderboardPage;
