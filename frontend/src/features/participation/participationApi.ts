import { api } from '../../app/api';
import {
    UserParticipationStatus,
    UserParticipationRank,
    StatusHistoryEntry,
    ParticipationStatus,
    AssignStatusRequest
} from '../../types/participation';

export const participationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUserStatus: builder.query<UserParticipationStatus, string>({
            query: (userId) => `/status/user/${userId}`,
            providesTags: (_result, _error, userId) => [{ type: 'Participation', id: `Status-${userId}` }],
        }),
        getUserRank: builder.query<UserParticipationRank, string>({
            query: (userId) => `/rank/user/${userId}`,
            providesTags: (_result, _error, userId) => [{ type: 'Participation', id: `Rank-${userId}` }],
        }),
        getStatusHistory: builder.query<StatusHistoryEntry[], string>({
            query: (userId) => `/status/history/${userId}`,
            providesTags: (_result, _error, userId) => [{ type: 'Participation', id: `History-${userId}` }],
        }),
        getAllStatuses: builder.query<ParticipationStatus[], void>({
            query: () => '/status/all',
            providesTags: ['Participation'],
        }),
        getUsersWithStatuses: builder.query<any[], void>({
            query: () => '/status/users',
            providesTags: ['Participation'],
        }),
        assignStatus: builder.mutation<UserParticipationStatus, AssignStatusRequest>({
            query: (data) => ({
                url: '/status/assign',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _error, { userId }) => [
                { type: 'Participation', id: `Status-${userId}` },
                { type: 'Participation', id: `History-${userId}` },
                'Participation'
            ],
        }),
    }),
});

export const {
    useGetUserStatusQuery,
    useGetUserRankQuery,
    useGetStatusHistoryQuery,
    useGetAllStatusesQuery,
    useGetUsersWithStatusesQuery,
    useAssignStatusMutation,
} = participationApi;
