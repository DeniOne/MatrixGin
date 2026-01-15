
import React from 'react';
import { FsmDefinitionDto } from '../types/schema';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface FsmBarProps {
    fsm: FsmDefinitionDto | null;
    currentState: string;
    onTransition: (targetState: string) => void;
    readOnly?: boolean;
}

export const FsmBar: React.FC<FsmBarProps> = ({ fsm, currentState, onTransition, readOnly }) => {
    if (!fsm) return null;

    const availableTransitions = fsm.transitions.filter(t => t.from_state_code === currentState);

    // Sort states logic (optional, for now just list them or just allow transitions)
    // We just show current state and available actions.

    const getStateLabel = (code: string) => fsm.states.find(s => s.code === code)?.label || code;

    return (
        <div className="bg-white border-b border-gray-200 px-4 py-3 sm:flex sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500">Current Status:</span>
                <span className={twMerge(
                    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                    currentState === 'active' ? "bg-green-50 text-green-700 ring-green-600/20" :
                        currentState === 'archived' ? "bg-gray-50 text-gray-600 ring-gray-500/10" :
                            "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
                )}>
                    {getStateLabel(currentState)}
                </span>
            </div>

            <div className="mt-3 flex sm:ml-4 sm:mt-0 sm:items-center space-x-2">
                {!readOnly && availableTransitions.map(transition => (
                    <button
                        key={transition.code}
                        type="button"
                        onClick={() => onTransition(transition.to_state_code)}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {transition.ui_action_label || `Mark as ${getStateLabel(transition.to_state_code)}`}
                    </button>
                ))}
            </div>
        </div>
    );
};
