
import { EntitySchemaDto, ImpactReport } from '../types/schema';

// Helper to get token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

// Base URL
// Assuming Vite proxy or same origin. 
const API_URL = '/api/registry';

export const registrySchemaApi = {
    getSchema: async (entityTypeUrn: string): Promise<EntitySchemaDto> => {
        const encodedUrn = encodeURIComponent(entityTypeUrn);
        const res = await fetch(`${API_URL}/schema/${encodedUrn}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error(`Failed to fetch schema: ${res.statusText}`);
        return res.json();
    },

    getEntity: async (id: string): Promise<any> => {
        const res = await fetch(`${API_URL}/entities/${id}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error(`Failed to fetch entity: ${res.statusText}`);
        return res.json();
    },

    createEntity: async (entityTypeUrn: string, data: any, graphSnapshotHash?: string): Promise<any> => {
        const headers: any = getAuthHeaders();
        if (graphSnapshotHash) {
            headers['X-Graph-Snapshot-Hash'] = graphSnapshotHash;
        }
        const res = await fetch(`${API_URL}/entities?type=${encodeURIComponent(entityTypeUrn)}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`Failed to create entity: ${res.statusText}`);
        return res.json();
    },

    updateEntity: async (id: string, data: any, graphSnapshotHash?: string): Promise<any> => {
        const headers: any = getAuthHeaders();
        if (graphSnapshotHash) {
            headers['X-Graph-Snapshot-Hash'] = graphSnapshotHash;
        }
        const res = await fetch(`${API_URL}/entities/${id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`Failed to update entity: ${res.statusText}`);
        return res.json();
    },

    previewImpact: async (targetUrn: string, changeType: string, changes: any): Promise<ImpactReport> => {
        const res = await fetch(`${API_URL}/impact/preview`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ targetUrn, changeType, changes })
        });
        if (!res.ok) throw new Error(`Failed to preview impact: ${res.statusText}`);
        return res.json();
    }
};
