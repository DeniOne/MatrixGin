import React from 'react';
import { useGetAchievementsQuery, useGetAvailableAchievementsQuery } from '../../features/gamification/gamificationApi';
import './AchievementsGallery.css'; // Simple styling file

interface Achievement {
    id: string;
    name: string;
    description?: string;
    icon_url?: string;
    earned_at?: string;
}

const AchievementsGallery: React.FC = () => {
    const { data: earned, isLoading: loadingEarned, error: errorEarned } = useGetAchievementsQuery();
    const { data: available, isLoading: loadingAvailable, error: errorAvailable } = useGetAvailableAchievementsQuery();

    if (loadingEarned || loadingAvailable) return <div className="loader">Loading achievements...</div>;
    if (errorEarned || errorAvailable) return <div className="error">Failed to load achievements.</div>;

    const earnedIds = new Set((earned || []).map(ua => ua.achievement_id));

    const renderAchievement = (achievement: Achievement, unlocked: boolean) => (
        <div key={achievement.id} className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}>
            {achievement.icon_url ? (
                <img src={achievement.icon_url} alt={achievement.name} className="icon" />
            ) : (
                <div className="icon placeholder" />
            )}
            <div className="info">
                <h3>{achievement.name}</h3>
                {achievement.description && <p>{achievement.description}</p>}
                {unlocked && achievement.earned_at && (
                    <span className="earned-at">Earned: {new Date(achievement.earned_at).toLocaleDateString()}</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="achievements-gallery">
            <h2>Your Achievements</h2>
            <div className="grid">
                {(earned || []).map(ua => renderAchievement(ua.achievement, true))}
            </div>
            <h2>All Achievements</h2>
            <div className="grid">
                {(available as Achievement[]).map(a => renderAchievement(a, earnedIds.has(a.id)))}
            </div>
        </div>
    );
};

export default AchievementsGallery;
