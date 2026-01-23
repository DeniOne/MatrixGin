import React, { useEffect, useState } from 'react';
import { useGetMyStatusQuery, useGetMyRankQuery } from '../../features/gamification/gamificationApi';
import './StatusProgressCard.css'; // Simple styling file

interface StatusLevel {
    id: string;
    name: string;
    level: number;
    requirements: any; // JSON with requirements
}

const StatusProgressCard: React.FC = () => {
    const { data: statusData, isLoading: loadingStatus, error: errorStatus } = useGetMyStatusQuery();
    const { data: rankData, isLoading: loadingRank, error: errorRank } = useGetMyRankQuery();

    const [nextLevel, setNextLevel] = useState<StatusLevel | null>(null);
    const [progressPercent, setProgressPercent] = useState<number>(0);

    useEffect(() => {
        if (statusData && statusData.status) {
            const allLevels: StatusLevel[] = [
                { id: 'PHOTON', name: 'Фотон', level: 1, requirements: { tasks: 0, mc: 0 } },
                { id: 'TOPCHIK', name: 'Топчик', level: 2, requirements: { tasks: 10, mc: 100 } },
                { id: 'KREMEN', name: 'Кремень', level: 3, requirements: { tasks: 50, mc: 500, tenure_months: 12 } },
                { id: 'CARBON', name: 'Углерод', level: 4, requirements: { tasks: 100, mc: 2000, kpi_percent: 100, tenure_months: 24 } },
                { id: 'UNIVERSE', name: 'UNIVERSE', level: 5, requirements: { tasks: 500, mc: 10000, is_founder: true } }
            ];

            const currentLevelObj = allLevels.find(l => l.id === statusData.status);
            const currentLevel = currentLevelObj ? currentLevelObj.level : 1;

            const next = allLevels.find(l => l.level > currentLevel) || null;
            setNextLevel(next);

            if (next) {
                // Simple progress calculation based on tasks and MC (could be more complex)
                const completedTasks = rankData?.tasks || 0;
                const mcBalance = rankData?.mc || 0;
                const taskProgress = Math.min((completedTasks / (next.requirements.tasks || 1)) * 100, 100);
                const mcProgress = Math.min((mcBalance / (next.requirements.mc || 1)) * 100, 100);
                const overall = Math.min((taskProgress + mcProgress) / 2, 100);
                setProgressPercent(Math.round(overall));
            } else {
                setProgressPercent(100);
            }
        }
    }, [statusData, rankData]);

    if (loadingStatus || loadingRank) return <div className="loader">Загрузка статуса...</div>;
    if (errorStatus || errorRank) return <div className="error">Ошибка загрузки статуса.</div>;

    const current = statusData?.status;
    const allLevels: StatusLevel[] = [
        { id: 'PHOTON', name: 'Фотон', level: 1, requirements: { tasks: 0, mc: 0 } },
        { id: 'TOPCHIK', name: 'Топчик', level: 2, requirements: { tasks: 10, mc: 100 } },
        { id: 'KREMEN', name: 'Кремень', level: 3, requirements: { tasks: 50, mc: 500, tenure_months: 12 } },
        { id: 'CARBON', name: 'Углерод', level: 4, requirements: { tasks: 100, mc: 2000, kpi_percent: 100, tenure_months: 24 } },
        { id: 'UNIVERSE', name: 'UNIVERSE', level: 5, requirements: { tasks: 500, mc: 10000, is_founder: true } }
    ];
    const currentLevelObj = current ? allLevels.find(l => l.id === current) : null;

    return (
        <div className="status-progress-card">
            <h2>Ваш статус геймификации</h2>
            {currentLevelObj && (
                <div className="current-status">
                    <span className="badge">{currentLevelObj.name}</span>
                    <span className="level">Level {currentLevelObj.level}</span>
                </div>
            )}
            {nextLevel ? (
                <>
                    <h3>Следующий уровень: {nextLevel.name}</h3>
                    <div className="progress-bar">
                        <div className="filled" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <p>{progressPercent}% до следующего уровня</p>
                    <ul className="requirements">
                        {Object.entries(nextLevel.requirements).map(([key, value]) => (
                            <li key={key}>{key}: {String(value)}</li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>Поздравляем! Вы достигли максимального уровня.</p>
            )}
        </div>
    );
};

export default StatusProgressCard;
