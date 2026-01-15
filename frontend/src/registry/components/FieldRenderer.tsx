import React from 'react';
import { translateFieldLabel } from '../utils/translations';

// Simplified interface conforming to the FormFieldDto from Backend
interface FieldRendererProps {
    definition: {
        widget: string; // FormWidgetType
        code: string;
        label: string;
        config?: any;
    };
    value?: any;
    onChange?: (value: any) => void;
    disabled?: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ definition, value, onChange, disabled }) => {

    // Handler helpers (same as before)
    const handleChange = (e: any) => {
        if (onChange) onChange(e.target ? e.target.value : e);
    };

    const renderField = (): JSX.Element => {
        switch (definition.widget) {
            case 'STATIC_TEXT':
                return (
                    <span className="block p-2 bg-gray-50 border border-gray-100 rounded text-gray-800">
                        {String(value || '-')}
                    </span>
                );

            case 'INPUT_BOOLEAN':
                return <input type="checkbox" checked={!!value} onChange={e => handleChange(e.target.checked)} disabled={disabled} className="rounded" />;

            case 'INPUT_DATE':
                return <input type="date" value={value || ''} onChange={handleChange} className="border p-2 w-full rounded text-black" disabled={disabled} />;

            case 'INPUT_SELECT':
                return (
                    <select value={value || ''} onChange={handleChange} className="border p-2 w-full rounded text-black" disabled={disabled}>
                        <option value="">Выберите...</option>
                        {definition.config?.options?.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                );

            case 'INPUT_NUMBER':
                return <input type="number" value={value || ''} onChange={handleChange} className="border p-2 w-full rounded text-black" disabled={disabled} />;

            case 'INPUT_TEXT':
            default:
                return <input type="text" value={value || ''} onChange={handleChange} className="border p-2 w-full rounded text-black" disabled={disabled} />;
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-white mb-2">
                {translateFieldLabel(definition.label)}
                {definition.config?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField()}
        </div>
    );
};
