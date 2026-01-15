/**
 * useEntityLifecycle Hook
 * 
 * Provides FSM state information for entity forms.
 * READ-ONLY integration — no transition actions.
 */

import { useMemo } from 'react';
import { EntityCard, EntityCardState } from '../types/entity-card.types';

// =============================================================================
// TYPES
// =============================================================================

export interface LifecycleContext {
    /** Current FSM state code */
    currentState: string;

    /** Current state configuration */
    stateConfig: EntityCardState | null;

    /** Available transitions from current state */
    availableTransitions: string[];

    /** Whether the current state is final (no transitions allowed) */
    isFinalState: boolean;

    /** Whether lifecycle is active for this entity */
    hasLifecycle: boolean;

    /** Initial state for new entities */
    initialState: string;
}

// =============================================================================
// FIELD LIFECYCLE RULES
// =============================================================================

/**
 * Rules for field behavior based on lifecycle state.
 * These can be extended via Registry in the future.
 */
interface FieldLifecycleRules {
    /** Fields that become readonly in certain states */
    readonlyInStates: Record<string, string[]>;

    /** Fields that are hidden in certain states */
    hiddenInStates: Record<string, string[]>;

    /** Fields that become required in certain states */
    requiredInStates: Record<string, string[]>;
}

// Default rules — can be overridden by Registry metadata
const DEFAULT_LIFECYCLE_RULES: FieldLifecycleRules = {
    // In 'archived' state, all fields are readonly
    readonlyInStates: {
        'archived': ['*'], // '*' means all fields
    },
    hiddenInStates: {},
    requiredInStates: {},
};

// =============================================================================
// HOOK
// =============================================================================

export const useEntityLifecycle = (
    card: EntityCard | null,
    currentState?: string
): LifecycleContext => {
    return useMemo(() => {
        if (!card || !card.lifecycle) {
            return {
                currentState: 'draft',
                stateConfig: null,
                availableTransitions: [],
                isFinalState: false,
                hasLifecycle: false,
                initialState: 'draft',
            };
        }

        const lifecycle = card.lifecycle;
        const state = currentState || lifecycle.initialState;

        // Find state configuration
        const stateConfig = lifecycle.states.find(s => s.code === state) || null;

        // Get available transitions
        const availableTransitions = lifecycle.transitions[state] || [];

        // Check if final state
        const isFinalState = stateConfig?.isFinal || false;

        return {
            currentState: state,
            stateConfig,
            availableTransitions,
            isFinalState,
            hasLifecycle: true,
            initialState: lifecycle.initialState,
        };
    }, [card, currentState]);
};

// =============================================================================
// HELPER: Check if field is affected by lifecycle
// =============================================================================

export interface FieldLifecycleState {
    /** Field is readonly due to lifecycle state */
    isReadonlyByLifecycle: boolean;

    /** Field is hidden due to lifecycle state */
    isHiddenByLifecycle: boolean;

    /** Field is required due to lifecycle state */
    isRequiredByLifecycle: boolean;
}

export const useFieldLifecycleState = (
    fieldName: string,
    currentState: string,
    rules: FieldLifecycleRules = DEFAULT_LIFECYCLE_RULES
): FieldLifecycleState => {
    return useMemo(() => {
        // Check readonly
        const readonlyFields = rules.readonlyInStates[currentState] || [];
        const isReadonlyByLifecycle =
            readonlyFields.includes('*') ||
            readonlyFields.includes(fieldName);

        // Check hidden
        const hiddenFields = rules.hiddenInStates[currentState] || [];
        const isHiddenByLifecycle =
            hiddenFields.includes('*') ||
            hiddenFields.includes(fieldName);

        // Check required
        const requiredFields = rules.requiredInStates[currentState] || [];
        const isRequiredByLifecycle =
            requiredFields.includes('*') ||
            requiredFields.includes(fieldName);

        return {
            isReadonlyByLifecycle,
            isHiddenByLifecycle,
            isRequiredByLifecycle,
        };
    }, [fieldName, currentState, rules]);
};
