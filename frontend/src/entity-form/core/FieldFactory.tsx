/**
 * FieldFactory
 * 
 * The heart of the registry-driven form system.
 * Maps Entity Card widget types to React components.
 * 
 * ❌ No switch(entityType) — only widget-based mapping!
 * ❌ No manual labels — use attribute.ui.label!
 * ✅ Extensible via registerField()
 */

import React from 'react';
import { EntityCardAttribute, EntityCardWidget } from '../types/entity-card.types';

// =============================================================================
// FIELD PROPS
// =============================================================================

export interface FieldProps {
    /** Attribute definition from Entity Card */
    attribute: EntityCardAttribute;

    /** Current field value */
    value: unknown;

    /** Change handler */
    onChange: (value: unknown) => void;

    /** Field is disabled */
    disabled: boolean;

    /** Validation error message */
    error?: string;

    /** Field has been touched */
    touched?: boolean;

    /** Field is required */
    required?: boolean;
}

// =============================================================================
// FIELD COMPONENT TYPE
// =============================================================================

export type FieldComponent = React.FC<FieldProps>;

// =============================================================================
// FIELD REGISTRY
// =============================================================================

const fieldRegistry = new Map<EntityCardWidget, FieldComponent>();

// =============================================================================
// FACTORY API
// =============================================================================

export const FieldFactory = {
    /**
     * Register a field component for a widget type.
     * Call this once during app initialization.
     */
    registerField(widget: EntityCardWidget, component: FieldComponent): void {
        fieldRegistry.set(widget, component);
    },

    /**
     * Get field component for attribute.
     * Falls back to text field if widget is not registered.
     */
    getFieldComponent(attribute: EntityCardAttribute): FieldComponent {
        const widget = attribute.ui.widget;
        const component = fieldRegistry.get(widget);

        if (!component) {
            // Fallback to text if registered, otherwise return placeholder
            const textComponent = fieldRegistry.get('text');
            if (textComponent) {
                console.warn(
                    `[FieldFactory] No component registered for widget "${widget}", falling back to "text"`
                );
                return textComponent;
            }

            // Ultimate fallback — should not happen in production
            console.error(
                `[FieldFactory] No component registered for widget "${widget}" and no fallback available`
            );
            return PlaceholderField;
        }

        return component;
    },

    /**
     * Check if widget type is registered
     */
    hasWidget(widget: EntityCardWidget): boolean {
        return fieldRegistry.has(widget);
    },

    /**
     * Get all registered widgets
     */
    getRegisteredWidgets(): EntityCardWidget[] {
        return Array.from(fieldRegistry.keys());
    },

    /**
     * Clear all registrations (useful for testing)
     */
    clear(): void {
        fieldRegistry.clear();
    },
};

// =============================================================================
// PLACEHOLDER FIELD (fallback)
// =============================================================================

const PlaceholderField: FieldComponent = ({ attribute }) => (
    <div className= "entity-field entity-field--placeholder" >
    <span className="text-red-500" >
        [Unregistered widget: { attribute.ui.widget }]
        </span>
        </div>
);

// =============================================================================
// AUTO-REGISTRATION HELPER
// =============================================================================

/**
 * Register all field components at once.
 * Call this during app initialization.
 */
export const registerAllFields = (components: Partial<Record<EntityCardWidget, FieldComponent>>): void => {
    Object.entries(components).forEach(([widget, component]) => {
        if (component) {
            FieldFactory.registerField(widget as EntityCardWidget, component);
        }
    });
};
