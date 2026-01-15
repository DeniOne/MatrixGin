import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { CreateEntityPayload, UpdateEntityPayload, RegistryEntity } from '../types';
import { UI_TEXT } from '../config/registryLabels.ru';

interface RegistryFormProps {
    initialData?: RegistryEntity;
    onSubmit: (payload: CreateEntityPayload | UpdateEntityPayload) => void;
    isSubmitting: boolean;
}

const CODE_REGEX = /^[a-z_][a-z0-9_]*$/;

const RegistryForm: React.FC<RegistryFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
    const isEditMode = !!initialData;

    const [code, setCode] = useState(initialData?.code || '');
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');

    const [errors, setErrors] = useState<{ code?: string; name?: string }>({});
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (initialData) {
            setCode(initialData.code);
            setName(initialData.name);
            setDescription(initialData.description || '');
        }
    }, [initialData]);

    const validate = (): boolean => {
        const newErrors: { code?: string; name?: string } = {};

        if (!isEditMode) {
            if (!code) newErrors.code = UI_TEXT.ERR_CODE_REQ;
            else if (!CODE_REGEX.test(code)) newErrors.code = UI_TEXT.ERR_CODE_FMT;
        }

        if (!name.trim()) newErrors.name = UI_TEXT.ERR_NAME_REQ;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        setter: React.Dispatch<React.SetStateAction<string>>,
        value: string
    ) => {
        setter(value);
        setIsDirty(true);
        // Clear errors on change
        if (errors.code || errors.name) setErrors({});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = isEditMode
            ? { name, description }
            : { code, name, description };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {/* CODE FIELD */}
            <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">
                    {UI_TEXT.LABEL_CODE}
                </label>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => handleChange(setCode, e.target.value)}
                    disabled={isEditMode || isSubmitting}
                    className={`
                        w-full bg-slate-900 border rounded px-3 py-2 font-mono text-sm text-indigo-300
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-950
                        ${errors.code ? 'border-red-500' : 'border-slate-700'}
                    `}
                    placeholder="e.g. org_unit_type"
                />
                {errors.code && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.code}
                    </p>
                )}
                {isEditMode && (
                    <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-wider">
                        {UI_TEXT.LOCKED_NOTE}
                    </p>
                )}
            </div>

            {/* NAME FIELD */}
            <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">
                    {UI_TEXT.LABEL_NAME}
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => handleChange(setName, e.target.value)}
                    disabled={isSubmitting}
                    className={`
                        w-full bg-slate-900 border rounded px-3 py-2 text-sm text-slate-200
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                        ${errors.name ? 'border-red-500' : 'border-slate-700'}
                    `}
                    placeholder="Человекочитаемое название"
                />
                {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
            </div>

            {/* DESCRIPTION FIELD */}
            <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">
                    {UI_TEXT.LABEL_DESC}
                </label>
                <textarea
                    value={description}
                    onChange={(e) => handleChange(setDescription, e.target.value)}
                    disabled={isSubmitting}
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
                    placeholder="Опциональные детали..."
                />
            </div>

            {/* ACTION BAR */}
            <div className="pt-4 border-t border-slate-800">
                <button
                    type="submit"
                    disabled={!isDirty || isSubmitting} // Disable if no changes or submitting
                    className={`
                        flex items-center gap-2 px-6 py-2 rounded text-sm font-bold uppercase tracking-wider transition-all
                        ${!isDirty || isSubmitting
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                        }
                    `}
                >
                    <Save className="w-4 h-4" />
                    {isSubmitting
                        ? UI_TEXT.BTN_SAVING
                        : (isEditMode ? UI_TEXT.BTN_SAVE : UI_TEXT.BTN_CREATE)
                    }
                </button>
            </div>
        </form>
    );
};

export default RegistryForm;
