/**
 * Base Cell Components
 * 
 * Pure components for rendering table cells.
 * NO mutation logic here.
 */

import React from 'react';
import { Tag } from 'antd';
import dayjs from 'dayjs';

interface CellProps {
    value: any;
    record?: any;
    options?: Record<string, any>;
}

// 1. Text Cell
export const TextCell: React.FC<CellProps> = ({ value }) => {
    if (value === null || value === undefined) return <span className="text-gray-300">-</span>;
    return <span>{String(value)}</span>;
};

// 2. Date Cell
export const DateCell: React.FC<CellProps> = ({ value }) => {
    if (!value) return <span className="text-gray-300">-</span>;
    return <span>{dayjs(value).format('DD.MM.YYYY')}</span>;
};

// 3. DateTime Cell
export const DateTimeCell: React.FC<CellProps> = ({ value }) => {
    if (!value) return <span className="text-gray-300">-</span>;
    return <span className="text-xs text-gray-500">{dayjs(value).format('DD.MM.YYYY HH:mm')}</span>;
};

// 4. Badge Cell (for Enums)
export const BadgeCell: React.FC<CellProps> = ({ value, options }) => {
    if (!value) return <span className="text-gray-300">-</span>;

    // Options can map value -> color in backend config
    // e.g. options: { "ACTIVE": "green", "DRAFT": "blue" }
    const color = options?.[value] || 'default';

    return <Tag color={color}>{value}</Tag>;
};

// 5. Link Cell (Navigation)
export const LinkCell: React.FC<CellProps> = ({ value, record, options }) => {
    if (!value) return <span className="text-gray-300">-</span>;

    // Construct link based on options pattern
    // e.g. /app/users/:id
    const href = options?.hrefPattern?.replace(':id', record.key || record.id) || '#';

    return (
        <a href={href} className="text-blue-600 hover:underline" onClick={e => e.stopPropagation()}>
            {value}
        </a>
    );
};
