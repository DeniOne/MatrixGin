/**
 * Entity Card API Client
 * 
 * Provides access to Entity Card endpoints.
 * Uses only getCard() and validate() — getAllCards excluded from initial scope.
 */

import {
    EntityCard,
    EntityCardResponse,
    EntityCardValidationResult
} from '../types/entity-card.types';

// =============================================================================
// CONFIG
// =============================================================================

const API_BASE = '/api/entity-cards';

const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// =============================================================================
// API CLIENT
// =============================================================================

export const entityCardApi = {
    /**
     * Get Entity Card by type name or URN
     * 
     * @param entityType - Entity type name (e.g., "person") or full URN
     * @returns Entity Card with full metadata
     * @throws Error if entity not found
     */
    async getCard(entityType: string): Promise<EntityCard> {
        const encodedType = encodeURIComponent(entityType);
        const response = await fetch(`${API_BASE}/${encodedType}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Entity card not found: ${entityType}`);
            }
            throw new Error(`Failed to fetch entity card: ${response.statusText}`);
        }

        const data: EntityCardResponse = await response.json();
        return data.card;
    },

    /**
     * Validate data against Entity Card
     * 
     * @param entityType - Entity type name or URN
     * @param data - Data to validate
     * @param operation - 'create' or 'update'
     * @param existingData - Existing entity data (for update validation)
     * @returns Validation result with errors if any
     */
    async validate(
        entityType: string,
        data: Record<string, unknown>,
        operation: 'create' | 'update',
        existingData?: Record<string, unknown>
    ): Promise<EntityCardValidationResult> {
        const encodedType = encodeURIComponent(entityType);
        const response = await fetch(`${API_BASE}/${encodedType}/validate`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                operation,
                data,
                existingData
            }),
        });

        if (!response.ok) {
            throw new Error(`Validation request failed: ${response.statusText}`);
        }

        return response.json();
    },
};

// =============================================================================
// CACHE HELPERS (simple in-memory)
// =============================================================================

const cardCache = new Map<string, { card: EntityCard; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const entityCardCachedApi = {
    /**
     * Get Entity Card with caching
     */
    async getCard(entityType: string): Promise<EntityCard> {
        const cached = cardCache.get(entityType);
        const now = Date.now();

        if (cached && (now - cached.timestamp) < CACHE_TTL_MS) {
            return cached.card;
        }

        const card = await entityCardApi.getCard(entityType);
        cardCache.set(entityType, { card, timestamp: now });
        return card;
    },

    /**
     * Invalidate cache for entity type
     */
    invalidate(entityType: string): void {
        cardCache.delete(entityType);
    },

    /**
     * Clear entire cache
     */
    clearCache(): void {
        cardCache.clear();
    },
};
