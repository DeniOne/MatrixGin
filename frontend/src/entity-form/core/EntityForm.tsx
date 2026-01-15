/**
 * EntityForm
 * 
 * Root component for registry-driven forms.
 * 
 * Usage:
 * <EntityForm
 *   entityType="person"
 *   mode="create"
 *   onSubmit={(data) => console.log(data)}
 * />
 * 
 * ✅ Entity Card is the ONLY source of truth
 * ❌ No form-per-entity
 * ❌ No switch(entityType)
 * ❌ No manual labels
 */

import React, { useEffect } from 'react';
import { Spin, Result, Alert } from 'antd';
import { EntityFormMode } from '../types/entity-card.types';
import { useEntityCard } from '../hooks/useEntityCard';
import { useEntityPermissions } from '../hooks/useEntityPermissions';
import { useEntityLifecycle } from '../hooks/useEntityLifecycle';
import { EntityFormProvider } from './FormContext';
import { FormRenderer } from './FormRenderer';
import { registerStandardFields } from '../fields';

// =============================================================================
// ENSURE FIELDS ARE REGISTERED
// =============================================================================

let fieldsRegistered = false;

const ensureFieldsRegistered = () => {
    if (!fieldsRegistered) {
        registerStandardFields();
        fieldsRegistered = true;
    }
};

// =============================================================================
// PROPS
// =============================================================================

export interface EntityFormProps {
    /** Entity type name or URN (e.g., "person" or "urn:mg:type:person") */
    entityType: string;

    /** Form mode: create, read, or update */
    mode: EntityFormMode;

    /** Initial form values (for update mode) */
    initialValues?: Record<string, unknown>;

    /** Entity ID (for update mode) */
    entityId?: string;

    /** Current FSM state (for update mode) */
    currentState?: string;

    /** Called when form is submitted successfully */
    onSubmit?: (values: Record<string, unknown>) => void;

    /** Called when cancel is clicked */
    onCancel?: () => void;

    /** Called when form values change */
    onValuesChange?: (values: Record<string, unknown>) => void;

    /** Custom submit button text */
    submitText?: string;

    /** Hide action buttons */
    hideActions?: boolean;

    /** Custom loading component */
    loadingComponent?: React.ReactNode;

    /** Custom error component */
    errorComponent?: React.ReactNode;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const EntityForm: React.FC<EntityFormProps> = ({
    entityType,
    mode,
    initialValues = {},
    entityId: _entityId,
    currentState,
    onSubmit,
    onCancel,
    onValuesChange,
    submitText,
    hideActions,
    loadingComponent,
    errorComponent,
}) => {
    // Ensure fields are registered
    useEffect(() => {
        ensureFieldsRegistered();
    }, []);

    // Load Entity Card
    const {
        card,
        isLoading: cardLoading,
        error: cardError,
        reload: reloadCard,
    } = useEntityCard(entityType);

    // Get permissions (safe to call with null card)
    const permissions = useEntityPermissions(card);

    // Get lifecycle (safe to call with null card)
    const lifecycle = useEntityLifecycle(card, currentState);

    // Loading state
    if (cardLoading) {
        return loadingComponent || (
            <div style={{ textAlign: 'center', padding: 48 }}>
                <Spin size="large" tip="Загрузка формы..." />
            </div>
        );
    }

    // Error state
    if (cardError || !card) {
        return errorComponent || (
            <Result
                status="error"
                title="Ошибка загрузки формы"
                subTitle={cardError || 'Entity Card не найден'}
                extra={
                    <button onClick={reloadCard}>
                        Повторить
                    </button>
                }
            />
        );
    }

    // Permission check
    if (!permissions.isResolved) {
        return (
            <Alert
                type="warning"
                message="Проверка прав доступа..."
                showIcon
            />
        );
    }

    // No read permission
    if (!permissions.canRead) {
        return (
            <Result
                status="403"
                title="Доступ запрещён"
                subTitle="У вас нет прав для просмотра этой сущности"
            />
        );
    }

    // No create permission in create mode
    if (mode === 'create' && !permissions.canCreate) {
        return (
            <Result
                status="403"
                title="Доступ запрещён"
                subTitle="У вас нет прав для создания этой сущности"
            />
        );
    }

    // No update permission in update mode
    if (mode === 'update' && !permissions.canUpdate) {
        return (
            <Result
                status="403"
                title="Доступ запрещён"
                subTitle="У вас нет прав для редактирования этой сущности"
            />
        );
    }

    // Render form
    return (
        <EntityFormProvider
            entityCard={card}
            mode={mode}
            permissions={permissions}
            lifecycle={lifecycle}
            initialValues={initialValues}
            onValuesChange={onValuesChange}
        >
            <FormRenderer
                onSubmit={onSubmit}
                onCancel={onCancel}
                submitText={submitText}
                hideActions={hideActions}
            />
        </EntityFormProvider>
    );
};

// =============================================================================
// RE-EXPORT USEFUL COMPONENTS
// =============================================================================

export { FormRenderer } from './FormRenderer';
export { FieldRenderer } from './FieldRenderer';
export { FieldFactory } from './FieldFactory';
export { EntityFormProvider, useEntityFormContext } from './FormContext';
