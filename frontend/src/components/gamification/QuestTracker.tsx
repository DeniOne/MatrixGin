import React, { useEffect, useState } from 'react';
import { useGetActiveQuestsQuery, useStartQuestMutation, useGetQuestProgressQuery, useAbandonQuestMutation } from '../../features/gamification/gamificationApi';
import './QuestTracker.css'; // Simple styling

interface Quest {
    id: string;
    title: string;
    description?: string;
    icon_url?: string;
    reward_mc?: number;
    reward_gmc?: number;
    is_active: boolean;
}

interface QuestProgress {
    id: string;
    quest_id: string;
    status: string;
    progress?: any;
    started_at?: string;
    completed_at?: string;
}

const QuestTracker: React.FC = () => {
    const { data: quests, isLoading: loadingQuests, error: errorQuests } = useGetActiveQuestsQuery();
    const [startQuest] = useStartQuestMutation();
    const [abandonQuest] = useAbandonQuestMutation();
    const { data: progressData, refetch: refetchProgress } = useGetQuestProgressQuery(undefined, { skip: true });

    const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
    const [progress, setProgress] = useState<QuestProgress | null>(null);

    const handleStart = async (questId: string) => {
        await startQuest({ questId });
        setActiveQuestId(questId);
        // Fetch progress after starting
        const result = await refetchProgress({ questId, userId: '' }); // TODO: replace userId with auth context
        setProgress(result.data as QuestProgress);
    };

    const handleAbandon = async (questId: string) => {
        await abandonQuest({ questId });
        if (activeQuestId === questId) {
            setActiveQuestId(null);
            setProgress(null);
        }
    };

    if (loadingQuests) return <div className="loader">Loading quests...</div>;
    if (errorQuests) return <div className="error">Failed to load quests.</div>;

    const questList: Quest[] = (quests as any) || [];

    return (
        <div className="quest-tracker">
            <h2>Active Quests</h2>
            <div className="quest-list">
                {questList.map(q => (
                    <div key={q.id} className="quest-card">
                        {q.icon_url ? <img src={q.icon_url} alt={q.title} className="icon" /> : <div className="icon placeholder" />}
                        <div className="details">
                            <h3>{q.title}</h3>
                            {q.description && <p>{q.description}</p>}
                            <p className="rewards">
                                Rewards: {q.reward_mc || 0} MC, {q.reward_gmc || 0} GMC
                            </p>
                        </div>
                        {activeQuestId === q.id && progress ? (
                            <div className="progress-section">
                                <p>Status: {progress.status}</p>
                                {/* Here you could render detailed progress JSON */}
                                <button onClick={() => handleAbandon(q.id)} className="abandon-btn">Abandon</button>
                            </div>
                        ) : (
                            <button onClick={() => handleStart(q.id)} className="start-btn">Start Quest</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestTracker;
