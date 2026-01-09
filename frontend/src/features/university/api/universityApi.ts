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
    tagTypes: ['Academies', 'Courses', 'MyCourses', 'Trainers'],
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
                params,
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
            { courseId: string }
        >({
            query: ({ courseId }) => ({
                url: `/courses/${courseId}/enroll`,
                method: 'POST',
            }),
            invalidatesTags: ['MyCourses'],
        }),

        getMyCourses: builder.query<{ success: boolean; data: MyCourses }, void>({
            query: () => '/my-courses',
            providesTags: ['MyCourses'],
        }),

        completeCourse: builder.mutation<
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
            { specialty?: string; status?: string; minRating?: number } | void
        >({
            query: (params) => ({
                url: '/trainers',
                params,
            }),
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
    }),
});

export const {
    useGetAcademiesQuery,
    useGetAcademyByIdQuery,
    useGetCoursesQuery,
    useGetCourseByIdQuery,
    useEnrollInCourseMutation,
    useGetMyCoursesQuery,
    useCompleteCourseMutation,
    useGetTrainersQuery,
    useCreateTrainerMutation,
} = universityApi;
