import React from 'react';
import { useGetStatusHistoryQuery } from '../../features/participation/participationApi';

interface StatusHistoryProps {
    userId: string;
}

export const StatusHistory: React.FC<StatusHistoryProps> = ({ userId }) => {
    const { data: history = [], isLoading, error } = useGetStatusHistoryQuery(userId, { skip: !userId });

    if (isLoading) {
        return <div className="text-center py-4 text-[#717182]">Загрузка истории...</div>;
    }

    if (error) {
        return <div className="text-red-500 py-4">Ошибка загрузки истории</div>;
    }

    if (history.length === 0) {
        return <div className="text-[#717182] py-4 italic">История изменений пуста</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-white/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#717182] uppercase tracking-widest">
                            Изменение
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#717182] uppercase tracking-widest">
                            Причина
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#717182] uppercase tracking-widest">
                            Изменил
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#717182] uppercase tracking-widest">
                            Дата
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {history.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className="text-[#717182] text-[10px] uppercase font-medium">{entry.oldStatus || 'Нет'}</span>
                                <span className="mx-2 text-indigo-500">→</span>
                                <span className="font-medium text-gray-200 text-sm">{entry.newStatus}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">
                                {entry.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-[10px] text-[#717182] uppercase font-medium">
                                {entry.changedBy}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-[10px] text-[#717182] font-medium">
                                {new Date(entry.changedAt).toLocaleString('ru-RU')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
