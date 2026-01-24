import React, { useState, useEffect } from 'react';
import { useEntitySchema } from '../hooks/useEntitySchema';
import { FieldRenderer } from './FieldRenderer';
import { FsmBar } from './FsmBar';
import { registrySchemaApi } from '../api/schema.api';
import { RelationshipBlock } from './RelationshipBlock';
import { translateEntityType } from '../utils/translations';

interface EntityCardRendererProps {
    entityTypeUrn: string;
    entityId?: string; // If undefined, Create mode
    onClose?: () => void;
}

export const EntityCardRenderer: React.FC<EntityCardRendererProps> = ({ entityTypeUrn, entityId }) => {
    // 1. Schema State
    const { schema, isLoading: isSchemaLoading, error: schemaError } = useEntitySchema(entityTypeUrn);

    // 2. Data State
    const [entity, setEntity] = useState<any>(null); // Full entity object
    const [formData, setFormData] = useState<any>({});
    // const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
    // const [dataError, setDataError] = useState<string | null>(null);
    const [mode, setMode] = useState<'view' | 'edit' | 'create'>('view');
    const [currentFsmState, setCurrentFsmState] = useState<string>('draft');

    // Fetch Data if ID present
    useEffect(() => {
        if (entityId) {
            // setIsLoadingData(true);
            setMode('view');
            // Use existing schema API which has getEntity
            registrySchemaApi.getEntity(entityId)
                .then(data => {
                    setEntity(data);
                    setFormData(data.attributes || {});
                    setCurrentFsmState(data.fsm_state || 'draft');
                })
            // .catch(err => setDataError(err.message))
            // .finally(() => setIsLoadingData(false));
        } else {
            setMode('create');
            setFormData({});
            setCurrentFsmState('draft');
        }
    }, [entityId]);

    if (isSchemaLoading) return <div className="p-8 text-[#717182] font-medium animate-pulse italic">Загрузка схемы...</div>;
    if (schemaError) return <div className="p-8 text-rose-600 bg-rose-50 border border-rose-100 rounded-xl font-medium">Ошибка загрузки схемы: {schemaError}</div>;
    if (!schema) return <div className="p-8 text-amber-600 bg-amber-50 border border-amber-100 rounded-xl font-medium">Схема не найдена</div>;

    return (
        <div className="entity-card-renderer">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-[#030213]">
                    {mode === 'create' ? `Новая запись: ${translateEntityType(schema.entity_type?.label || entityTypeUrn)}` : entity?.name || translateEntityType(schema.entity_type?.label || '')}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-[#717182]">
                    {schema.entity_type?.description || ''}
                </p>
                {/* FSM Status Bar */}
                <FsmBar
                    currentState={currentFsmState}
                    fsm={schema.fsm}
                    onTransition={(action) => console.log('Transition', action)}
                />
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    {/* Render Fields */}
                    {schema.attributes?.map((attrDef) => (
                        <FieldRenderer
                            key={attrDef.code}
                            definition={{
                                widget: attrDef.ui_component || 'INPUT_TEXT',
                                code: attrDef.code,
                                label: attrDef.label,
                                config: { required: attrDef.is_required }
                            }}
                            value={formData[attrDef.code]}
                            onChange={(val) => setFormData({ ...formData, [attrDef.code]: val })}
                            disabled={mode === 'view'}
                        />
                    ))}
                </dl>
            </div>

            {/* Relationships Section */}
            <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <h3 className="text-base font-medium leading-6 text-[#030213] mb-4">Связи</h3>

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
