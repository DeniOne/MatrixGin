/**
 * Registry Validator
 * 
 * Validates form data against Entity Card rules.
 * ❌ No Yup/Zod as source of truth — Entity Card only!
 * ✅ Uses Entity Card for all validation rules
 */

import {
    EntityCard,
    EntityCardAttribute
} from '../types/entity-card.types';

// =============================================================================
// TYPES
// =============================================================================

export interface ValidationError {
    /** Field name */
    field: string;

    /** Rule that failed */
    rule: 'required' | 'type' | 'enum' | 'unique' | 'cardinality' | 'custom';

    /** Human-readable error message */
    message: string;

    /** The invalid value */
    value?: unknown;
}

export interface ValidationResult {
    /** Whether validation passed */
    valid: boolean;

    /** List of validation errors */
    errors: ValidationError[];
}

// =============================================================================
// TYPE VALIDATORS
// =============================================================================

const validateType = (
    attr: EntityCardAttribute,
    value: unknown
): string | null => {
    if (value === null || value === undefined || value === '') {
        return null; // Empty values are handled by required check
    }

    switch (attr.type) {
        case 'STRING':
            if (typeof value !== 'string') {
                return `Поле "${attr.ui.label}" должно быть текстом`;
            }
            break;

        case 'INTEGER':
            if (typeof value !== 'number' || !Number.isInteger(value)) {
                return `Поле "${attr.ui.label}" должно быть целым числом`;
            }
            break;

        case 'DECIMAL':
            if (typeof value !== 'number') {
                return `Поле "${attr.ui.label}" должно быть числом`;
            }
            break;

        case 'BOOLEAN':
            if (typeof value !== 'boolean') {
                return `Поле "${attr.ui.label}" должно быть да/нет`;
            }
            break;

        case 'DATE':
        case 'DATETIME':
            if (typeof value !== 'string' || isNaN(Date.parse(value))) {
                return `Поле "${attr.ui.label}" должно быть датой`;
            }
            break;

        case 'JSON':
            if (typeof value === 'string') {
                try {
                    JSON.parse(value);
                } catch {
                    return `Поле "${attr.ui.label}" должно быть валидным JSON`;
                }
            }
            break;
    }

    return null;
};

// =============================================================================
// MAIN VALIDATOR
// =============================================================================

export const registryValidator = {
    /**
     * Validate form values against Entity Card
     */
    validate(
        card: EntityCard,
        values: Record<string, unknown>,
        mode: 'create' | 'update'
    ): ValidationResult {
        const errors: ValidationError[] = [];

        // Validate attributes
        for (const attr of card.attributes) {
            const fieldName = attr.name;
            const value = values[fieldName];

            // Skip readonly fields in update mode
            if (mode === 'update' && attr.readonly) {
                continue;
            }

            // Required check
            if (attr.required) {
                const isEmpty =
                    value === null ||
                    value === undefined ||
                    value === '' ||
                    (Array.isArray(value) && value.length === 0);

                if (isEmpty) {
                    errors.push({
                        field: fieldName,
                        rule: 'required',
                        message: `Поле "${attr.ui.label}" обязательно для заполнения`,
                        value,
                    });
                    continue; // Skip other validations if required failed
                }
            }

            // Type check (only if value exists)
            if (value !== null && value !== undefined && value !== '') {
                const typeError = validateType(attr, value);
                if (typeError) {
                    errors.push({
                        field: fieldName,
                        rule: 'type',
                        message: typeError,
                        value,
                    });
                }
            }

            // Enum check
            if (attr.enum && value) {
                const validValues = attr.enum.map(opt => opt.value);
                if (!validValues.includes(value as string)) {
                    errors.push({
                        field: fieldName,
                        rule: 'enum',
                        message: `Недопустимое значение для поля "${attr.ui.label}"`,
                        value,
                    });
                }
            }
        }

        // Validate relations
        for (const rel of card.relations) {
            const value = values[rel.name];

            // Skip readonly relations in update mode
            if (mode === 'update' && rel.readonly) {
                continue;
            }

            // Required check
            if (rel.required) {
                const isEmpty =
                    value === null ||
                    value === undefined ||
                    (Array.isArray(value) && value.length === 0);

                if (isEmpty) {
                    errors.push({
                        field: rel.name,
                        rule: 'required',
                        message: `Связь "${rel.ui.label}" обязательна`,
                        value,
                    });
                }
            }

            // Cardinality check
            if (value) {
                const isMultiple = rel.cardinality === '1:N' || rel.cardinality === 'M:N';
                const isSingle = rel.cardinality === '1:1' || rel.cardinality === 'N:1';

                if (isSingle && Array.isArray(value) && value.length > 1) {
                    errors.push({
                        field: rel.name,
                        rule: 'cardinality',
                        message: `Связь "${rel.ui.label}" может иметь только одно значение`,
                        value,
                    });
                }

                if (isMultiple && !Array.isArray(value) && value !== null) {
                    // Single value is okay for multi, will be converted
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    },

    /**
     * Validate a single field
     */
    validateField(
        card: EntityCard,
        fieldName: string,
        value: unknown,
        mode: 'create' | 'update'
    ): ValidationError | null {
        const result = this.validate(
            card,
            { [fieldName]: value },
            mode
        );

        return result.errors.find(e => e.field === fieldName) || null;
    },

    /**
     * Get all required field names
     */
    getRequiredFields(card: EntityCard): string[] {
        const requiredAttrs = card.attributes
            .filter(a => a.required)
            .map(a => a.name);

        const requiredRels = card.relations
            .filter(r => r.required)
            .map(r => r.name);

        return [...requiredAttrs, ...requiredRels];
    },
};
