import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import clsx from 'clsx';
import { OFSNodeData } from '../types';

const SignalColors = {
    GREEN: 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]',
    YELLOW: 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]',
    RED: 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]',
    GRAY: 'border-gray-400',
};

const ScenarioBadges = {
    ADDED: { label: '+', color: 'bg-green-500' },
    MODIFIED: { label: 'Δ', color: 'bg-yellow-500' },
    REMOVED: { label: '×', color: 'bg-red-500' },
    UNCHANGED: null,
};

const OFSNode = ({ data }: NodeProps<OFSNodeData>) => {
    const {
        label,
        type,
        lifecycleState,
        signalLevel,
        scenarioDelta,
        isFocused
    } = data;

    // Lifecycle Styles
    const isDraft = lifecycleState === 'DRAFT';
    const isArchived = lifecycleState === 'ARCHIVED';

    // Scenario Styles
    const isScenarioMode = !!scenarioDelta;
    const deltaBadge = isScenarioMode ? ScenarioBadges[scenarioDelta] : null;
    const isNew = scenarioDelta === 'ADDED';
    const isRemoved = scenarioDelta === 'REMOVED';

    // Distinct Visual Modes
    const isFunction = type === 'Function';
    const isCPK = type === 'CPK';

    // Shape Calculation
    const shapeClasses = isFunction
        ? 'rounded-full px-5' // Pill shape for Functions
        : isCPK
            ? 'rounded-sm px-6 skew-x-[-10deg]' // Parallelogram for CPK/Value Chain
            : 'rounded-lg px-4'; // Default Card for OrgUnit

    return (
        <div
            className={clsx(
                'relative min-w-[120px] py-2 bg-white transition-all duration-300',
                shapeClasses,
                'border-2',
                // Default Border
                !signalLevel && !isScenarioMode && 'border-slate-200',

                // Signal Heat Overlay (Winner takes all if active)
                signalLevel && SignalColors[signalLevel],
                // Breathing Animation for active signals
                signalLevel && signalLevel !== 'GRAY' && 'animate-pulse',

                // Lifecycle Overlay
                isDraft && 'border-dashed opacity-80',
                isArchived && 'grayscale opacity-50',

                // Scenario Overlay overrides
                isNew && 'border-dashed border-green-500',
                isRemoved && 'border-red-400 opacity-60 line-through decoration-red-500',

                // Focus State
                isFocused && 'ring-2 ring-blue-400 ring-offset-2 scale-105 z-10 shadow-lg'
            )}
        >
            {/* Input Handle */}
            <Handle type="target" position={Position.Top} className="!bg-slate-300 opacity-0 hover:opacity-100 transition-opacity" />

            {/* Scenario Badge */}
            {deltaBadge && (
                <div className={clsx(
                    'absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-white text-xs font-bold shadow-sm',
                    deltaBadge.color
                )}>
                    {deltaBadge.label}
                </div>
            )}

            {/* Node Content */}
            <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold select-none">
                    {type}
                </span>
                <span className={clsx(
                    'text-sm font-medium text-slate-800 text-center leading-tight select-none',
                    isCPK && 'skew-x-[10deg]', // Counter-skew text for readability
                    isRemoved && 'line-through'
                )}>
                    {label}
                </span>
            </div>

            {/* Signal Tooltip Indicator */}
            {signalLevel && (
                <div className={clsx(
                    "absolute w-2 h-2 rounded-full",
                    // Adapting position based on shape
                    isFunction ? "-right-1 top-1/2 -translate-y-1/2" : "-bottom-1 -right-1",
                    signalLevel === 'GREEN' && "bg-green-500",
                    signalLevel === 'YELLOW' && "bg-yellow-500",
                    signalLevel === 'RED' && "bg-red-500",
                    signalLevel === 'GRAY' && "bg-gray-400",
                )} />
            )}

            {/* Output Handle */}
            <Handle type="source" position={Position.Bottom} className="!bg-slate-300 opacity-0 hover:opacity-100 transition-opacity" />
        </div>
    );
};

export default memo(OFSNode);
