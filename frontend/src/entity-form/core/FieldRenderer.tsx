/**
 * FieldRenderer
 * 
 * Renders a single field based on Entity Card attribute.
 * Uses FieldFactory to get the appropriate component.
 * 
 * ❌ No switch statements — uses FieldFactory!
 */

import React from 'react';
import { EntityCardAttribute } from '../types/entity-card.types';
import { FieldFactory } from './FieldFactory';
import { useEntityFormContext } from './FormContext';

// =============================================================================
// PROPS
// =============================================================================

export interface FieldRendererProps {
    /** Attribute definition from Entity Card */
    attribute: EntityCardAttribute;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const FieldRenderer: React.FC<FieldRendererProps> = ({ attribute }) => {
    const ctx = useEntityFormContext();

    const {
        values,
        errors,
        touched,
        setValue,
        setTouched,
        isFieldDisabled,
        isFieldRequired,
    } = ctx;

    // Get value and state
    const fieldName = attribute.name;
    const value = values[fieldName];
    const error = errors[fieldName];
    const isTouched = touched[fieldName] || false;
    const disabled = isFieldDisabled(fieldName);
    const required = isFieldRequired(fieldName);

    // Get field component from factory
    const FieldComponent = FieldFactory.getFieldComponent(attribute);

    // Handle change
    const handleChange = (newValue: unknown) => {
        setValue(fieldName, newValue);
    };

    // Handle blur (for touch tracking)
    const handleBlur = () => {
        setTouched(fieldName);
    };

    return (
        <div
            className="entity-field-wrapper"
            onBlur={handleBlur}
            data-field-name={fieldName}
            data-field-widget={attribute.ui.widget}
        >
            <FieldComponent
                attribute={attribute}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                error={error}
                touched={isTouched}
                required={required}
            />
        </div>
    );
};
