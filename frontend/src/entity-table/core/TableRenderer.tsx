/**
 * Table Renderer
 * 
 * Wrapper around Ant Design Table.
 * View-driven rendering.
 */

import React from 'react';
import { Table, Alert } from 'antd';
import { useTableContext } from './TableContext';
import { ColumnFactory } from './ColumnFactory';

export const TableRenderer: React.FC = () => {
    const {
        viewDef,
        // entityCard, // Unused
        data,
        loading,
        error,
        total,
        params,
        handleTableChange
    } = useTableContext();

    if (error) {
        return <Alert type="error" message={error} showIcon className="mb-4" />;
    }

    if (!viewDef) {
        if (loading) return null; // Wait for definition
        return <Alert type="warning" message="No view definition found" showIcon />;
    }

    const columns = ColumnFactory.createColumns(viewDef);

    return (
        <Table
            rowKey={(record) => record.urn || record.id} // URN is preferred
            columns={columns}
            dataSource={data}
            loading={loading}
            onChange={handleTableChange}
            pagination={{
                current: params.page,
                pageSize: params.pageSize,
                total: total,
                showSizeChanger: true
            }}
            size="middle"
        />
    );
};
