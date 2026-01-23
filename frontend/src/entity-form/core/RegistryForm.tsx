/**
 * Registry Form Component (Canonical Step 9)
 * 
 * Usage:
 * <RegistryForm entityType="user_account" viewName="form.create" />
 */

import React from 'react';
import { useEntityCard } from '../../entity-form/hooks/useEntityCard';
import { RegistryFormProvider } from './FormContext';
import { useEntityPermissions } from '../hooks/useEntityPermissions';
import { useEntityLifecycle } from '../hooks/useEntityLifecycle';
import { FormViewRenderer } from './FormViewRenderer';
import { Alert, Spin } from 'antd';
import { EntityCardFormDefinition } from '../types/entity-card.types';

interface RegistryFormProps {
    entityType: string;
    viewName: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const RegistryForm: React.FC<RegistryFormProps> = ({
    entityType,
    viewName,
    onSuccess,
    onError
}) => {
    // 1. Load Entity Card
    const { card, isLoading, error } = useEntityCard(entityType);

    if (isLoading) return <Spin tip="Loading form definition..." />;
    if (error) return <Alert type="error" message={error} />;
    if (!card) return <Alert type="warning" message="Сущность не найдена" />;

    // 2. Resolve View Definition
    const viewDef = card.views[viewName];

    // 3. Validate View
    if (!viewDef) {
        return <Alert type="error" message={`View "${viewName}" not found for entity ${entityType}`} />;
    }
    if (viewDef.type !== 'form') {
        return <Alert type="error" message={`View "${viewName}" is not a form view (type: ${viewDef.type})`} />;
    }

    const formViewDef = viewDef as EntityCardFormDefinition;

    // 4. Load Contexts
    const permissions = useEntityPermissions(card);
    const lifecycle = useEntityLifecycle(card);

    // 5. Handle Submit
    const handleSubmit = async (values: any) => {
        // Construct endpoint from submit definition or conventio
        // For Step 9 MVP, we can simulate or use a generic "submit to registry" api?
        // Or reuse useEntityLifecycle?
        // Let's implement a basic generic submitter here or separate API.
        // Ideally: useFormContext or similar should handle this, but currently FormContext is mostly state.

        try {
            console.log('Submitting to Registry (Simulated):', values);
            console.log('Validating against View:', viewName);
            // In real impl: await entityApi.submitForm(entityType, viewName, values);
            if (onSuccess) onSuccess();
        } catch (err: any) {
            if (onError) onError(err.message);
        }
    };

    return (
        <RegistryFormProvider
            entityCard={card}
            mode={formViewDef.mode}
            permissions={permissions}
            lifecycle={lifecycle}
        >
            <FormViewRenderer
                viewDef={formViewDef}
                onSubmit={handleSubmit}
            />
        </RegistryFormProvider>
    );
};
