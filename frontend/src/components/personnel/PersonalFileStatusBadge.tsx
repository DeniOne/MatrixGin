import React from 'react';
import { HRStatus } from '../../types/personnel.types';

interface PersonalFileStatusBadgeProps {
    status: HRStatus;
    className?: string;
}

const statusConfig: Record<HRStatus, { label: string; color: string; bgColor: string }> = {
    ONBOARDING: {
        label: 'На оформлении',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100',
    },
    ACTIVE: {
        label: 'Активен',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
    },
    SUSPENDED: {
        label: 'Приостановлен',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
    },
    TERMINATED: {
        label: 'Уволен',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
    },
    ARCHIVED: {
        label: 'Архивирован',
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
    },
};

export const PersonalFileStatusBadge: React.FC<PersonalFileStatusBadgeProps> = ({
    status,
    className = ''
}) => {
    const config = statusConfig[status];

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${config.bgColor} ${className}`}
        >
            {config.label}
        </span>
    );
};
