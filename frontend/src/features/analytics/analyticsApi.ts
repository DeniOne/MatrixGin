import { api } from '../../app/api';

export interface KpiStats {
    period: 'daily' | 'weekly' | 'monthly';
    totalTransaction: number;
    totalReward: number;
    transactionCount: number;
}

export interface DailyStats extends KpiStats {
    period: 'daily';
    date: string;
}

export interface WeeklyStats extends KpiStats {
    period: 'weekly';
    weekStart: string;
    weekEnd: string;
}

export interface MonthlyStats extends KpiStats {
    period: 'monthly';
    month: number;
    year: number;
}

export interface AnalyticsResponse {
    success: boolean;
    data: {
        daily: DailyStats;
        weekly: WeeklyStats;
        monthly: MonthlyStats;
    };
}

export const analyticsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPersonalAnalytics: builder.query<AnalyticsResponse, void>({
            query: () => '/analytics/personal',
            providesTags: ['KPI'],
        }),
        getExecutiveAnalytics: builder.query<AnalyticsResponse, void>({
            query: () => '/analytics/executive',
            providesTags: ['KPI'],
        }),
    }),
});

export const {
    useGetPersonalAnalyticsQuery,
    useGetExecutiveAnalyticsQuery,
} = analyticsApi;
