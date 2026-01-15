/**
 * FormRenderer
 * 
 * Renders all fields from Entity Card, grouped by sections.
 * Uses FormContext for all state management.
 */

import React from 'react';
import { Form, Button, Card, Divider, Space, Tag } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { EntityCardAttribute } from '../types/entity-card.types';
import { useEntityFormContext } from './FormContext';
import { FieldRenderer } from './FieldRenderer';
import { registryValidator } from '../validation/registryValidator';

// =============================================================================
// PROPS
// =============================================================================

export interface FormRendererProps {
    /** Called when form is submitted */
    onSubmit?: (values: Record<string, unknown>) => void;

    /** Called when cancel is clicked */
    onCancel?: () => void;

    /** Custom submit button text */
    submitText?: string;

    /** Hide action buttons */
    hideActions?: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Group attributes by their group property
 */
const groupAttributes = (
    attributes: EntityCardAttribute[]
): Record<string, EntityCardAttribute[]> => {
    const groups: Record<string, EntityCardAttribute[]> = {};

    for (const attr of attributes) {
        const group = attr.ui.group || 'general';
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(attr);
    }

    // Sort attributes within each group by order
    Object.values(groups).forEach(attrs => {
        attrs.sort((a, b) => a.ui.order - b.ui.order);
    });

    return groups;
};

/**
 * Format group name for display
 */
const formatGroupName = (group: string): string => {
    const groupLabels: Record<string, string> = {
        'general': 'Основная информация',
        'dates': 'Даты',
        'contacts': 'Контакты',
        'details': 'Детали',
        'settings': 'Настройки',
        'relations': 'Связи',
    };

    return groupLabels[group] ||
        group.charAt(0).toUpperCase() + group.slice(1).replace(/_/g, ' ');
};

// =============================================================================
// COMPONENT
// =============================================================================

export const FormRenderer: React.FC<FormRendererProps> = ({
    onSubmit,
    onCancel,
    submitText,
    hideActions = false,
}) => {
    const ctx = useEntityFormContext();

    const {
        entityCard,
        mode,
        values,
        isFieldVisible,
        currentState,
        isFinalState,
    } = ctx;

    // Group visible attributes
    const visibleAttributes = entityCard.attributes.filter(
        attr => isFieldVisible(attr.name)
    );
    const groups = groupAttributes(visibleAttributes);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'read') return;

        // Validate
        const validationResult = registryValidator.validate(
            entityCard,
            values,
            mode === 'create' ? 'create' : 'update'
        );

        if (!validationResult.valid) {
            // Set errors via context
            validationResult.errors.forEach(err => {
                ctx.setError(err.field, err.message);
            });
            return;
        }

        onSubmit?.(values);
    };

    // Determine button text
    const getSubmitText = () => {
        if (submitText) return submitText;
        return mode === 'create' ? 'Создать' : 'Сохранить';
    };

    return (
        <Form
            layout="vertical"
            onSubmitCapture={handleSubmit}
            className="entity-form"
        >
            {/* Header */}
            <div className="entity-form__header" style={{ marginBottom: 16 }}>
                <Space>
                    <h2 style={{ margin: 0 }}>
                        {mode === 'create' ? `Новый: ${entityCard.name}` : entityCard.name}
                    </h2>
                    {currentState && (
                        <Tag color={getStateColor(currentState)}>
                            {getStateLabel(entityCard, currentState)}
                        </Tag>
                    )}
                </Space>
                {entityCard.metadata.description && (
                    <p style={{ color: '#666', marginTop: 8 }}>
                        {entityCard.metadata.description}
                    </p>
                )}
            </div>

            {/* Field Groups */}
            {Object.entries(groups).map(([groupName, attributes]) => (
                <Card
                    key={groupName}
                    title={formatGroupName(groupName)}
                    size="small"
                    style={{ marginBottom: 16 }}
                >
                    <div className="entity-form__fields">
                        {attributes.map(attr => (
                            <FieldRenderer key={attr.name} attribute={attr} />
                        ))}
                    </div>
                </Card>
            ))}

            {/* Relations Section (if any) */}
            {entityCard.relations.length > 0 && (
                <>
                    <Divider>Связи</Divider>
                    <Card size="small" style={{ marginBottom: 16 }}>
                        {entityCard.relations
                            .filter(rel => isFieldVisible(rel.name))
                            .map(rel => {
                                // Create a pseudo-attribute for RelationField
                                const pseudoAttr: EntityCardAttribute = {
                                    name: rel.name,
                                    type: 'RELATION',
                                    required: rel.required,
                                    readonly: rel.readonly,
                                    unique: false,
                                    ui: {
                                        label: rel.ui.label,
                                        widget: 'relation',
                                        order: rel.ui.order,
                                        description: rel.ui.description,
                                    },
                                };
                                return (
                                    <FieldRenderer key={rel.name} attribute={pseudoAttr} />
                                );
                            })}
                    </Card>
                </>
            )}

            {/* Action Buttons */}
            {!hideActions && mode !== 'read' && (
                <div
                    className="entity-form__actions"
                    style={{
                        marginTop: 24,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 8
                    }}
                >
                    {onCancel && (
                        <Button
                            icon={<CloseOutlined />}
                            onClick={onCancel}
                        >
                            Отмена
                        </Button>
                    )}
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        disabled={isFinalState}
                    >
                        {getSubmitText()}
                    </Button>
                </div>
            )}

            {/* Read-only mode actions */}
            {!hideActions && mode === 'read' && onCancel && (
                <div
                    className="entity-form__actions"
                    style={{
                        marginTop: 24,
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}
                >
                    <Button onClick={onCancel}>
                        Назад
                    </Button>
                </div>
            )}
        </Form>
    );
};

// =============================================================================
// HELPERS
// =============================================================================

const getStateColor = (state: string): string => {
    const colors: Record<string, string> = {
        'draft': 'default',
        'active': 'success',
        'archived': 'error',
        'pending': 'warning',
    };
    return colors[state] || 'default';
};

const getStateLabel = (card: any, stateCode: string): string => {
    const state = card.lifecycle?.states?.find((s: any) => s.code === stateCode);
    return state?.label || stateCode;
};
