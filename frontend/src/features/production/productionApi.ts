/**
 * Production API
 * 
 * RTK Query endpoints for production data.
 * Read-only, no mutations.
 */

import { api } from '../../app/api';

export type SlaLevel = 'OK' | 'WARNING' | 'BREACH';

export interface ProductionSession {
    id: string;
    status: string;
    role: string;
    assignedUser?: string;
    timeInStatusSec: number;
    slaLevel: SlaLevel;
    createdAt: string;
    lastEventAt: string;
}

export interface ProductionSessionsResponse {
    data: ProductionSession[];
    total: number;
}

export const productionApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProductionSessions: builder.query<ProductionSessionsResponse, void>({
            query: () => '/production/sessions',
            providesTags: ['ProductionSession'],
        }),
    }),
});

export const { useGetProductionSessionsQuery } = productionApi;
