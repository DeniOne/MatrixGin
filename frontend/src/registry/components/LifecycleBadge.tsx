import React from 'react';
import { clsx } from 'clsx';
import { LifecycleStatus } from '../types';
import { UI_TEXT } from '../config/registryLabels.ru';

interface LifecycleBadgeProps {
    status: LifecycleStatus;
    className?: string;
}

const statusConfig: Record<LifecycleStatus, string> = {
    draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    active: 'bg-green-500/10 text-green-400 border-green-500/30',
    archived: 'bg-slate-500/10 text-slate-400 border-slate-500/30 line-through',
};

const statusLabels: Record<LifecycleStatus, string> = {
    draft: UI_TEXT.STATUS_DRAFT,
    active: UI_TEXT.STATUS_ACTIVE,
    archived: UI_TEXT.STATUS_ARCHIVED
};

const LifecycleBadge: React.FC<LifecycleBadgeProps> = ({ status, className }) => {
    return (
        <span
            className={clsx(
                'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border',
                statusConfig[status],
                className
            )}
        >
            {statusLabels[status]}
        </span>
    );
};

export default LifecycleBadge;
