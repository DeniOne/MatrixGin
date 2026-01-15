/**
 * Registry Entity API
 * 
 * Using native fetch instead of axios for consistency.
 */

const API_URL = '/api/registry';

const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const registryEntityApi = {
    getOne: async (urn: string) => {
        const response = await fetch(`${API_URL}/entities/${encodeURIComponent(urn)}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch entity: ${response.statusText}`);
        }

        return response.json();
    }
};
