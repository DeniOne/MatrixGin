/**
 * DateField Component
 * 
 * Renders a date picker using Ant Design.
 * Widget type: 'date'
 */

import React from 'react';
import { Form, DatePicker } from 'antd';
import { FieldProps } from '../core/FieldFactory';
import dayjs, { Dayjs } from 'dayjs';

export const DateField: React.FC<FieldProps> = ({
    attribute,
    value,
    onChange,
    disabled,
    error,
    touched,
    required,
}) => {
    const hasError = touched && !!error;

    // Convert value to dayjs
    const dateValue = value ? dayjs(value as string) : null;

    const handleChange = (date: Dayjs | null) => {
        // Send ISO string or null
        onChange(date ? date.format('YYYY-MM-DD') : null);
    };

    return (
        <Form.Item
            label={attribute.ui.label}
            required={required}
            validateStatus={hasError ? 'error' : undefined}
            help={hasError ? error : attribute.ui.description}
            tooltip={attribute.ui.description}
        >
            <DatePicker
                value={dateValue}
                onChange={handleChange}
                placeholder={attribute.ui.placeholder || 'Выберите дату'}
                disabled={disabled}
                style={{ width: '100%' }}
                format="DD.MM.YYYY"
            />
        </Form.Item>
    );
};
