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
    const { formData, submitting, getAttribute } = useFormContext();
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
        const attribute = getAttribute(fieldDef.field);

        if (!attribute) {
            return (
                <div key={fieldDef.field} className="text-red-500 text-xs p-2 border border-dashed border-red-300 rounded">
                    Поле "{fieldDef.field}" не найдено в карточке сущности
                </div>
            );
        }

        return (
            <FieldRenderer
                key={fieldDef.field}
                attribute={attribute}
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
