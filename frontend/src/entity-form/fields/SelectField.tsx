/**
 * SelectField Component
 * 
 * Renders a dropdown select using Ant Design.
 * Widget type: 'select'
 * 
 * Uses enum options from Entity Card attribute.
 */

import React from 'react';
import { Form, Select } from 'antd';
import { FieldProps } from '../core/FieldFactory';

export const SelectField: React.FC<FieldProps> = ({
    attribute,
    value,
    onChange,
    disabled,
    error,
    touched,
    required,
}) => {
    const hasError = touched && !!error;

    // Get enum options from attribute
    const options = attribute.enum?.map(opt => ({
        value: opt.value,
        label: opt.label,
    })) || [];

    return (
        <Form.Item
            label={attribute.ui.label}
            required={required}
            validateStatus={hasError ? 'error' : undefined}
            help={hasError ? error : attribute.ui.description}
            tooltip={attribute.ui.description}
        >
            <Select
                value={value as string | undefined}
                onChange={(val) => onChange(val)}
                placeholder={attribute.ui.placeholder || 'Выберите значение'}
                disabled={disabled}
                allowClear={!required}
                showSearch
                optionFilterProp="label"
                options={options}
            />
        </Form.Item>
    );
};
