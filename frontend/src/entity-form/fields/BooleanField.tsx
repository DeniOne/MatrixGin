/**
 * BooleanField Component
 * 
 * Renders a checkbox/switch using Ant Design.
 * Widget type: 'boolean'
 */

import React from 'react';
import { Form, Switch } from 'antd';
import { FieldProps } from '../core/FieldFactory';

export const BooleanField: React.FC<FieldProps> = ({
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
            valuePropName="checked"
        >
            <Switch
                checked={!!value}
                onChange={(checked) => onChange(checked)}
                disabled={disabled}
                checkedChildren="Да"
                unCheckedChildren="Нет"
            />
        </Form.Item>
    );
};
