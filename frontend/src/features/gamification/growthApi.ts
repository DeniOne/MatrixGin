import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface GrowthPulse {
    axis: string;
    value: number;
    fullMark: number;
}

export interface AdaptationData {
    mentor: {
        id: string;
        name: string;
        avatar?: string;
        role: string;
    } | null;
    nextMeeting: {
        id: string;
        scheduledAt: string;
        managerName: string;
    } | null;
}

export interface TeamStatus {
    mentees: {
        id: string;
        first_name: string;
        last_name: string;
        avatar?: string;
        role: { name: string };
    }[];
    teamHappinessTrend: number | 'NO_DATA';
    pendingMeetings: {
        id: string;
        employeeName: string;
        scheduledAt: string;
    }[];
    sessionCount30d: number;
}

export const growthApi = createApi({
    reducerPath: 'growthApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers) => {
            // For demo purposes, we manually set user-id if not using a full auth system
            headers.set('x-user-id', localStorage.getItem('userId') || 'demo-user-id');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getGrowthPulse: builder.query<GrowthPulse[], void>({
            query: () => 'growth-matrix/pulse',
        }),
        getAdaptationStatus: builder.query<AdaptationData, void>({
            query: () => 'adaptation/my',
        }),
        getTeamStatus: builder.query<TeamStatus, void>({
            query: () => 'adaptation/team-status',
        }),
    }),
});

export const {
    useGetGrowthPulseQuery,
    useGetAdaptationStatusQuery,
    useGetTeamStatusQuery
} = growthApi;
