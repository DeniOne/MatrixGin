/**
 * useEntityCard Hook
 * 
 * Loads Entity Card from API with caching and error handling.
 * This is the primary hook for accessing Entity Card data.
 */

import { useState, useEffect, useCallback } from 'react';
import { EntityCard } from '../types/entity-card.types';
import { entityCardCachedApi } from '../api/entity-card.api';

// =============================================================================
// TYPES
// =============================================================================

export interface UseEntityCardResult {
    /** The loaded Entity Card (null while loading) */
    card: EntityCard | null;

    /** Whether the card is currently loading */
    isLoading: boolean;

    /** Error message if loading failed */
    error: string | null;

    /** Reload the card (invalidates cache) */
    reload: () => Promise<void>;
}

// =============================================================================
// HOOK
// =============================================================================

export const useEntityCard = (entityType: string): UseEntityCardResult => {
    const [card, setCard] = useState<EntityCard | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCard = useCallback(async (invalidateCache = false) => {
        if (!entityType) {
            setCard(null);
            setIsLoading(false);
            setError('Entity type is required');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (invalidateCache) {
                entityCardCachedApi.invalidate(entityType);
            }
            const loadedCard = await entityCardCachedApi.getCard(entityType);
            setCard(loadedCard);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load entity card';
            setError(message);
            setCard(null);
        } finally {
            setIsLoading(false);
        }
    }, [entityType]);

    useEffect(() => {
        fetchCard();
    }, [fetchCard]);

    const reload = useCallback(async () => {
        await fetchCard(true);
    }, [fetchCard]);

    return { card, isLoading, error, reload };
};
