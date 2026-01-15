import { api } from '../../app/api';

// Enums
export enum EmployeeStatus {
    PHOTON = 'PHOTON',
    TOPCHIK = 'TOPCHIK',
    KREMEN = 'KREMEN',
    CARBON = 'CARBON',
    UNIVERSE = 'UNIVERSE'
}

export enum EmployeeRank {
    TRAINEE = 'TRAINEE',
    EMPLOYEE = 'EMPLOYEE',
    SPECIALIST = 'SPECIALIST',
    EXPERT = 'EXPERT',
    INVESTOR = 'INVESTOR',
    MAGNATE = 'MAGNATE'
}

export enum LeaderboardMetric {
    MC_BALANCE = 'MC_BALANCE',
    GMC_BALANCE = 'GMC_BALANCE',
    COMPLETED_TASKS = 'COMPLETED_TASKS',
    STATUS_LEVEL = 'STATUS_LEVEL'
}

export enum LeaderboardPeriod {
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    ALL_TIME = 'ALL_TIME'
}

export enum QuestStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ABANDONED = 'ABANDONED'
}

// Interfaces
export interface UserStatus {
    userId: string;
    status: EmployeeStatus;
    rank: EmployeeRank;
    currentGMC: number;
    nextStatusThreshold: number;
    progressPercent: number;
    privileges: string[];
}

export interface LeaderboardEntry {
    userId: string;
    name: string;
    avatar?: string;
    position: number;
    score: number;
    status?: string;
    level?: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon_url: string;
    created_at: string;
}

export interface UserAchievement {
    id: string;
    user_id: string;
    achievement_id: string;
    earned_at: string;
    achievement: Achievement;
}

export interface Quest {
    id: string;
    title: string;
    description?: string;
    icon_url?: string;
    requirements?: any;
    reward_mc: number;
    reward_gmc: number;
    is_active: boolean;
    duration_days?: number;
    created_at: string;
}

export interface QuestProgress {
    id: string;
    user_id: string;
    quest_id: string;
    progress?: any;
    status: QuestStatus;
    started_at?: string;
    completed_at?: string;
    quest: Quest;
}

export interface UserRanks {
    mc: number;
    gmc: number;
    tasks: number;
    status: number;
}

export const gamificationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Status
        getMyStatus: builder.query<UserStatus, void>({
            query: () => '/gamification/my-status',
            providesTags: ['Gamification'],
        }),
        calculateStatus: builder.mutation<any, void>({
            query: () => ({
                url: '/gamification/status/calc',
                method: 'POST',
            }),
            invalidatesTags: ['Gamification'],
        }),

        // Achievements
        getAchievements: builder.query<UserAchievement[], string | void>({
            query: (userId) => userId
                ? `/gamification/achievements/${userId}`
                : '/gamification/achievements',
            providesTags: ['Gamification'],
        }),
        getAvailableAchievements: builder.query<Achievement[], void>({
            query: () => '/gamification/achievements/available',
            providesTags: ['Gamification'],
        }),
        awardAchievement: builder.mutation<UserAchievement, { userId: string; achievementId: string }>({
            query: ({ userId, achievementId }) => ({
                url: `/gamification/achievements/${userId}/award`,
                method: 'POST',
                body: { achievementId },
            }),
            invalidatesTags: ['Gamification'],
        }),

        // Leaderboards
        getLeaderboard: builder.query<LeaderboardEntry[], { metric?: string; period?: string }>({
            query: ({ metric = 'MC_BALANCE', period = 'ALL_TIME' }) =>
                `/gamification/leaderboard/${metric}/${period}`,
            providesTags: ['Gamification'],
        }),
        getMyRank: builder.query<UserRanks, void>({
            query: () => '/gamification/my-rank',
            providesTags: ['Gamification'],
        }),

        // Quests
        getActiveQuests: builder.query<Quest[], void>({
            query: () => '/gamification/quests',
            providesTags: ['Gamification', 'Quests'] as any,
        }),
        startQuest: builder.mutation<QuestProgress, string>({
            query: (questId) => ({
                url: `/gamification/quests/${questId}/start`,
                method: 'POST',
            }),
            invalidatesTags: ['Gamification', 'Quests'] as any,
        }),
        getQuestProgress: builder.query<QuestProgress, string>({
            query: (questId) => `/gamification/quests/${questId}/progress`,
            providesTags: ['Gamification', 'Quests'] as any,
        }),
        abandonQuest: builder.mutation<QuestProgress, string>({
            query: (questId) => ({
                url: `/gamification/quests/${questId}/abandon`,
                method: 'POST',
            }),
            invalidatesTags: ['Gamification', 'Quests'] as any,
        }),
    }),
});

export const {
    useGetMyStatusQuery,
    useCalculateStatusMutation,
    useGetAchievementsQuery,
    useGetAvailableAchievementsQuery,
    useAwardAchievementMutation,
    useGetLeaderboardQuery,
    useGetMyRankQuery,
    useGetActiveQuestsQuery,
    useStartQuestMutation,
    useGetQuestProgressQuery,
    useLazyGetQuestProgressQuery,
    useAbandonQuestMutation,
} = gamificationApi;
