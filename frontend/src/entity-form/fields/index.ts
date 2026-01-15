/**
 * Fields Barrel Export
 * 
 * Exports all field components and provides auto-registration.
 */

// =============================================================================
// FIELD EXPORTS
// =============================================================================

export { TextField } from './TextField';
export { TextareaField } from './TextareaField';
export { NumberField } from './NumberField';
export { DecimalField } from './DecimalField';
export { BooleanField } from './BooleanField';
export { DateField } from './DateField';
export { DateTimeField } from './DateTimeField';
export { SelectField } from './SelectField';
export { RelationField } from './RelationField';
export { JsonField } from './JsonField';

// =============================================================================
// AUTO-REGISTRATION
// =============================================================================

import { registerAllFields, FieldComponent } from '../core/FieldFactory';
import { EntityCardWidget } from '../types/entity-card.types';

import { TextField } from './TextField';
import { TextareaField } from './TextareaField';
import { NumberField } from './NumberField';
import { DecimalField } from './DecimalField';
import { BooleanField } from './BooleanField';
import { DateField } from './DateField';
import { DateTimeField } from './DateTimeField';
import { SelectField } from './SelectField';
import { RelationField } from './RelationField';
import { JsonField } from './JsonField';

/**
 * Register all standard fields with FieldFactory.
 * Call this once during app initialization.
 */
export const registerStandardFields = (): void => {
    registerAllFields({
        'text': TextField,
        'textarea': TextareaField,
        'number': NumberField,
        'decimal': DecimalField,
        'boolean': BooleanField,
        'date': DateField,
        'datetime': DateTimeField,
        'select': SelectField,
        'relation': RelationField,
        'json': JsonField,
    });
};

/**
 * Default field components registry.
 * Can be used for direct access without FieldFactory.
 */
export const FIELD_COMPONENTS: Record<EntityCardWidget, FieldComponent> = {
    'text': TextField,
    'textarea': TextareaField,
    'number': NumberField,
    'decimal': DecimalField,
    'boolean': BooleanField,
    'date': DateField,
    'datetime': DateTimeField,
    'select': SelectField,
    'relation': RelationField,
    'json': JsonField,
};
