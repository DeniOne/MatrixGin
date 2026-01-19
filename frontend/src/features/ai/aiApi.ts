import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export type AIRecommendationSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AIRecommendationCategory = 'risk' | 'stability' | 'optimization' | 'compliance';

export interface AIOpsRecommendation {
    id: string;
    category: AIRecommendationCategory;
    severity: AIRecommendationSeverity;
    title: string;
    reasoning: string;
    basedOn: {
        relations?: string[];
        impacts?: string[];
        nodes?: string[];
    };
    disclaimer: 'advisory-only';
    // PHASE 4.5 - Context Binding
    snapshotId?: string;
    aiVersion?: string;
    ruleSetVersion?: string;
}

export interface AIOpsResponse {
    success: boolean;
    recommendations: AIOpsRecommendation[];
    metadata: {
        analyzedAt: string;
        model: string;
        determinism: boolean;
        // PHASE 4.5 - Context Binding
        aiVersion?: string;
        ruleSetVersion?: string;
        snapshotId?: string;
    };
}

// PHASE 4.5 - AI Feedback Loop Types
export enum FeedbackType {
    HELPFUL = 'HELPFUL',
    NOT_APPLICABLE = 'NOT_APPLICABLE',
    UNSURE = 'UNSURE',
}

export interface SubmitFeedbackDto {
    recommendationId: string;
    feedbackType: FeedbackType;
    comment?: string;
    // PHASE 4.5 - Context Binding
    basedOnSnapshotId?: string;
    aiVersion?: string;
    ruleSetVersion?: string;
}

export interface FeedbackResponseDto {
    id: string;
    recommendationId: string;
    feedbackType: FeedbackType;
    timestamp: string;
    message?: string;
}

// PHASE 4.5 - Analytics Types
export interface FeedbackAnalyticsDto {
    totalFeedback: number;
    byType: {
        HELPFUL: number;
        NOT_APPLICABLE: number;
        UNSURE: number;
    };
    percentages: {
        helpful: number;
        notApplicable: number;
        unsure: number;
    };
    periodStart: string;
    periodEnd: string;
    generatedAt: string;
}

export const aiApi = createApi({
    reducerPath: 'aiApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/ai-ops`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Recommendations', 'Analytics'],
    endpoints: (builder) => ({
        analyzeEntity: builder.query<AIOpsResponse, { entityType: string; id: string }>({
            query: ({ entityType, id }) => `/${entityType}/${id}/analyze`,
            providesTags: (result, error, { entityType, id }) =>
                [{ type: 'Recommendations', id: `${entityType}-${id}` }],
        }),
        // PHASE 4.5 - Submit Feedback
        submitFeedback: builder.mutation<FeedbackResponseDto, SubmitFeedbackDto>({
            query: (body) => ({
                url: '/feedback',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Analytics'],
        }),
        // PHASE 4.5 - Get Analytics
        getAnalytics: builder.query<FeedbackAnalyticsDto, void>({
            query: () => '/feedback/analytics',
            providesTags: ['Analytics'],
        }),
    }),
});

export const { useAnalyzeEntityQuery, useSubmitFeedbackMutation, useGetAnalyticsQuery } = aiApi;

