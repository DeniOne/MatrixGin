import React from 'react';
import { FieldRenderer } from './FieldRenderer';
import { useEntitySchema } from '../hooks/useEntitySchema';

interface ReadOnlyEntityCardProps {
    entity: any; // The immutable projection
    schemaUrn?: string; // If embedded in view that knows schema
}

export const ReadOnlyEntityCard: React.FC<ReadOnlyEntityCardProps> = ({ entity, schemaUrn }) => {
    // If we have entity, we can derive type.
    const typeUrn = schemaUrn || entity.entity_type_urn;
    const { schema } = useEntitySchema(typeUrn);

    if (!schema || !entity) return <div>Loading Snapshot...</div>;

    return (
        <div className="bg-gray-100 p-6 rounded-lg pointer-events-none opacity-90">
            {/* Header */}
            <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-700">{entity.name || 'Unnamed Entity'}</h2>
                <span className="bg-gray-200 text-gray-600 px-2 py-1 text-xs rounded">
                    READ-ONLY SNAPSHOT
                </span>
                <p className="text-xs text-gray-500 mt-1">URN: {entity.urn}</p>
            </div>

            {/* Attributes */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                {schema.attributes.map(attr => (
                    <FieldRenderer
                        key={attr.urn}
                        definition={{
                            widget: attr.ui_component || 'INPUT_TEXT',
                            code: attr.code,
                            label: attr.label,
                            config: { required: attr.is_required }
                        }}
                        value={entity.attributes?.[attr.code]}
                        onChange={() => { }} // No-op
                        disabled={true}
                    />
                ))}
            </div>

            {/* Relationships (Read Only) */}
            <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Relationships (Snapshot)</h3>
                {/* 
                    We need a ReadOnly mode for RelationshipBlock. 
                    Or we simply list them here manually to avoid 'Add' buttons appearing 
                    if RelationshipBlock doesn't support 'readOnly'.
                    For Step 13, let's just render a list.
                 */}
                <ul className="list-disc pl-5">
                    {entity.relationships?.outgoing?.map((rel: any) => (
                        <li key={rel.id} className="text-sm text-gray-600">
                            {rel.to_urn} ({rel.definition_urn})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
