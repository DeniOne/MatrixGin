import React, { useState } from 'react';
import { RelationshipDefinitionDto } from '../types/schema';
import { useRegistryImpact } from '../hooks/useRegistryImpact';
import { RelationshipSelector } from './RelationshipSelector';
import { Plus, Trash2, ArrowLeftRight, AlertTriangle, AlertOctagon } from 'lucide-react';

interface RelationshipBlockProps {
    definition: RelationshipDefinitionDto;
    instances: any[]; // RelationshipInstanceDto
    sourceUrn: string;
    onRefresh: () => void;
}

// Helper to determine if report is blocking
const isBlocking = (report: { summary: { blocking: number } } | null) => {
    return report && report.summary.blocking > 0;
};

// Helper to get status label
const getStatusLabel = (report: { summary: { blocking: number; warning: number } } | null) => {
    if (!report) return 'OK';
    if (report.summary.blocking > 0) return 'BLOCKING';
    if (report.summary.warning > 0) return 'WARNING';
    return 'OK';
};

export const RelationshipBlock: React.FC<RelationshipBlockProps> = ({
    definition,
    instances,
    sourceUrn,
    onRefresh
}) => {
    const { analyzeLink, analyzeUnlink, analyzeReplace, impactReport } = useRegistryImpact();
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);

    // Filter instances for this definition
    const relevantInstances = instances.filter(r => r.definition_urn === definition.urn);

    const handleLink = async (targetUrn: string) => {
        setIsSelectorOpen(false);
        const report = await analyzeLink(sourceUrn, targetUrn, definition.urn);
        // If OK/Warning, proceed to commit and refresh
        if (report && !isBlocking(report)) {
            onRefresh();
        }
    };

    const handleReplace = async (oldRelId: string, newTargetUrn: string) => {
        setIsSelectorOpen(false);
        const report = await analyzeReplace(oldRelId, newTargetUrn);
        if (report && !isBlocking(report)) {
            onRefresh();
        }
    };

    const handleUnlink = async (relId: string) => {
        const report = await analyzeUnlink(relId);
        if (report && !isBlocking(report)) {
            onRefresh();
        }
    };

    const blocking = isBlocking(impactReport);
    const statusLabel = getStatusLabel(impactReport);

    return (
        <div className="bg-white border rounded-lg shadow-sm mb-4">
            <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center">
                <div>
                    <h4 className="font-medium text-sm text-gray-900">{definition.label || definition.urn}</h4>
                    <p className="text-xs text-[#717182]">Множественность: {definition.cardinality}</p>
                </div>
            </div>

            <div className="divide-y">
                {relevantInstances.map(rel => (
                    <div key={rel.id} className="px-4 py-3 flex items-center justify-between">
                        <span className="text-sm text-gray-700">{rel.to_urn}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setReplaceTargetId(rel.id); setIsSelectorOpen(true); }}
                                className="p-1 text-[#717182] hover:text-blue-600 transition-colors"
                                title="Заменить"
                            >
                                <ArrowLeftRight size={16} />
                            </button>
                            <button
                                onClick={() => { if (confirm('Отвязать?')) handleUnlink(rel.id); }}
                                className="p-1 text-[#717182] hover:text-red-600 transition-colors"
                                title="Отвязать"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
                {relevantInstances.length === 0 && (
                    <div className="px-4 py-3 text-sm text-[#717182] italic">Нет связей</div>
                )}
            </div>

            {/* Impact Alert */}
            {impactReport && (
                <div className={`m-4 p-4 rounded-md ${blocking ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {blocking ? (
                                <AlertOctagon className="h-5 w-5 text-red-400" aria-hidden="true" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                            )}
                        </div>
                        <div className="ml-3">
                            <h3 className={`text-sm font-medium ${blocking ? 'text-red-800' : 'text-yellow-800'}`}>
                                Анализ влияния: {statusLabel}
                            </h3>
                            <div className={`mt-2 text-sm ${blocking ? 'text-red-700' : 'text-yellow-700'}`}>
                                <ul className="list-disc pl-5 space-y-1">
                                    {impactReport.impacts.map((i, idx) => (
                                        <li key={idx}>[{i.level}] {i.description}</li>
                                    ))}
                                </ul>
                            </div>
                            {!blocking && (
                                <div className="mt-4">
                                    <button className={`text-sm font-medium ${blocking ? 'text-red-800' : 'text-yellow-800'}`}>
                                        Подтвердить действие
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="px-4 py-3 bg-gray-50 border-t">
                <button
                    onClick={() => { setReplaceTargetId(null); setIsSelectorOpen(true); }}
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                    <Plus size={16} className="mr-2" />
                    Связать объект
                </button>
            </div>

            {isSelectorOpen && (
                <RelationshipSelector
                    targetType={definition.target_entity_type_urn}
                    onSelect={(urn) => replaceTargetId ? handleReplace(replaceTargetId, urn) : handleLink(urn)}
                    onCancel={() => setIsSelectorOpen(false)}
                />
            )}
        </div>
    );
};
