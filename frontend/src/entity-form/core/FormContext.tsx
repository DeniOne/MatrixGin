/**
 * FormContext
 * 
 * Central context for Entity Forms.
 * Eliminates prop-drilling by providing all form state in one place.
 * 
 * ❌ No prop-drilling allowed — use this context!
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import {
    EntityCard,
    EntityCardAttribute,
    EntityFormMode
} from '../types/entity-card.types';
import { ResolvedPermissions } from '../hooks/useEntityPermissions';
import { LifecycleContext } from '../hooks/useEntityLifecycle';

// =============================================================================
// TYPES
// =============================================================================

export interface FieldState {
    value: unknown;
    error: string | null;
    touched: boolean;
    disabled: boolean;
    visible: boolean;
    required: boolean;
}

export interface EntityFormContextValue {
    // =========================================================================
    // Entity Card
    // =========================================================================

    /** The Entity Card defining this form */
    entityCard: EntityCard;

    // =========================================================================
    // Mode
    // =========================================================================

    /** Current form mode: create, read, or update */
    mode: EntityFormMode;

    // =========================================================================
    // Permissions (resolved for current user)
    // =========================================================================

    /** User can create entities */
    canCreate: boolean;

    /** User can read entities */
    canRead: boolean;

    /** User can update entities */
    canUpdate: boolean;

    // =========================================================================
    // Lifecycle
    // =========================================================================

    /** Current FSM state (null for create mode) */
    currentState: string | null;

    /** Available transitions from current state */
    availableTransitions: string[];

    /** Whether current state is final */
    isFinalState: boolean;

    // =========================================================================
    // Form State
    // =========================================================================

    /** Current form values */
    values: Record<string, unknown>;

    /** Validation errors by field */
    errors: Record<string, string>;

    /** Fields that have been touched */
    touched: Record<string, boolean>;

    // =========================================================================
    // Actions
    // =========================================================================

    /** Set value for a field */
    setValue: (field: string, value: unknown) => void;

    /** Set error for a field */
    setError: (field: string, error: string) => void;

    /** Clear error for a field */
    clearError: (field: string) => void;

    /** Mark field as touched */
    setTouched: (field: string) => void;

    /** Set multiple values at once */
    setValues: (values: Record<string, unknown>) => void;

    /** Reset form to initial values */
    resetForm: () => void;

    // =========================================================================
    // Helpers
    // =========================================================================

    /** Get complete state for a field */
    getFieldState: (fieldName: string) => FieldState;

    /** Check if field is disabled (readonly, permissions, lifecycle) */
    isFieldDisabled: (fieldName: string) => boolean;

    /** Check if field is visible (permissions, lifecycle) */
    isFieldVisible: (fieldName: string) => boolean;

    /** Check if field is required (attribute + lifecycle) */
    isFieldRequired: (fieldName: string) => boolean;

    /** Get attribute definition for field */
    getAttribute: (fieldName: string) => EntityCardAttribute | undefined;
}

// =============================================================================
// CONTEXT
// =============================================================================

export const EntityFormContext = createContext<EntityFormContextValue | null>(null);

// =============================================================================
// HOOK
// =============================================================================

export const useEntityFormContext = (): EntityFormContextValue => {
    const context = useContext(EntityFormContext);
    if (!context) {
        throw new Error('useEntityFormContext must be used within EntityFormProvider');
    }
    return context;
};

// =============================================================================
// PROVIDER PROPS
// =============================================================================

export interface EntityFormProviderProps {
    children: ReactNode;
    entityCard: EntityCard;
    mode: EntityFormMode;
    permissions: ResolvedPermissions;
    lifecycle: LifecycleContext;
    initialValues?: Record<string, unknown>;
    onValuesChange?: (values: Record<string, unknown>) => void;
}

// =============================================================================
// PROVIDER
// =============================================================================

