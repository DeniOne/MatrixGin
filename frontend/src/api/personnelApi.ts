import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    PersonalFile,
    PersonnelOrder,
    LaborContract,
    PersonnelDocument,
    HRStatus,
    OrderStatus,
    ContractStatus
} from '../types/personnel.types';

// Request DTOs
interface UpdateStatusRequest {
    newStatus: HRStatus;
    reason?: string;
}

interface CreateOrderRequest {
    personalFileId: string;
    orderType: string;
    title: string;
    content: string;
    basis: string;
    orderDate: string;
    effectiveDate: string;
}

interface SignOrderRequest {
    signature: string;
}

interface CreateContractRequest {
    personalFileId: string;
    contractType: string;
    contractDate: string;
    startDate: string;
    endDate?: string;
    positionId: string;
    departmentId: string;
    salary: number;
    salaryType: string;
    workSchedule: string;
    probationDays?: number;
}

interface TerminateContractRequest {
    reason: string;
    terminationDate: string;
}

export const personnelApi = createApi({
    reducerPath: 'personnelApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/personnel',
        prepareHeaders: (headers) => {
            // Add auth token if needed
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['PersonalFile', 'Order', 'Contract', 'Document'],
    endpoints: (builder) => ({
        // ========== PersonalFiles ==========
        getPersonalFiles: builder.query<PersonalFile[], {
            status?: HRStatus;
            departmentId?: string;
            search?: string;
        }>({
            query: (params) => ({ url: '/files', params }),
            providesTags: ['PersonalFile'],
        }),

        getPersonalFileById: builder.query<PersonalFile, string>({
            query: (id) => `/files/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'PersonalFile', id }],
        }),

        // NOTE: createPersonalFile REMOVED from UI
        // PersonalFile создаётся ТОЛЬКО через event employee.hired
        // UI никогда не должен создавать PersonalFile напрямую

        updatePersonalFileStatus: builder.mutation<PersonalFile, {
            id: string;
            body: UpdateStatusRequest;
        }>({
            query: ({ id, body }) => ({
                url: `/files/${id}/status`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'PersonalFile', id },
                'PersonalFile',
            ],
        }),

        // ========== Orders ==========
        getOrders: builder.query<PersonnelOrder[], {
            personalFileId?: string;
            status?: OrderStatus;
            orderType?: string;
        }>({
            query: (params) => ({ url: '/orders', params }),
            providesTags: ['Order'],
        }),

        getOrderById: builder.query<PersonnelOrder, string>({
            query: (id) => `/orders/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Order', id }],
        }),

        createOrder: builder.mutation<PersonnelOrder, CreateOrderRequest>({
            query: (body) => ({
                url: '/orders',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Order'],
        }),

        signOrder: builder.mutation<PersonnelOrder, {
            id: string;
            body: SignOrderRequest;
        }>({
            query: ({ id, body }) => ({
                url: `/orders/${id}/sign`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Order', id },
                'Order',
            ],
        }),

        cancelOrder: builder.mutation<PersonnelOrder, {
            id: string;
            reason: string;
        }>({
            query: ({ id, reason }) => ({
                url: `/orders/${id}/cancel`,
                method: 'POST',
                body: { reason },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Order', id },
                'Order',
            ],
        }),

        // ========== Contracts ==========
        getContracts: builder.query<LaborContract[], {
            personalFileId?: string;
            status?: ContractStatus;
            contractType?: string;
        }>({
            query: (params) => ({ url: '/contracts', params }),
            providesTags: ['Contract'],
        }),

        getContractById: builder.query<LaborContract, string>({
            query: (id) => `/contracts/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Contract', id }],
        }),

        createContract: builder.mutation<LaborContract, CreateContractRequest>({
            query: (body) => ({
                url: '/contracts',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Contract'],
        }),

        terminateContract: builder.mutation<LaborContract, {
            id: string;
            body: TerminateContractRequest;
        }>({
            query: ({ id, body }) => ({
                url: `/contracts/${id}/terminate`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Contract', id },
                'Contract',
            ],
        }),

        // ========== Documents ==========
        getDocuments: builder.query<PersonnelDocument[], {
            personalFileId?: string;
            documentType?: string;
        }>({
            query: (params) => ({ url: '/documents', params }),
            providesTags: ['Document'],
        }),

        uploadDocument: builder.mutation<PersonnelDocument, FormData>({
            query: (formData) => ({
                url: '/documents',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Document'],
        }),

        deleteDocument: builder.mutation<void, string>({
            query: (id) => ({
                url: `/documents/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Document'],
        }),
    }),
});

export const {
    useGetPersonalFilesQuery,
    useGetPersonalFileByIdQuery,
    // useCreatePersonalFileMutation — REMOVED (event-only creation)
    useUpdatePersonalFileStatusMutation,
    useGetOrdersQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useSignOrderMutation,
    useCancelOrderMutation,
    useGetContractsQuery,
    useGetContractByIdQuery,
    useCreateContractMutation,
    useTerminateContractMutation,
    useGetDocumentsQuery,
    useUploadDocumentMutation,
    useDeleteDocumentMutation,
} = personnelApi;
