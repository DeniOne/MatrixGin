/**
 * DecimalField Component
 * 
 * Renders a decimal number input using Ant Design.
 * Widget type: 'decimal'
 */

import React from 'react';
import { Form, InputNumber } from 'antd';
import { FieldProps } from '../core/FieldFactory';

export const DecimalField: React.FC<FieldProps> = ({
    attribute,
    value,
    onChange,
    disabled,
    error,
    touched,
    required,
}) => {
    const hasError = touched && !!error;

    return (
        <Form.Item
            label={attribute.ui.label}
            required={required}
            validateStatus={hasError ? 'error' : undefined}
            help={hasError ? error : attribute.ui.description}
            tooltip={attribute.ui.description}
        >
            <InputNumber
                value={value as number | undefined}
                onChange={(val) => onChange(val)}
                placeholder={attribute.ui.placeholder}
                disabled={disabled}
                style={{ width: '100%' }}
                precision={2}
                step={0.01}
            />
        </Form.Item>
    );
};
