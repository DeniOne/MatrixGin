/**
 * Table API Client
 * 
 * Strict Registry-Driven API for fetching tabular data.
 * Contract:
 * - Must provide viewName (namespaced)
 * - Sorting must be allowed by Registry
 */

import { TableApiParams, TableApiResponse } from '../types';

const API_URL = '/api/registry-table';

const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const tableApi = {
    /**
     * Fetch entity list for a specific view
     */
    fetchTable: async (
        entityType: string,
        viewName: string,
        params: TableApiParams = {}
    ): Promise<TableApiResponse> => {
        // Build query string
        const queryParams = new URLSearchParams({
            view: viewName,
            page: (params.page || 1).toString(),
            pageSize: (params.pageSize || 10).toString(),
        });

        if (params.sortField) {
            queryParams.append('sortField', params.sortField);
            if (params.sortOrder) {
                queryParams.append('sortOrder', params.sortOrder);
            }
        }

        const url = `${API_URL}/${entityType}?${queryParams.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch table data: ${response.statusText}`);
        }

        return response.json();
    }
};
