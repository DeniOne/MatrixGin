import React from 'react';
import clsx from 'clsx';
import { GraphMode, OverlayType } from './types';

interface GraphToolbarProps {
    currentMode: GraphMode;
    onModeChange: (mode: GraphMode) => void;
    activeOverlays: OverlayType[];
    onToggleOverlay: (overlay: OverlayType) => void;
}

const MODES: { value: GraphMode; label: string; icon: string }[] = [
    { value: 'STRUCTURE', label: 'Structure', icon: '🏛️' },
    { value: 'FUNCTION', label: 'Function', icon: '⚡' },
    { value: 'CPK', label: 'CPK', icon: '📦' },
    { value: 'KNOWLEDGE', label: 'Knowledge', icon: '🎓' },
];

const OVERLAYS: { value: OverlayType; label: string }[] = [
    { value: 'LIFECYCLE', label: 'Lifecycle (Drafts)' },
    { value: 'SIGNAL_HEAT', label: 'Signal Heat' },
    { value: 'SCENARIO_DELTA', label: 'Scenario Diff' },
];

export const GraphToolbar: React.FC<GraphToolbarProps> = ({
    currentMode,
    onModeChange,
    activeOverlays,
    onToggleOverlay,
}) => {
    return (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
            {/* Mode Switcher */}
            <div className="bg-white rounded-lg shadow-md p-1 flex flex-col gap-1 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1">
                    Lens
                </span>
                {MODES.map((mode) => (
                    <button
                        key={mode.value}
                        onClick={() => onModeChange(mode.value)}
                        className={clsx(
                            'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left',
                            currentMode === mode.value
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-slate-600 hover:bg-slate-50'
                        )}
                    >
                        <span>{mode.icon}</span>
                        <span>{mode.label}</span>
                    </button>
                ))}
            </div>

            {/* Overlay Toggles */}
            <div className="bg-white rounded-lg shadow-md p-1 flex flex-col gap-1 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1">
                    Overlays
                </span>
                {OVERLAYS.map((overlay) => {
                    const isActive = activeOverlays.includes(overlay.value);
                    return (
                        <button
                            key={overlay.value}
                            onClick={() => onToggleOverlay(overlay.value)}
                            className={clsx(
                                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left',
                                isActive
                                    ? 'bg-slate-800 text-white'
                                    : 'text-slate-600 hover:bg-slate-50'
                            )}
                        >
                            <div className={clsx(
                                "w-2 h-2 rounded-full",
                                isActive ? "bg-green-400" : "bg-slate-300"
                            )} />
                            <span>{overlay.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
