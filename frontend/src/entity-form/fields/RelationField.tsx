/**
 * RelationField Component
 * 
 * Renders relation selector using Ant Design Select.
 * Widget type: 'relation'
 * 
 * Supports:
 * - 1:1, N:1 → single Select
 * - 1:N, M:N → multiple Select
 * 
 * Uses async search for related entities.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Select, Spin } from 'antd';
import { FieldProps } from '../core/FieldFactory';
import { useEntityFormContext } from '../core/FormContext';
import debounce from 'lodash/debounce';

// =============================================================================
// TYPES
// =============================================================================

interface RelatedEntity {
    id: string;
    urn: string;
    name: string;
}

// =============================================================================
// API HELPERS
// =============================================================================

const fetchRelatedEntities = async (
    targetEntityType: string,
    search: string
): Promise<RelatedEntity[]> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // Extract entity type from URN (e.g., "urn:mg:type:person" → "person")
    const entityType = targetEntityType.includes(':')
        ? targetEntityType.split(':').pop()
        : targetEntityType;

    try {
        const response = await fetch(
            `/api/registry/entities?type=${entityType}&search=${encodeURIComponent(search)}&limit=20`,
            { headers }
        );

        if (!response.ok) {
            console.error('Failed to fetch related entities');
            return [];
        }

        const data = await response.json();

        return (data.items || data || []).map((item: any) => ({
            id: item.id || item.urn,
            urn: item.urn,
            name: item.name || item.label || item.urn,
        }));
    } catch (error) {
        console.error('Error fetching related entities:', error);
        return [];
    }
};

// =============================================================================
// COMPONENT
// =============================================================================

export const RelationField: React.FC<FieldProps> = ({
    attribute,
    value,
    onChange,
    disabled,
    error,
    touched,
    required,
}) => {
    const ctx = useEntityFormContext();
    const hasError = touched && !!error;

    // Find relation definition
    const relation = ctx.entityCard.relations.find(r => r.name === attribute.name);

    // State for async search
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
    const [loading, setLoading] = useState(false);

    // Determine if multiple selection based on cardinality
    const isMultiple = relation?.cardinality === '1:N' || relation?.cardinality === 'M:N';

    // Debounced search
    const debouncedSearch = useCallback(
        debounce(async (search: string) => {
            if (!relation) return;

            setLoading(true);
            try {
                const entities = await fetchRelatedEntities(relation.target, search);
                setOptions(entities.map(e => ({
                    value: e.urn,
                    label: e.name,
                })));
            } finally {
                setLoading(false);
            }
        }, 300),
        [relation]
    );

    // Initial load
    useEffect(() => {
        if (relation) {
            debouncedSearch('');
        }
    }, [relation, debouncedSearch]);

    // Handle search
    const handleSearch = (search: string) => {
        debouncedSearch(search);
    };

    // Handle change
    const handleChange = (val: string | string[] | undefined) => {
        onChange(val);
    };

    if (!relation) {
        return (
            <Form.Item label={attribute.ui.label}>
                <span className="text-red-500">
                    Relation definition not found for: {attribute.name}
                </span>
            </Form.Item>
        );
    }

    return (
        <Form.Item
            label={relation.ui.label || attribute.ui.label}
            required={required || relation.required}
            validateStatus={hasError ? 'error' : undefined}
            help={hasError ? error : relation.ui.description}
            tooltip={relation.ui.description}
        >
            <Select
                mode={isMultiple ? 'multiple' : undefined}
                value={value as string | string[] | undefined}
                onChange={handleChange}
                onSearch={handleSearch}
                placeholder={`Выберите ${relation.targetName}`}
                disabled={disabled || relation.readonly}
                loading={loading}
                showSearch
                filterOption={false}
                notFoundContent={loading ? <Spin size="small" /> : 'Ничего не найдено'}
                options={options}
                allowClear={!relation.required}
                style={{ width: '100%' }}
            />
        </Form.Item>
    );
};
