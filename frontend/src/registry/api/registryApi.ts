import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    RegistryEntity,
    EntityListResponse,
    EntityFilter,
    CreateEntityPayload,
    UpdateEntityPayload,
    AuditLogResponse
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

export const registryApi = createApi({
    reducerPath: 'registryApi',
    baseQuery: fetchBaseQuery({
        // Use main backend /api/registry/entities
        baseUrl: `${API_URL}/api/registry/entities`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['RegistryList', 'RegistryEntity', 'RegistryAudit'],

    endpoints: (builder) => ({
        // GET /entities?type=<type>&limit=&offset=&search=
        getEntities: builder.query<EntityListResponse, { type: string } & EntityFilter>({
            query: ({ type, limit = 50, offset = 0, search }) => ({
                url: '',
                params: { type, limit, offset, search },
            }),
            providesTags: (result, _error, { type }) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'RegistryEntity' as const, id })),
                        { type: 'RegistryList', id: type }
                    ]
                    : [{ type: 'RegistryList', id: type }],
        }),

        // GET /entities/:type/:id
        getEntity: builder.query<RegistryEntity, { type: string; id: string }>({
            query: ({ type, id }) => `/${type}/${id}`,
            providesTags: (_result, _error, { id }) => [{ type: 'RegistryEntity', id }],
        }),

        // POST /entities
        createEntity: builder.mutation<RegistryEntity, { type: string } & CreateEntityPayload>({
            query: ({ type, ...body }) => ({
                url: '',
                method: 'POST',
                body: { type, ...body },
            }),
            invalidatesTags: (_result, _error, { type }) => [{ type: 'RegistryList', id: type }],
        }),

        // PATCH /entities/:type/:id
        updateEntity: builder.mutation<RegistryEntity, { type: string; id: string } & UpdateEntityPayload>({
            query: ({ type, id, ...body }) => ({
                url: `/${type}/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'RegistryEntity', id },
                { type: 'RegistryAudit', id }
            ],
        }),

        // POST /entities/:type/:id/lifecycle
        executeTransition: builder.mutation<RegistryEntity, { type: string; id: string; action: 'activate' | 'archive' }>({
            query: ({ type, id, action }) => ({
                url: `/${type}/${id}/lifecycle`,
                method: 'POST',
                body: { action },
            }),
            invalidatesTags: (_result, _error, { type, id }) => [
                { type: 'RegistryEntity', id },
                { type: 'RegistryList', id: type },
                { type: 'RegistryAudit', id }
            ],
        }),

        // GET /entities/:type/:id/audit
        getAudit: builder.query<AuditLogResponse, { type: string; id: string }>({
            query: ({ type, id }) => `/${type}/${id}/audit`,
            providesTags: (_result, _error, { id }) => [{ type: 'RegistryAudit', id }],
        }),

    }),
});

export const {
    useGetEntitiesQuery,
    useGetEntityQuery,
    useCreateEntityMutation,
    useUpdateEntityMutation,
    useExecuteTransitionMutation,
    useGetAuditQuery,
} = registryApi;

