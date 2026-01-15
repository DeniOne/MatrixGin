// List of all 47 Foundation Entities as defined in specs
export const FOUNDATION_ENTITIES = [
  // Access
  'user_account',
  'role',
  'permission',
  'role_permission',
  'access_scope',

  // Legal
  'legal_entity',
  'document',

  // Registry (System/Meta)
  'policy_rule',
  'retention_policy',

  // Registry (Human)
  'person',
  'employee',
  'external_actor',
  'ai_agent',

  // Registry (Structure)
  'organization',
  'org_unit_type',
  'org_unit',
  'structural_role',
  'org_relation',

  // Registry (Functional)
  'function_group',
  'function',
  'function_relation',

  // Registry (Position)
  'position',
  'appointment',
  'status',
  'status_rule',
  'qualification',
  'qualification_level',

  // Registry (Task)
  'workflow',
  'task_type',
  'task_state',

  // Registry (Value)
  'cpk',
  'cpk_hierarchy',
  'cpk_owner',
  'value_token',
  'reward_rule',
  'penalty_rule',

  // Registry (Knowledge)
  'expert',
  'faculty',
  'program',
  'course',
  'methodology',
  'knowledge_unit',
  'research_artifact',
  'content_item',
  'tag',

  // Registry (Integration)
  'integration',
  'webhook',
  'data_import'
] as const;

export type EntityType = typeof FOUNDATION_ENTITIES[number];

export function isValidEntityType(type: string): type is EntityType {
  return FOUNDATION_ENTITIES.includes(type as EntityType);
}

export function getTableForEntity(type: EntityType): string {
  if (['user_account', 'role', 'permission', 'role_permission', 'access_scope'].includes(type)) {
    return `security.${type}`;
  }

  if (['legal_entity', 'document'].includes(type)) {
    return `legal.${type}`;
  }

  return `registry.${type}`;
}
