import { api } from '../../app/api';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
    departmentId?: string;
    mustResetPassword: boolean;
    foundationStatus?: 'NOT_STARTED' | 'IN_PROGRESS' | 'ACCEPTED';
    admissionStatus?: 'PENDING_BASE' | 'BASE_ACCEPTED' | 'PROFILE_COMPLETE' | 'ADMITTED';
}

export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, any>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        getMe: builder.query<User, void>({
            query: () => '/auth/me',
        }),
        changePassword: builder.mutation<void, any>({
            query: (passwords) => ({
                url: '/auth/change-password',
                method: 'POST',
                body: passwords,
            }),
        }),
        initTelegramLogin: builder.mutation<{ sessionId: string }, { username: string }>({
            query: (body) => ({
                url: '/auth/telegram/init',
                method: 'POST',
                body,
            }),
        }),
        verifyTelegramLogin: builder.query<LoginResponse, string>({
            query: (sessionId) => `/auth/telegram/verify/${sessionId}`,
        }),
    }),
});

export const {
    useLoginMutation,
    useGetMeQuery,
    useChangePasswordMutation,
    useInitTelegramLoginMutation,
    useLazyVerifyTelegramLoginQuery // Use lazy for polling
} = authApi;