export const EntityFormProvider: React.FC<EntityFormProviderProps> = ({
    children,
    entityCard,
    mode,
    permissions,
    lifecycle,
    initialValues = {},
    onValuesChange,
}) => {
    // =========================================================================
    // State
    // =========================================================================

    const [values, setValuesState] = useState<Record<string, unknown>>(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouchedState] = useState<Record<string, boolean>>({});

    // =========================================================================
    // Actions
    // =========================================================================

    const setValue = useCallback((field: string, value: unknown) => {
        setValuesState(prev => {
            const next = { ...prev, [field]: value };
            onValuesChange?.(next);
            return next;
        });
    }, [onValuesChange]);

    const setError = useCallback((field: string, error: string) => {
        setErrors(prev => ({ ...prev, [field]: error }));
    }, []);

    const clearError = useCallback((field: string) => {
        setErrors(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    const setTouched = useCallback((field: string) => {
        setTouchedState(prev => ({ ...prev, [field]: true }));
    }, []);

    const setValues = useCallback((newValues: Record<string, unknown>) => {
        setValuesState(prev => {
            const next = { ...prev, ...newValues };
            onValuesChange?.(next);
            return next;
        });
    }, [onValuesChange]);

    const resetForm = useCallback(() => {
        setValuesState(initialValues);
        setErrors({});
        setTouchedState({});
    }, [initialValues]);

    // =========================================================================
    // Helpers
    // =========================================================================

    const getAttribute = useCallback((fieldName: string): EntityCardAttribute | undefined => {
        return entityCard.attributes.find(a => a.name === fieldName);
    }, [entityCard]);

    const isFieldDisabled = useCallback((fieldName: string): boolean => {
        const attr = getAttribute(fieldName);
        if (!attr) return true;

        // Readonly from attribute
        if (attr.readonly) return true;

        // Mode check
        if (mode === 'read') return true;

        // Permission check
        if (mode === 'update' && !permissions.canUpdate) return true;
        if (mode === 'create' && !permissions.canCreate) return true;

        // Lifecycle check: final state means readonly
        if (lifecycle.isFinalState) return true;

        // Archived state makes everything readonly
        if (lifecycle.currentState === 'archived') return true;

        return false;
    }, [entityCard, mode, permissions, lifecycle, getAttribute]);

    const isFieldVisible = useCallback((fieldName: string): boolean => {
        const attr = getAttribute(fieldName);
        if (!attr) return false;

        // Must have read permission
        if (!permissions.canRead) return false;

        // Future: check lifecycle hidden rules

        return true;
    }, [permissions, getAttribute]);

    const isFieldRequired = useCallback((fieldName: string): boolean => {
        const attr = getAttribute(fieldName);
        if (!attr) return false;

        // Base required from attribute
        return attr.required;
    }, [getAttribute]);

    const getFieldState = useCallback((fieldName: string): FieldState => {
        return {
            value: values[fieldName],
            error: errors[fieldName] || null,
            touched: touched[fieldName] || false,
            disabled: isFieldDisabled(fieldName),
            visible: isFieldVisible(fieldName),
            required: isFieldRequired(fieldName),
        };
    }, [values, errors, touched, isFieldDisabled, isFieldVisible, isFieldRequired]);

    // =========================================================================
    // Context Value
    // =========================================================================

    const contextValue = useMemo<EntityFormContextValue>(() => ({
        // Entity Card
        entityCard,

        // Mode
        mode,

        // Permissions
        canCreate: permissions.canCreate,
        canRead: permissions.canRead,
        canUpdate: permissions.canUpdate,

        // Lifecycle
        currentState: lifecycle.currentState,
        availableTransitions: lifecycle.availableTransitions,
        isFinalState: lifecycle.isFinalState,

        // State
        values,
        errors,
        touched,

        // Actions
        setValue,
        setError,
        clearError,
        setTouched,
        setValues,
        resetForm,

        // Helpers
        getFieldState,
        isFieldDisabled,
        isFieldVisible,
        isFieldRequired,
        getAttribute,
    }), [
        entityCard, mode, permissions, lifecycle,
        values, errors, touched,
        setValue, setError, clearError, setTouched, setValues, resetForm,
        getFieldState, isFieldDisabled, isFieldVisible, isFieldRequired, getAttribute,
    ]);

    return (
        <EntityFormContext.Provider value={contextValue}>
            {children}
        </EntityFormContext.Provider>
    );
};
