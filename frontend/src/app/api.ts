import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            // ARCHITECT OVERRIDE: Superuser Header
            const devRole = localStorage.getItem('emulatedRole') || 'SUPERUSER';
            if (devRole === 'SUPERUSER') {
                headers.set('X-Matrix-Dev-Role', 'SUPERUSER');
            }

            return headers;
        },
    }),
    endpoints: () => ({}),
    tagTypes: ['User', 'Task', 'Department', 'KPI', 'Transaction', 'Auth', 'Wallet', 'Gamification', 'ProductionSession', 'StoreItem', 'Participation'],
});
