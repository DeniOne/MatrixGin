/**
 * MES API Client
 * 
 * Production MES & Quality module API.
 * Using native fetch instead of axios.
 */

const API_URL = '/api/mes';

const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// =============================================================================
// TYPES
// =============================================================================

export interface ProductionOrder {
    id: string;
    source_type: string;
    source_ref_id?: string;
    product_type: string;
    quantity: number;
    status: string;
    created_at: string;
    work_orders?: WorkOrder[];
    quality_checks?: QualityCheck[];
    defects?: Defect[];
}

export interface WorkOrder {
    id: string;
    operation_type: string;
    status: string;
    sequence_order: number;
    started_at?: string;
    finished_at?: string;
}

export interface QualityCheck {
    id: string;
    check_type: string;
    result: 'PASS' | 'FAIL';
    comments?: string;
    created_at: string;
}

export interface Defect {
    id: string;
    defect_type: string;
    severity: string;
    resolved: boolean;
    created_at: string;
}

// =============================================================================
// API CLIENT
// =============================================================================

export const mesApi = {
    getOrders: async (): Promise<ProductionOrder[]> => {
        const response = await fetch(`${API_URL}/production-orders`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`Failed to fetch orders: ${response.statusText}`);
        return response.json();
    },

    getOrder: async (id: string): Promise<ProductionOrder> => {
        const response = await fetch(`${API_URL}/production-orders/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(`Failed to fetch order: ${response.statusText}`);
        return response.json();
    },

    createOrder: async (data: Partial<ProductionOrder>): Promise<ProductionOrder> => {
        const response = await fetch(`${API_URL}/production-orders`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Failed to create order: ${response.statusText}`);
        return response.json();
    },

    registerCheck: async (data: Partial<QualityCheck>): Promise<QualityCheck> => {
        const response = await fetch(`${API_URL}/quality-checks`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Failed to register check: ${response.statusText}`);
        return response.json();
    },

    registerDefect: async (data: Partial<Defect>): Promise<Defect> => {
        const response = await fetch(`${API_URL}/defects`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Failed to register defect: ${response.statusText}`);
        return response.json();
    }
};
