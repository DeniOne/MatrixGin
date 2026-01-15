import React from 'react';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { RegistryEntity } from '../types';
import LifecycleBadge from './LifecycleBadge';
import { UI_TEXT } from '../config/registryLabels.ru';

interface RegistryTableProps {
    data?: RegistryEntity[];
    isLoading: boolean;
    onRowClick: (id: string) => void;
}

const RegistryTable: React.FC<RegistryTableProps> = ({ data, isLoading, onRowClick }) => {
    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="font-mono text-xs">{UI_TEXT.LOADING}</span>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-lg bg-slate-900/50">
                <span className="text-sm font-medium">{UI_TEXT.NOT_FOUND}</span>
                <span className="text-xs mt-1 text-slate-600">{UI_TEXT.NOT_FOUND_HINT}</span>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-sm">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-800/50 text-xs uppercase text-slate-500">
                    <tr>
                        <th className="px-6 py-3 font-medium tracking-wider w-48">{UI_TEXT.COL_CODE}</th>
                        <th className="px-6 py-3 font-medium tracking-wider">{UI_TEXT.COL_NAME}</th>
                        <th className="px-6 py-3 font-medium tracking-wider w-32">{UI_TEXT.COL_STATUS}</th>
                        <th className="px-6 py-3 font-medium tracking-wider w-48 text-right">{UI_TEXT.COL_UPDATED}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {data.map((entity) => (
                        <tr
                            key={entity.id}
                            onClick={() => onRowClick(entity.id)}
                            className="cursor-pointer transition-colors hover:bg-slate-800 group"
                        >
                            <td className="px-6 py-4 font-mono text-indigo-400 group-hover:text-indigo-300">
                                {entity.code}
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-200">
                                {entity.name}
                                {entity.description && (
                                    <div className="text-xs text-slate-500 truncate max-w-md font-normal mt-0.5">
                                        {entity.description}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <LifecycleBadge status={entity.lifecycle_status} />
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-xs text-slate-500">
                                {format(new Date(entity.updated_at), 'yyyy-MM-dd HH:mm')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RegistryTable;
