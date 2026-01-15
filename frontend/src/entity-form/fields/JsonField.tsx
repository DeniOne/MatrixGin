/**
 * JsonField Component
 * 
 * Renders a JSON editor using Ant Design TextArea.
 * Widget type: 'json'
 * 
 * Includes JSON validation.
 */

import React, { useState, useEffect } from 'react';
import { Form, Input, Alert } from 'antd';
import { FieldProps } from '../core/FieldFactory';

const { TextArea } = Input;

export const JsonField: React.FC<FieldProps> = ({
    attribute,
    value,
    onChange,
    disabled,
    error,
    touched,
    required,
}) => {
    const hasError = touched && !!error;

    // Local state for text editing
    const [textValue, setTextValue] = useState<string>('');
    const [parseError, setParseError] = useState<string | null>(null);

    // Sync from props to local state
    useEffect(() => {
        if (value === null || value === undefined) {
            setTextValue('');
        } else if (typeof value === 'string') {
            setTextValue(value);
        } else {
            try {
                setTextValue(JSON.stringify(value, null, 2));
            } catch {
                setTextValue('');
            }
        }
    }, [value]);

    // Handle text change
    const handleChange = (text: string) => {
        setTextValue(text);

        if (text.trim() === '') {
            setParseError(null);
            onChange(null);
            return;
        }

        try {
            const parsed = JSON.parse(text);
            setParseError(null);
            onChange(parsed);
        } catch (e) {
            setParseError('Некорректный JSON');
            // Don't update parent value on parse error
        }
    };

    const displayError = hasError ? error : parseError;

    return (
        <Form.Item
            label={attribute.ui.label}
            required={required}
            validateStatus={displayError ? 'error' : undefined}
            help={displayError || attribute.ui.description}
            tooltip={attribute.ui.description}
        >
            <TextArea
                value={textValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={attribute.ui.placeholder || '{"key": "value"}'}
                disabled={disabled}
                rows={6}
                style={{ fontFamily: 'monospace' }}
            />
            {parseError && (
                <Alert
                    message={parseError}
                    type="error"
                    showIcon
                    style={{ marginTop: 8 }}
                />
            )}
        </Form.Item>
    );
};
