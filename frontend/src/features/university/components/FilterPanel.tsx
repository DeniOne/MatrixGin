import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterOption {
    value: string;
    label: string;
}

interface FilterGroup {
    id: string;
    label: string;
    options: FilterOption[];
}

interface FilterPanelProps {
    filters: FilterGroup[];
    activeFilters: Record<string, string[]>;
    onFilterChange: (groupId: string, value: string) => void;
    onClearFilters: () => void;
    className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
    filters,
    activeFilters,
    onFilterChange,
    onClearFilters,
    className = '',
}) => {
    const hasActiveFilters = Object.values(activeFilters).some((f) => f.length > 0);

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-700 font-medium">
                    <Filter className="w-4 h-4 mr-2" />
                    Фильтры
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-red-600 hover:text-red-700 flex items-center"
                    >
                        <X className="w-3 h-3 mr-1" />
                        Сбросить
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {filters.map((group) => (
                    <div key={group.id}>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                            {group.label}
                        </h4>
                        <div className="space-y-2">
                            {group.options.map((option) => {
                                const isActive = activeFilters[group.id]?.includes(option.value);
                                return (
                                    <label
                                        key={option.value}
                                        className="flex items-center cursor-pointer group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={() => onFilterChange(group.id, option.value)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
                                        />
                                        <span className={`ml-2 text-sm ${isActive ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                            {option.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
