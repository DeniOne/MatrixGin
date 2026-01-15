import React, { useState, useEffect } from 'react';
import { useEntitySchema } from '../hooks/useEntitySchema';
import { FieldRenderer } from './FieldRenderer';
import { FsmBar } from './FsmBar';
import { ImpactPreviewPanel } from './ImpactPreviewPanel';
import { registrySchemaApi } from '../api/schema.api';
import { RelationshipBlock } from './RelationshipBlock';
import { ImpactReport } from '../types/schema';
import { translateEntityType } from '../utils/translations';

interface EntityCardRendererProps {
    entityTypeUrn: string;
    entityId?: string; // If undefined, Create mode
    onClose?: () => void;
}

export const EntityCardRenderer: React.FC<EntityCardRendererProps> = ({ entityTypeUrn, entityId, onClose }) => {
    // 1. Schema State
    const { schema, isLoading: isSchemaLoading, error: schemaError } = useEntitySchema(entityTypeUrn);

    // 2. Data State
    const [entity, setEntity] = useState<any>(null); // Full entity object
    const [formData, setFormData] = useState<any>({});
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
    const [dataError, setDataError] = useState<string | null>(null);
    const [mode, setMode] = useState<'view' | 'edit' | 'create'>('view');
    const [currentFsmState, setCurrentFsmState] = useState<string>('draft');

    // Fetch Data if ID present
    useEffect(() => {
        if (entityId) {
            setIsLoadingData(true);
            setMode('view');
            // Use existing schema API which has getEntity
            registrySchemaApi.getEntity(entityId)
                .then(data => {
                    setEntity(data);
                    setFormData(data.attributes || {});
                    setCurrentFsmState(data.fsm_state || 'draft');
                })
                .catch(err => setDataError(err.message))
                .finally(() => setIsLoadingData(false));
        } else {
            setMode('create');
            setFormData({});
            setCurrentFsmState('draft');
        }
    }, [entityId]);

    if (isSchemaLoading) return <div>Загрузка схемы...</div>;
    if (schemaError) return <div>Ошибка загрузки схемы: {schemaError}</div>;
    if (!schema) return <div>Схема не найдена</div>;

    return (
        <div className="entity-card-renderer">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-white">
                    {mode === 'create' ? `Новая запись: ${translateEntityType(schema.entity_type?.label || entityTypeUrn)}` : entity?.name || translateEntityType(schema.entity_type?.label || '')}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                    {schema.entity_type?.description || schema.description}
                </p>
                {/* FSM Status Bar */}
                <FsmBar
                    currentState={currentFsmState}
                    schema={schema}
                    onTransition={(action) => console.log('Transition', action)}
                />
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    {/* Render Fields */}
                    {Object.entries(schema.attributes || {}).map(([key, attrDef]) => (
                        <FieldRenderer
                            key={key}
                            fieldKey={key}
                            definition={attrDef}
                            value={formData[key]}
                            onChange={(val) => setFormData({ ...formData, [key]: val })}
                            mode={mode === 'view' ? 'read' : 'edit'}
                        />
                    ))}
                </dl>
            </div>

            {/* Relationships Section */}
            <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <h3 className="text-base font-semibold leading-6 text-white mb-4">Связи</h3>

                {schema.relationships?.map(def => (
                    <RelationshipBlock
                        key={def.urn}
                        definition={def}
                        instances={entity?.relationships?.outgoing || []} // Pass flat list, Block filters
                        sourceUrn={entityId || 'new-entity'}
                        onRefresh={() => { /* Reload Entity */ }}
                    />
                ))}
            </div>

            {/* Impact Preview (Hidden by default, shown on save/change) */}
            {/* <ImpactPreviewPanel ... /> */}
        </div>
    );
};
