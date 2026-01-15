/**
 * API Types
 * 
 * Common types for frontend API.
 */

// =============================================================================
// RELATIONSHIP TYPES
// =============================================================================

export interface RelationshipDefinitionDto {
    urn: string;
    label: string;
    description?: string;
    cardinality: string;
    source_entity_type_urn: string;
    target_entity_type_urn: string;
}

export interface RelationshipInstanceDto {
    id: string;
    definition_urn: string;
    from_urn: string;
    to_urn: string;
    created_at: string;
}

// =============================================================================
// ENTITY TYPES
// =============================================================================

export interface EntityDto {
    urn: string;
    type_urn: string;
    label: string;
    data: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}
