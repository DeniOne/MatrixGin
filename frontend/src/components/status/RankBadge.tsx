import React from 'react';

interface RankBadgeProps {
    code: string;
    description: string;
    gmcBalance: number;
}

const RANK_COLORS: Record<string, string> = {
    COLLECTOR: 'bg-green-100 text-green-800',
    INVESTOR: 'bg-blue-100 text-blue-800',
    MAGNATE: 'bg-purple-100 text-purple-800',
    DIAMOND_HAND: 'bg-yellow-100 text-yellow-800'
};

export const RankBadge: React.FC<RankBadgeProps> = ({ code, description, gmcBalance }) => {
    const colorClass = RANK_COLORS[code] || 'bg-gray-100 text-gray-800';

    return (
        <div className="inline-flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
                {code}
            </span>
            <span className="text-sm text-gray-600">{description}</span>
            <span className="text-xs text-gray-500">({gmcBalance} GMC)</span>
        </div>
    );
};
