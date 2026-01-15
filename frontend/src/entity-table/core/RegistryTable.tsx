/**
 * Registry Table Component (Public API)
 * 
 * Usage:
 * <RegistryTable entityType="user_account" viewName="table.default" />
 */

import React from 'react';
import { useEntityTable } from '../hooks/useEntityTable';
import { TableProvider } from './TableContext';
import { TableRenderer } from './TableRenderer';

interface RegistryTableProps {
    entityType: string;
    viewName: string; // strict namespace: table.*
    className?: string;
}

export const RegistryTable: React.FC<RegistryTableProps> = ({
    entityType,
    viewName,
    className
}) => {
    const tableState = useEntityTable({ entityType, viewName });

    return (
        <div className={className}>
            <TableProvider {...tableState}>
                <TableRenderer />
            </TableProvider>
        </div>
    );
};
