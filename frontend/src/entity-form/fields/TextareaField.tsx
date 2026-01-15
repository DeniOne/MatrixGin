/**
 * TextareaField Component
 * 
 * Renders a multi-line text input using Ant Design.
 * Widget type: 'textarea'
 */

import React from 'react';
import { Form, Input } from 'antd';
import { FieldProps } from '../core/FieldFactory';

const { TextArea } = Input;

export const TextareaField: React.FC<FieldProps> = ({
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
            <TextArea
                value={value as string || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={attribute.ui.placeholder}
                disabled={disabled}
                rows={4}
                showCount
                maxLength={2000}
            />
        </Form.Item>
    );
};
