import React, { useState } from 'react';

interface RelationshipSelectorProps {
    targetType: string;
    onSelect: (urn: string) => void;
    onCancel: () => void;
}

export const RelationshipSelector: React.FC<RelationshipSelectorProps> = ({
    targetType,
    onSelect,
    onCancel
}) => {
    const [selected, setSelected] = useState<string>('');

    // TODO: Connect to Search API using targetType constraint
    const options = [
        { value: 'urn:mg:person:1', label: 'Person 1' },
        { value: 'urn:mg:company:1', label: 'Company A' }
    ]; // Placeholder

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                <h3 className="text-lg font-medium mb-4">Выбрать {targetType}</h3>

                <div className="mb-4">
                    <select
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selected}
                        onChange={(e) => setSelected(e.target.value)}
                    >
                        <option value="">Выберите сущность...</option>
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={() => selected && onSelect(selected)}
                        disabled={!selected}
                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        Выбрать
                    </button>
                </div>
            </div>
        </div>
    );
};
