import React, { createContext, useContext } from 'react';
import { EntityCardTableDefinition, EntityCard } from '../types';

interface TableContextProps {
    viewDef: EntityCardTableDefinition | undefined;
    entityCard: EntityCard | null;
    loading: boolean;
    error: string | null;

    data: any[];
    total: number;
    params: any; // TableApiParams

    handleTableChange: (pagination: any, filters: any, sorter: any) => void;
    refresh: () => void;
}

const TableContext = createContext<TableContextProps | undefined>(undefined);

export const TableProvider: React.FC<TableContextProps & { children: React.ReactNode }> = ({
    children,
    ...props
}) => {
    return (
        <TableContext.Provider value={props}>
            {children}
        </TableContext.Provider>
    );
};

export const useTableContext = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('useTableContext must be used within a TableProvider');
    }
    return context;
};
