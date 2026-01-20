/**
 * useEntityTable Hook
 * 
 * Manages state for Registry-Driven Tables.
 * Handles:
 * - Fetching EntityCard (to get view definition)
 * - Fetching Data (via tableApi)
 * - Pagination & Sorting
 */

import { useState, useEffect, useCallback } from 'react';
import { useEntityCard } from '../../entity-form/hooks/useEntityCard';
import { tableApi } from '../api/table.api';
import { TableApiParams, EntityCardTableDefinition } from '../types';

interface UseEntityTableProps {
    entityType: string;
    viewName: string;
}

export const useEntityTable = ({ entityType, viewName }: UseEntityTableProps) => {
    // 1. Get Entity Card for Definition
    const {
        card: entityCard,
        isLoading: loadingCard,
        error: errorCard
    } = useEntityCard(entityType);

    // 2. Table State
    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loadingData, setLoadingData] = useState(false);
    const [errorData, setErrorData] = useState<string | null>(null);

    const [params, setParams] = useState<TableApiParams>({
        page: 1,
        pageSize: 10,
        sortField: undefined,
        sortOrder: undefined
    });

    // 3. Resolve View Definition
    const viewDef: EntityCardTableDefinition | undefined = entityCard?.views?.[viewName] as any;

    // 4. Set Defaults from Registry (Initial Load Only)
    useEffect(() => {
        if (viewDef?.defaultSort && !params.sortField) {
            setParams(prev => ({
                ...prev,
                sortField: viewDef.defaultSort?.field,
                sortOrder: viewDef.defaultSort?.order,
                pageSize: viewDef.pageSize || 10
            }));
        }
    }, [viewDef]);

    // 5. Fetch Data
    const fetchData = useCallback(async () => {
        if (!viewDef) return;

        setLoadingData(true);
        setErrorData(null);
        try {
            const response = await tableApi.fetchTable(entityType, viewName, params);
            setData(response.items);
            setTotal(response.total);
        } catch (err: any) {
            setErrorData(err.message || 'Failed to fetch table data');
        } finally {
            setLoadingData(false);
        }
    }, [entityType, viewName, params, viewDef]);

    // Trigger fetch when params or definition changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 6. Handlers
    const handleTableChange = (pagination: any, _filters: any, sorter: any) => {
        const sortField = Array.isArray(sorter) ? sorter[0].field : sorter.field;
        const sortOrder = Array.isArray(sorter)
            ? (sorter[0].order === 'ascend' ? 'asc' : 'desc')
            : (sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : undefined);

        setParams(prev => ({
            ...prev,
            page: pagination.current,
            pageSize: pagination.pageSize,
            sortField,
            sortOrder
        }));
    };

    return {
        // Data
        data,
        total,
        loading: loadingCard || loadingData,
        error: errorCard || errorData,

        // Definition
        viewDef,
        entityCard,

        // State
        params,

        // Actions
        handleTableChange,
        refresh: fetchData
    };
};
