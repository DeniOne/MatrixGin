/**
 * University API - RTK Query
 * API endpoints для модуля Corporate University
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types
export interface Academy {
    id: string;
    name: string;
    description?: string;
    iconUrl?: string;
    isActive: boolean;
    coursesCount: number;
    skillsCount: number;
}

export interface Course {
    id: string;
    title: string;
    description?: string;
    academyId?: string;
    academyName?: string;
    requiredGrade?: string;
    rewardMC: number;
    rewardGMC: number;
    isMandatory: boolean;
    isActive: boolean;
    modulesCount?: number;
    totalDuration?: number;
}

export interface Enrollment {
    id: string;
    userId: string;
    courseId: string;
    courseTitle?: string;
    academyName?: string;
    progress: number;
    status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
    enrolledAt: string;
    completedAt?: string;
}

export interface Trainer {
    id: string;
    userId: string;
    userName?: string;
    specialty: 'PHOTOGRAPHER' | 'SALES' | 'DESIGNER';
    status: 'CANDIDATE' | 'TRAINER' | 'ACCREDITED' | 'SENIOR' | 'METHODOLOGIST';
    rating?: number;
    accreditationDate?: string;
    statistics: {
        traineesTotal: number;
        traineesSuccessful: number;
        avgNPS?: number;
    };
}

export interface MyCourses {
    active: Enrollment[];
    completed: Enrollment[];
    abandoned: Enrollment[];
}

export interface QuizOption {
    id: string;
    text: string;
}

export interface QuizQuestion {
    id: string;
    text: string;
    type: 'SINGLE' | 'MULTIPLE';
    order: number;
    options: QuizOption[];
}

export interface Quiz {
    id: string;
    title: string;
    description?: string;
    mode: 'OPTIONAL' | 'REQUIRED' | 'DIAGNOSTIC';
    pass_score: number;
    questions: QuizQuestion[];
}

export interface TrainerAccreditation {
    id: string;
    level: string;
    weight: number;
    grantedAt: string;
    expiresAt?: string;
    grantedBy: string;
    isActive: boolean;
}

export interface MentorshipPeriod {
    id: string;
    trainerId: string;
    traineeId: string;
    status: 'PROBATION' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
    startAt: string;
    expectedEndAt: string;
    finishedAt?: string;
    plan?: any;
}

export interface TrainerDashboard {
    trainerId: string;
    status: string;
    currentAccreditation?: TrainerAccreditation;
    rating: number;
    stats: {
        traineesTotal: number;
        traineesSuccessful: number;
        avgNPS: number;
    };
    activeMentorships: MentorshipPeriod[];
    history: MentorshipPeriod[];
}

export interface QuizAttemptResult {
    attemptId: string;
    score: number;
    passed: boolean;
    mode: string;
}

export interface AntiFraudSignal {
    id: string;
    entity_id: string;
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    type: string;
    detected_at: string;
    context: {
        signals: string[];
        confidenceScore: number;
        eventId: string;
        metadata?: any;
        resolved?: boolean;
        resolvedBy?: string;
        resolvedAt?: string;
        comment?: string;
    };
}

export interface UniversityAnalytics {
    infrastructure: {
        academies: number;
        courses: number;
    };
    learning: {
        totalEnrollments: number;
        completedEnrollments: number;
        completionRate: number;
    };
    mentorship: {
        activePeriods: number;
    };
    security: {
        activeSignals: number;
    };
    timestamp: string;
}

export const universityApi = createApi({
    reducerPath: 'universityApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/university`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Academies', 'Courses', 'MyCourses', 'Trainers', 'Security', 'Analytics'],
    endpoints: (builder) => ({
        // Академии
        getAcademies: builder.query<{ success: boolean; data: Academy[] }, void>({
            query: () => '/academies',
            providesTags: ['Academies'],
        }),

        getAcademyById: builder.query<{ success: boolean; data: Academy }, string>({
            query: (id) => `/academies/${id}`,
            providesTags: ['Academies'],
        }),

        // Курсы
        getCourses: builder.query<
            { success: boolean; data: Course[] },
            { academyId?: string; requiredGrade?: string; isMandatory?: boolean } | void
        >({
            query: (params) => ({
                url: '/courses',
                params: params || {},
            }),
            providesTags: ['Courses'],
        }),

        getCourseById: builder.query<{ success: boolean; data: Course }, string>({
            query: (id) => `/courses/${id}`,
            providesTags: ['Courses'],
        }),

        // Enrollment
        enrollInCourse: builder.mutation<
            { success: boolean; data: any },
            { courseId: string; assignedBy?: string }
        >({
            query: (data) => ({
                url: '/enrollments',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['MyCourses', 'Courses'],
        }),

        getAvailableCourses: builder.query<{ success: boolean; data: Course[] }, void>({
            query: () => '/courses/available',
            providesTags: ['Courses'],
        }),

        getMyCourses: builder.query<{ success: boolean; data: MyCourses }, void>({
            query: () => '/enrollments/my',
            providesTags: ['MyCourses'],
        }),

        getEnrollmentById: builder.query<{ success: boolean; data: any }, string>({
            query: (id) => `/enrollments/${id}`,
            providesTags: ['MyCourses'],
        }),

        withdrawFromCourse: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/enrollments/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['MyCourses', 'Courses'],
        }),

        updateModuleProgress: builder.mutation<
            { success: boolean; data: any },
            { enrollmentId: string; moduleId: string; status: string; score?: number }
        >({
            query: ({ enrollmentId, ...body }) => ({
                url: `/enrollments/${enrollmentId}/progress`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['MyCourses'],
        }),

        completeCourseLink: builder.mutation<
            { success: boolean; data: any },
            { courseId: string }
        >({
            query: ({ courseId }) => ({
                url: `/courses/${courseId}/complete`,
                method: 'POST',
            }),
            invalidatesTags: ['MyCourses'],
        }),

        // Trainers
        getTrainers: builder.query<
            { success: boolean; data: Trainer[] },
            { specialty?: string; status?: string } | void
        >({
            query: (params) => ({
                url: '/trainers',
                params: params || {},
            }),
            providesTags: ['Trainers'],
        }),

        getTrainerDashboard: builder.query<{ success: boolean; data: TrainerDashboard }, void>({
            query: () => '/trainers/dashboard',
            providesTags: ['Trainers'],
        }),

        createTrainer: builder.mutation<
            { success: boolean; data: Trainer },
            { specialty: 'PHOTOGRAPHER' | 'SALES' | 'DESIGNER' }
        >({
            query: (data) => ({
                url: '/trainers',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Trainers'],
        }),

        grantAccreditation: builder.mutation<
            { success: boolean; data: TrainerAccreditation },
            { trainerId: string; level: string; weight: number; expiresAt?: string }
        >({
            query: ({ trainerId, ...body }) => ({
                url: `/trainers/${trainerId}/accredit`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Trainers'],
        }),

        // Mentorship
        startMentorship: builder.mutation<
            { success: boolean; data: MentorshipPeriod },
            { trainerId: string; traineeId: string; plan?: any }
        >({
            query: (body) => ({
                url: '/trainers/mentorship',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Trainers'],
        }),

        completeMentorship: builder.mutation<
            { success: boolean; data: any },
            { periodId: string; status: 'COMPLETED' | 'FAILED'; notes: string; metrics: any }
        >({
            query: ({ periodId, ...body }) => ({
                url: `/trainers/mentorship/${periodId}/complete`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Trainers'],
        }),

        // Quizzes
        getQuiz: builder.query<{ success: boolean; data: Quiz }, string>({
            query: (materialId) => `/quizzes/${materialId}`,
        }),

        submitQuizAttempt: builder.mutation<
            { success: boolean; data: QuizAttemptResult },
            { quizId: string; enrollmentId?: string; answers: { questionId: string; selectedOptions: string[] }[] }
        >({
            query: ({ quizId, ...body }) => ({
                url: `/quizzes/${quizId}/submit`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['MyCourses'],
        }),

        // Security & Anti-Fraud
        getSecuritySignals: builder.query<{ success: boolean; data: AntiFraudSignal[] }, void>({
            query: () => '/security/signals',
            providesTags: ['Security'],
        }),

        validateSignal: builder.mutation<
            { success: boolean; data: AntiFraudSignal },
            { id: string; comment: string }
        >({
            query: ({ id, ...body }) => ({
                url: `/security/signals/${id}/validate`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Security'],
        }),

        invalidateCertification: builder.mutation<
            { success: boolean; data: any },
            { id: string; reason: string; evidenceLinks?: string[] }
        >({
            query: ({ id, ...body }) => ({
                url: `/security/certifications/${id}/invalidate`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['MyCourses', 'Security'],
        }),

        // Analytics
        getAnalyticsOverview: builder.query<{ success: boolean; data: UniversityAnalytics }, void>({
            query: () => '/analytics/overview',
            providesTags: ['Analytics'],
        }),
    }),
});

export const {
    useGetAcademiesQuery,
    useGetAcademyByIdQuery,
    useGetCoursesQuery,
    useGetCourseByIdQuery,
    useGetAvailableCoursesQuery,
    useEnrollInCourseMutation,
    useGetMyCoursesQuery,
    useGetEnrollmentByIdQuery,
    useWithdrawFromCourseMutation,
    useUpdateModuleProgressMutation,
    useCompleteCourseLinkMutation,
    useGetTrainersQuery,
    useGetTrainerDashboardQuery,
    useCreateTrainerMutation,
    useGrantAccreditationMutation,
    useStartMentorshipMutation,
    useCompleteMentorshipMutation,
    useGetQuizQuery,
    useSubmitQuizAttemptMutation,
    useGetSecuritySignalsQuery,
    useValidateSignalMutation,
    useInvalidateCertificationMutation,
    useGetAnalyticsOverviewQuery,
} = universityApi;
