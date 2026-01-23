import React from 'react';
import { format } from 'date-fns';
import { History, Terminal } from 'lucide-react';
import { AuditRecord } from '../types';
import { UI_TEXT } from '../config/registryLabels.ru';

interface AuditLogProps {
    logs?: AuditRecord[];
    isLoading: boolean;
}

const AuditLog: React.FC<AuditLogProps> = ({ logs, isLoading }) => {
    if (isLoading) {
        return <div className="p-4 text-xs text-slate-500 animate-pulse">{UI_TEXT.LOADING}</div>;
    }

    if (!logs || logs.length === 0) {
        return (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg text-slate-600">
                <History className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <span className="text-xs">{UI_TEXT.AUDIT_EMPTY}</span>
            </div>
        );
    }

    return (
        <div className="border border-slate-800 rounded-lg bg-slate-950 overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
                <Terminal className="w-3 h-3 text-slate-500" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{UI_TEXT.AUDIT_TITLE}</span>
            </div>

            <table className="w-full text-left text-xs text-slate-400">
                <thead className="bg-slate-900 text-[10px] uppercase text-slate-500 font-mono">
                    <tr>
                        <th className="px-4 py-2 w-32">Метка времени (UTC)</th>
                        <th className="px-4 py-2 w-32">Actor</th>
                        <th className="px-4 py-2 w-32">Operation</th>
                        <th className="px-4 py-2">Подробнее</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-mono">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/30 transition-colors">
                            <td className="px-4 py-2 text-slate-500">
                                {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                            </td>
                            <td className="px-4 py-2 text-indigo-400">
                                {log.actor_id.substring(0, 8)}...
                            </td>
                            <td className="px-4 py-2">
                                <span className={`
                                    px-1.5 py-0.5 rounded text-[10px] font-bold
                                    ${log.operation === 'CREATE' ? 'bg-green-900/30 text-green-400' : ''}
                                    ${log.operation === 'UPDATE_META' ? 'bg-blue-900/30 text-blue-400' : ''}
                                    ${log.operation === 'UPDATE_LIFECYCLE' ? 'bg-purple-900/30 text-purple-400' : ''}
                                `}>
                                    {log.operation}
                                </span>
                            </td>
                            <td className="px-4 py-2 text-slate-300 break-all">
                                {log.details}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AuditLog;
