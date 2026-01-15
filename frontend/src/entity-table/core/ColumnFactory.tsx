/**
 * Column Factory
 * 
 * Pure function that maps EntityCard Table Column Definition 
 * to Ant Design Column Configuration.
 */

import { ColumnsType } from 'antd/es/table';
import { EntityCardTableColumn, EntityCardTableDefinition } from '../types';
import {
    TextCell,
    DateCell,
    DateTimeCell,
    BadgeCell,
    LinkCell
} from '../cells';

export class ColumnFactory {
    static createColumns(viewDef: EntityCardTableDefinition): ColumnsType<any> {
        return viewDef.columns
            .filter(col => !col.hidden)
            .map(col => this.createColumn(col));
    }

    private static createColumn(col: EntityCardTableColumn) {
        return {
            title: col.label,
            dataIndex: col.field, // Supports dot notation by default in Antd? Need check if flat or nested.
            key: col.field,
            width: col.width,
            sorter: col.sortable ? true : false,
            render: (value: any, record: any) => this.renderCell(col, value, record)
        };
    }

    private static renderCell(col: EntityCardTableColumn, value: any, record: any) {
        // 1. Explicit Renderer Override
        if (col.renderer) {
            switch (col.renderer) {
                case 'badge': return <BadgeCell value={value} options={col.rendererOptions} />;
                case 'date': return <DateCell value={value} />;
                case 'datetime': return <DateTimeCell value={value} />;
                case 'link': return <LinkCell value={value} record={record} options={col.rendererOptions} />;
                case 'text': return <TextCell value={value} />;
                // actions...
                default: return <TextCell value={value} />;
            }
        }

        // 2. Implicit Renderer by DataType
        switch (col.dataType) {
            case 'date': return <DateCell value={value} />;
            case 'datetime': return <DateTimeCell value={value} />;
            case 'boolean': return <TextCell value={value ? 'Yes' : 'No'} />;
            case 'enum': return <TextCell value={value} />; // Default to text if no badge renderer
            default: return <TextCell value={value} />;
        }
    }
}
