import React from 'react';
import { Play, Archive, Loader2 } from 'lucide-react';
import { LifecycleStatus } from '../types';
import LifecycleBadge from './LifecycleBadge';
import { UI_TEXT } from '../config/registryLabels.ru';

interface LifecyclePanelProps {
    status: LifecycleStatus;
    onActivate: () => void;
    onArchive: () => void;
    isLoading: boolean;
}

const LifecyclePanel: React.FC<LifecyclePanelProps> = ({ status, onActivate, onArchive, isLoading }) => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                {UI_TEXT.TAB_LIFECYCLE}
            </h3>

            <div className="flex items-center justify-between mb-6 p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-sm font-medium text-slate-400">{UI_TEXT.COL_STATUS}</span>
                <LifecycleBadge status={status} className="px-3 py-1 text-xs" />
            </div>

            <div className="space-y-3">
                {/* ACTIVATE TRANSITION */}
                {status === 'draft' && (
                    <button
                        onClick={onActivate}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600/10 hover:bg-green-600/20 text-green-400 border border-green-600/30 rounded transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        <span className="font-bold text-xs uppercase">{UI_TEXT.BTN_ACTIVATE}</span>
                    </button>
                )}

                {/* ARCHIVE TRANSITION */}
                {status === 'active' && (
                    <button
                        onClick={onArchive}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                        <span className="font-bold text-xs uppercase">{UI_TEXT.BTN_ARCHIVE}</span>
                    </button>
                )}

                {/* ARCHIVED STATE */}
                {status === 'archived' && (
                    <div className="text-center py-2 text-xs text-slate-500 font-mono">
                        {UI_TEXT.TERM_STATE_NOTE}
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-600 leading-relaxed">
                <p>
                    <strong>Rules:</strong><br />
                    • {UI_TEXT.NO_REVERSE_NOTE}
                </p>
            </div>
        </div>
    );
};

export default LifecyclePanel;
