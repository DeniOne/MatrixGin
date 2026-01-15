/**
 * TextField Component
 * 
 * Renders a text input field using Ant Design.
 * Widget type: 'text'
 */

import React from 'react';
import { Form, Input } from 'antd';
import { FieldProps } from '../core/FieldFactory';

export const TextField: React.FC<FieldProps> = ({
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
            <Input
                value={value as string || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={attribute.ui.placeholder}
                disabled={disabled}
                maxLength={attribute.unique ? 255 : undefined}
            />
        </Form.Item>
    );
};
