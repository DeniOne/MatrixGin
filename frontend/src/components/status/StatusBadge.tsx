import React from 'react';

import { getStatusName } from '../../features/auth/roleTranslations';

interface StatusBadgeProps {
    code: string;
    description: string;
}

const STATUS_COLORS: Record<string, string> = {
    PHOTON: 'bg-gray-100 text-gray-800',
    TOPCHIK: 'bg-blue-100 text-blue-800',
    STAR: 'bg-purple-100 text-purple-800',
    UNIVERSE: 'bg-yellow-100 text-yellow-800'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ code, description }) => {
    const colorClass = STATUS_COLORS[code] || 'bg-gray-100 text-gray-800';

    return (
        <div className="inline-flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
                {getStatusName(code)}
            </span>
            <span className="text-sm text-gray-600">{description}</span>
        </div>
    );
};
