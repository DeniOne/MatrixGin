
import React from 'react';
import { ImpactReport, RegistryImpactLevel } from '../types/schema';

interface ImpactPreviewPanelProps {
    report: ImpactReport | null;
    onConfirm: () => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

export const ImpactPreviewPanel: React.FC<ImpactPreviewPanelProps> = ({ report, onConfirm, onCancel, isSubmitting }) => {
    if (!report) return null;

    const { summary, impacts } = report;
    const hasBlocking = summary.blocking > 0;
    const hasWarnings = summary.warning > 0;

    return (
        <div className="rounded-md bg-white p-4 shadow-lg ring-1 ring-black/5">
            <h3 className="text-base font-medium leading-6 text-gray-900 mb-4">Предпросмотр влияния</h3>

            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div className="bg-red-50 p-2 rounded">
                    <span className="block text-xl font-medium text-red-700">{summary.blocking}</span>
                    <span className="text-xs text-red-600 uppercase">Блокирующий</span>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                    <span className="block text-xl font-medium text-yellow-700">{summary.warning}</span>
                    <span className="text-xs text-yellow-600 uppercase">Внимание</span>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                    <span className="block text-xl font-medium text-blue-700">{summary.info}</span>
                    <span className="text-xs text-blue-600 uppercase">Информация</span>
                </div>
            </div>

            <div className="max-h-60 overflow-y-auto mb-4 space-y-2">
                {impacts.map((item, idx) => (
                    <div key={idx} className={`p-3 rounded-md border-l-4 ${item.level === RegistryImpactLevel.BLOCKING ? 'border-red-500 bg-red-50' :
                            item.level === RegistryImpactLevel.WARNING ? 'border-yellow-500 bg-yellow-50' :
                                'border-blue-500 bg-blue-50'
                        }`}>
                        <div className="flex justify-between">
                            <span className="font-medium text-sm">{item.code}</span>
                            <span className="text-xs text-[#717182]">{item.entity_urn}</span>
                        </div>
                        <p className="text-sm mt-1">{item.description}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Отмена
                </button>
                <button
                    onClick={onConfirm}
                    disabled={hasBlocking || isSubmitting}
                    className={`rounded-md px-3 py-2 text-sm font-medium text-[#030213] shadow-sm ${hasBlocking
                            ? 'bg-gray-400 cursor-not-allowed'
                            : hasWarnings
                                ? 'bg-yellow-600 hover:bg-yellow-500'
                                : 'bg-indigo-600 hover:bg-indigo-500'
                        }`}
                >
                    {hasBlocking ? 'Blocked' : hasWarnings ? 'Confirm with Warnings' : 'Confirm & Save'}
                </button>
            </div>
        </div>
    );
};
