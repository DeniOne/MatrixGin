/**
 * Entity Form Module
 * 
 * Production-Ready Registry-Driven Dynamic Form Engine
 * 
 * Usage:
 * ```tsx
 * import { EntityForm } from '@/entity-form';
 * 
 * <EntityForm
 *   entityType="person"
 *   mode="create"
 *   onSubmit={(data) => saveEntity(data)}
 * />
 * ```
 * 
 * Key principle:
 * ✅ Entity Card is the ONLY source of truth
 * ❌ No form-per-entity
 * ❌ No switch(entityType)
 * ❌ No manual labels
 */

// =============================================================================
// MAIN COMPONENTS
// =============================================================================

export * from './core/RegistryForm';
export * from './core/EntityForm'; // Keeping old one for now if used elsewhere
export { FormRenderer } from './core/FormRenderer';
export { FieldRenderer } from './core/FieldRenderer';
export { FormViewRenderer } from './core/FormViewRenderer';
export { FieldFactory, registerAllFields } from './core/FieldFactory';
export type { FieldProps, FieldComponent } from './core/FieldFactory';

// =============================================================================
// CONTEXT
// =============================================================================

export {
    EntityFormProvider,
    useEntityFormContext,
    EntityFormContext,
} from './core/FormContext';
export type {
    EntityFormContextValue,
    EntityFormProviderProps,
    FieldState,
} from './core/FormContext';

// =============================================================================
// HOOKS
// =============================================================================

export { useEntityCard } from './hooks/useEntityCard';
export type { UseEntityCardResult } from './hooks/useEntityCard';

export { useEntityPermissions, useFieldPermission } from './hooks/useEntityPermissions';
export type { ResolvedPermissions, FieldPermissionCheck } from './hooks/useEntityPermissions';

export { useEntityLifecycle, useFieldLifecycleState } from './hooks/useEntityLifecycle';
export type { LifecycleContext, FieldLifecycleState } from './hooks/useEntityLifecycle';

// =============================================================================
// TYPES
// =============================================================================

export type {
    EntityCard,
    EntityCardAttribute,
    EntityCardRelation,
    EntityCardLifecycle,
    EntityCardPermissions,
    EntityCardMetadata,
    EntityCardWidget,
    EntityCardCardinality,
    EntityCardState,
    EntityCardEnumOption,
    EntityCardResponse,
    EntityCardValidationError,
    EntityCardValidationResult,
    EntityFormMode,
} from './types/entity-card.types';

// =============================================================================
// VALIDATION
// =============================================================================

export { registryValidator } from './validation/registryValidator';
export type { ValidationResult, ValidationError } from './validation/registryValidator';

// =============================================================================
// API
// =============================================================================

export { entityCardApi, entityCardCachedApi } from './api/entity-card.api';

// =============================================================================
// FIELDS
// =============================================================================

export {
    TextField,
    TextareaField,
    NumberField,
    DecimalField,
    BooleanField,
    DateField,
    DateTimeField,
    SelectField,
    RelationField,
    JsonField,
    registerStandardFields,
    FIELD_COMPONENTS,
} from './fields';
