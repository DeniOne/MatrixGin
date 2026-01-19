import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ShiftProgress {
    employeeId: string;
    shiftDate: string;
    companiesCreated: number;
    companiesSold: number;
    activeTasks: number;
    conversion: number;
    forecastEarnings: number;
}

export interface EarningsForecast {
    employeeId: string;
    baseSalary: number;
    bonusPool: number;
    totalProjected: number;
    breakdown: {
        createdCount: number;
        soldCount: number;
        ratePerCompany: number;
        ratePerSale: number;
    };
}

export const mesApi = createApi({
    reducerPath: 'mesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/mes',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getMyShift: builder.query<ShiftProgress, void>({
            query: () => '/my-shift',
        }),
        getEarningsForecast: builder.query<EarningsForecast, void>({
            query: () => '/earnings-forecast',
        }),
    }),
});

export const { useGetMyShiftQuery, useGetEarningsForecastQuery } = mesApi;
