/**
 * Registry Form FormViewRenderer
 * 
 * Renders a form based strictly on EntityCardFormDefinition.
 * Iterates through view.fields (ordered) instead of card.attributes.
 */

import React from 'react';
import { EntityCardFormDefinition, EntityCardFormField } from '../types/entity-card.types';
import { FieldRenderer } from './FieldRenderer';
import { Card, Button, Form } from 'antd';
import { useFormContext } from './FormContext';

interface FormViewRendererProps {
    viewDef: EntityCardFormDefinition;
    onSubmit: (values: any) => Promise<void>;
}

export const FormViewRenderer: React.FC<FormViewRendererProps> = ({ viewDef, onSubmit }) => {
    const { formData, setFormData, errors, submitting } = useFormContext();
    const [form] = Form.useForm();

    // Group fields by group name (if any)
    const groupedFields: Record<string, EntityCardFormField[]> = {};
    const ungroupedFields: EntityCardFormField[] = [];

    viewDef.fields.forEach(field => {
        // Skip hidden fields in UI renderer
        if (field.ui?.hidden) return;

        if (field.ui?.group) {
            if (!groupedFields[field.ui.group]) groupedFields[field.ui.group] = [];
            groupedFields[field.ui.group].push(field);
        } else {
            ungroupedFields.push(field);
        }
    });

    const handleFinish = (values: any) => {
        // We might need to merge with existing formData if this form is partial?
        // But for strict form views, we assume form values are comprehensive for the view.
        onSubmit(values);
    };

    const renderField = (fieldDef: EntityCardFormField) => {
        // Map EntityCardFormField to FieldRenderer props
        // FieldRenderer expects "field" which is the attribute definition.
        // But here we have field definition from View.
        // We need to resolve the attribute definition from the EntityCard context?
        // Actually, FieldFactory uses "widget" type. 
        // We should pass the View Field Def to FieldRenderer.

        return (
            <FieldRenderer
                key={fieldDef.field}
                field={{
                    name: fieldDef.field,
                    label: fieldDef.ui?.label || fieldDef.field,
                    required: fieldDef.required,
                    readonly: fieldDef.readonly,
                    widget: fieldDef.ui?.widget || 'text', // Fallback
                    type: fieldDef.dataType,
                    ui: fieldDef.ui as any // Cast to match expected structure if needed
                }}
            />
        );
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={formData}
            disabled={submitting}
        >
            {/* Render Ungrouped Fields */}
            {ungroupedFields.map(renderField)}

            {/* Render Grouped Fields */}
            {Object.entries(groupedFields).map(([groupName, fields]) => (
                <Card key={groupName} title={groupName} className="mb-4" size="small">
                    {fields.map(renderField)}
                </Card>
            ))}

            <div className="flex justify-end mt-4">
                <Button type="primary" htmlType="submit" loading={submitting}>
                    {viewDef.mode === 'create' ? 'Create' : 'Save'}
                </Button>
            </div>
        </Form>
    );
};
