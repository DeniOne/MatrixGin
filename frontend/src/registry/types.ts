export type LifecycleStatus = 'draft' | 'active' | 'archived';

export interface RegistryEntity {
    id: string; // UUID
    code: string; // Immutable, unique
    name: string;
    description?: string;
    lifecycle_status: LifecycleStatus;
    created_at: string; // ISO 8601
    updated_at: string; // ISO 8601
    created_by?: string; // UUID
    updated_by?: string; // UUID
}

export interface EntityListResponse {
    data: RegistryEntity[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}

export interface EntityFilter {
    search?: string;
    status?: LifecycleStatus;
    page?: number;
    offset?: number;
    limit?: number;
}

export interface CreateEntityPayload {
    code: string;
    name: string;
    description?: string;
}

export interface UpdateEntityPayload {
    name?: string;
    description?: string;
}

export type AuditOperation = 'CREATE' | 'UPDATE_META' | 'UPDATE_LIFECYCLE';

export interface AuditRecord {
    id: string;
    entity_id: string;
    entity_type: string;
    operation: AuditOperation;
    actor_id: string;
    timestamp: string;
    details: string; // JSON string or text diff
}

export interface AuditLogResponse {
    data: AuditRecord[];
}
