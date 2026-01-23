import React, { useEffect, useState } from 'react';
import { useGetLeaderboardQuery } from '../../features/gamification/gamificationApi';
import { useNavigate } from 'react-router-dom';

import './LeaderboardPage.css'; // We'll create a simple CSS file for styling

interface LeaderboardEntry {
    userId: string;
    name: string;
    avatar?: string;
    position: number;
    score: number;
    status?: string;
    level?: number;
    rankChange: number; // Added required property based on usage
}

const metrics = [
    { value: 'MC_BALANCE', label: '💰 MC Balance' },
    { value: 'GMC_BALANCE', label: '🏆 GMC Balance' },
    { value: 'COMPLETED_TASKS', label: '✅ Completed Tasks' },
    { value: 'STATUS_LEVEL', label: '📈 Status Level' }
];

const periods = [
    { value: 'WEEK', label: 'Week' },
    { value: 'MONTH', label: 'Month' },
    { value: 'ALL_TIME', label: 'All Time' }
];

const LeaderboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedMetric, setSelectedMetric] = useState<string>('MC_BALANCE');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL_TIME');
    const { data, error, isLoading, refetch } = useGetLeaderboardQuery({
        metric: selectedMetric,
        period: selectedPeriod
    });

    // Highlight current user
    const currentUserId = '';// TODO: replace with actual user id from auth context

    useEffect(() => {
        refetch();
    }, [selectedMetric, selectedPeriod]);

    const handleRowClick = (userId: string) => {
        // Navigate to user profile page (if exists)
        navigate(`/profile/${userId}`);
    };

    if (isLoading) return <div className="loader">Loading leaderboard...</div>;
    if (error) return <div className="error">Failed to load leaderboard.</div>;

    const entries: LeaderboardEntry[] = (data as any) || [];

    return (
        <div className="leaderboard-page">
            <h1 className="page-title">Таблица лидеров</h1>
            <div className="filters">
                <select
                    value={selectedMetric}
                    onChange={e => setSelectedMetric(e.target.value)}
                    className="metric-select"
                >
                    {metrics.map(m => (
                        <option key={m.value} value={m.value}>
                            {m.label}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedPeriod}
                    onChange={e => setSelectedPeriod(e.target.value)}
                    className="period-select"
                >
                    {periods.map(p => (
                        <option key={p.value} value={p.value}>
                            {p.label}
                        </option>
                    ))}
                </select>
            </div>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Аватар</th>
                        <th>Название</th>
                        <th>Баллы</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map(entry => (
                        <tr
                            key={entry.userId}
                            className={entry.userId === currentUserId ? 'current-user' : ''}
                            onClick={() => handleRowClick(entry.userId)}
                        >
                            <td>{entry.position}</td>
                            <td>
                                {entry.avatar ? (
                                    <img src={entry.avatar} alt={entry.name} className="avatar" />
                                ) : (
                                    <div className="avatar placeholder" />
                                )}
                            </td>
                            <td>{entry.name}</td>
                            <td>{entry.score}</td>
                            <td>{entry.status || '-'} {entry.level ? `Lv.${entry.level}` : ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaderboardPage;
