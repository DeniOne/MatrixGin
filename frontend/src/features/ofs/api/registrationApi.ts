import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface RegistrationRequest {
  id: string;
  telegram_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone: string;
  birth_date?: string;
  position: string;
  location_id?: string;
  location_name?: string;
  department_id?: string;
  department_name?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'APPROVED' | 'REJECTED';
  current_step: string;
  photo_url?: string;
  passport_scan_url?: string;
  registration_address?: string;
  residential_address?: string;
  additional_documents?: any[];
  created_at: string;
  completed_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface RegistrationStats {
  by_status: Array<{ status: string; count: number }>;
  recent_registrations: Array<{ date: string; count: number }>;
}

export const registrationApi = createApi({
  reducerPath: 'registrationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/registration`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Registrations', 'Stats'],
  endpoints: (builder) => ({
    // Send invitation
    sendInvitation: builder.mutation<{ success: boolean; message: string }, {
      telegramId: string;
      departmentId: string;
      locationId: string;
    }>({
      query: (body) => ({
        url: '/invite',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Registrations'],
    }),

    // Get all registration requests
    getRegistrations: builder.query<{
      success: boolean;
      data: RegistrationRequest[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }, {
      status?: string;
      page?: number;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/requests',
        params,
      }),
      providesTags: ['Registrations'],
    }),

    // Get single registration request
    getRegistrationById: builder.query<{ success: boolean; data: RegistrationRequest }, string>({
      query: (id) => `/requests/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Registrations', id }],
    }),

    // Approve registration
    approveRegistration: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/requests/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['Registrations', 'Stats'],
    }),

    // Reject registration
    rejectRegistration: builder.mutation<{ success: boolean; message: string }, {
      id: string;
      reason: string;
    }>({
      query: ({ id, reason }) => ({
        url: `/requests/${id}/reject`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Registrations', 'Stats'],
    }),

    // Get statistics
    getStats: builder.query<{ success: boolean; data: RegistrationStats }, void>({
      query: () => '/stats',
      providesTags: ['Stats'],
    }),
  }),
});

export const {
  useSendInvitationMutation,
  useGetRegistrationsQuery,
  useGetRegistrationByIdQuery,
  useApproveRegistrationMutation,
  useRejectRegistrationMutation,
  useGetStatsQuery,
} = registrationApi;
