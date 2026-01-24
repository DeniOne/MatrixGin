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
            <div className="flex h-64 items-center justify-center text-[#717182]">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="font-mono text-xs">{UI_TEXT.LOADING}</span>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center text-[#717182] border border-dashed border-black/10 rounded-lg bg-slate-50/50">
                <span className="text-sm font-medium text-[#030213]">{UI_TEXT.NOT_FOUND}</span>
                <span className="text-xs mt-1 text-[#717182]">{UI_TEXT.NOT_FOUND_HINT}</span>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
            <table className="w-full text-left text-sm text-[#717182]">
                <thead className="bg-[#F3F3F5] text-[10px] uppercase text-[#717182] tracking-wider">
                    <tr>
                        <th className="px-6 py-3 font-medium w-48">{UI_TEXT.COL_CODE}</th>
                        <th className="px-6 py-3 font-medium">{UI_TEXT.COL_NAME}</th>
                        <th className="px-6 py-3 font-medium w-32">{UI_TEXT.COL_STATUS}</th>
                        <th className="px-6 py-3 font-medium w-48 text-right">{UI_TEXT.COL_UPDATED}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                    {data.map((entity) => (
                        <tr
                            key={entity.id}
                            onClick={() => onRowClick(entity.id)}
                            className="cursor-pointer transition-colors hover:bg-slate-50/80 group"
                        >
                            <td className="px-6 py-4 font-mono text-indigo-600 group-hover:text-indigo-700 font-medium">
                                {entity.code}
                            </td>
                            <td className="px-6 py-4 font-medium text-[#030213]">
                                {entity.name}
                                {entity.description && (
                                    <div className="text-xs text-[#717182] truncate max-w-md font-normal mt-0.5">
                                        {entity.description}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <LifecycleBadge status={entity.lifecycle_status} />
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-xs text-[#717182]">
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
