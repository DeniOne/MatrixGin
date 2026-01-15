/**
 * Production Sessions Page
 * 
 * Read-only view of PSEE production sessions.
 * NO actions, NO edits, NO business logic.
 */

import React from 'react';
import { useGetProductionSessionsQuery, ProductionSession, SlaLevel } from '../../features/production/productionApi';
import { Camera, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import clsx from 'clsx';

/** Format seconds to human-readable duration */
function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
}

/** Format ISO date to short format */
function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/** Short session ID (first 8 chars) */
function shortId(id: string): string {
    return id.substring(0, 8);
}

/** Status badge component */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusColors: Record<string, string> = {
        'PENDING_PHOTOGRAPHER': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'PENDING_RETOUCHER': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'PENDING_REVIEW': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        'APPROVED': 'bg-green-500/20 text-green-400 border-green-500/30',
        'REJECTED': 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    const colorClass = statusColors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

    return (
        <span className={clsx('px-2 py-1 text-xs font-medium rounded border', colorClass)}>
            {status}
        </span>
    );
};

/** SLA badge component */
const SlaBadge: React.FC<{ level: SlaLevel }> = ({ level }) => {
    const slaColors: Record<SlaLevel, string> = {
        'OK': 'bg-green-500/20 text-green-400',
        'WARNING': 'bg-yellow-500/20 text-yellow-400',
        'BREACH': 'bg-red-500/20 text-red-400',
    };

    return (
        <span className={clsx('px-2 py-1 text-xs font-bold rounded', slaColors[level])}>
            {level}
        </span>
    );
};

/** Copyable ID component */
const CopyableId: React.FC<{ id: string }> = ({ id }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-gray-300 hover:text-white font-mono text-sm group"
            title={id}
        >
            {shortId(id)}
            {copied ? (
                <Check className="w-3 h-3 text-green-400" />
            ) : (
                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-50" />
            )}
        </button>
    );
};

/** Session row component */
const SessionRow: React.FC<{ session: ProductionSession }> = ({ session }) => {
    return (
        <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
            <td className="px-4 py-3">
                <CopyableId id={session.id} />
            </td>
            <td className="px-4 py-3">
                <StatusBadge status={session.status} />
            </td>
            <td className="px-4 py-3 text-gray-300">
                {session.role}
            </td>
            <td className="px-4 py-3 text-gray-400">
                {session.assignedUser || '—'}
            </td>
            <td className="px-4 py-3 text-gray-300 font-mono">
                {formatDuration(session.timeInStatusSec)}
            </td>
            <td className="px-4 py-3">
                <SlaBadge level={session.slaLevel} />
            </td>
            <td className="px-4 py-3 text-gray-400 text-sm">
                {formatDate(session.createdAt)}
            </td>
            <td className="px-4 py-3 text-gray-400 text-sm">
                {formatDate(session.lastEventAt)}
            </td>
        </tr>
    );
};

/** Main page component */
export const ProductionSessionsPage: React.FC = () => {
    const { data, isLoading, error } = useGetProductionSessionsQuery();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600/20 rounded-lg">
                    <Camera className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Фотосессии</h1>
                    <p className="text-sm text-gray-400">
                        Производственные сессии из PSEE
                    </p>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                    <span className="ml-3 text-gray-400">Загрузка сессий...</span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 flex items-center gap-4">
                    <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                    <div>
                        <h3 className="text-red-400 font-medium">Ошибка загрузки</h3>
                        <p className="text-red-300/70 text-sm">
                            Не удалось загрузить данные. Попробуйте обновить страницу.
                        </p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {data && data.data.length === 0 && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
                    <Camera className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-gray-400 font-medium">Нет активных сессий</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Данные появятся, когда в PSEE будут созданы фотосессии
                    </p>
                </div>
            )}

            {/* Table */}
            {data && data.data.length > 0 && (
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800/50 border-b border-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Session ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Статус
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Роль
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Назначен
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Время в статусе
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        SLA
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Создана
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Последнее событие
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((session) => (
                                    <SessionRow key={session.id} session={session} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer with count */}
                    <div className="px-4 py-3 border-t border-gray-700 bg-gray-800/30">
                        <span className="text-sm text-gray-400">
                            Всего: {data.total} сессий
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionSessionsPage;
