/**
 * Entity Table Types
 * 
 * Re-exporting types from entity-form to ensure consistency.
 * Valid as long as entity-form types are the single source of truth for EntityCard.
 */

export * from '../../entity-form/types/entity-card.types';

export interface TableApiParams {
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface TableApiResponse<T = any> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}
