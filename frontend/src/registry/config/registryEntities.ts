export type RegistryEntityType =
  | 'policy-rule' | 'retention-policy'
  | 'role' | 'permission' | 'role-permission' | 'access-scope'
  | 'person' | 'external-actor'
  | 'organization' | 'org-unit' | 'org-unit-type' | 'org-relation' | 'structural-role'
  | 'function' | 'function-group'
  | 'position'
  | 'status' | 'status-rule' | 'qualification' | 'qualification-level'
  | 'cpk' | 'cpk-hierarchy' | 'cpk-owner'
  | 'task-type' | 'task-state' | 'workflow'
  | 'value-token' | 'reward-rule' | 'penalty-rule'
  | 'faculty' | 'methodology' | 'knowledge-unit'
  | 'legal-entity';

export interface EntityConfig {
  id: RegistryEntityType;
  label: string;
  domain: 'Security' | 'Human' | 'Structure' | 'Functional' | 'Hierarchy' | 'Value' | 'Process' | 'Economy' | 'Knowledge' | 'Legal';
  description?: string;
}

export const REGISTRY_ENTITIES: EntityConfig[] = [
  // Security
  { id: 'policy-rule', label: 'Policy Rules', domain: 'Security' },
  { id: 'retention-policy', label: 'Retention Policies', domain: 'Security' },
  { id: 'role', label: 'Roles', domain: 'Security' },
  { id: 'permission', label: 'Permissions', domain: 'Security' },
  { id: 'role-permission', label: 'Role Permissions', domain: 'Security' },
  { id: 'access-scope', label: 'Access Scopes', domain: 'Security' },

  // Human
  { id: 'person', label: 'Persons', domain: 'Human' },
  { id: 'external-actor', label: 'External Actors', domain: 'Human' },

  // Structure
  { id: 'organization', label: 'Organizations', domain: 'Structure' },
  { id: 'org-unit', label: 'Org Units', domain: 'Structure' },
  { id: 'org-unit-type', label: 'Org Unit Types', domain: 'Structure' },
  { id: 'org-relation', label: 'Org Relations', domain: 'Structure' },
  { id: 'structural-role', label: 'Structural Roles', domain: 'Structure' },

  // Functional
  { id: 'function', label: 'Functions', domain: 'Functional' },
  { id: 'function-group', label: 'Function Groups', domain: 'Functional' },

  // Hierarchy / Position
  { id: 'position', label: 'Positions', domain: 'Hierarchy' },
  { id: 'status', label: 'Statuses', domain: 'Hierarchy' },
  { id: 'status-rule', label: 'Status Rules', domain: 'Hierarchy' },
  { id: 'qualification', label: 'Qualifications', domain: 'Hierarchy' },
  { id: 'qualification-level', label: 'Qualification Levels', domain: 'Hierarchy' },

  // Value / CPK
  { id: 'cpk', label: 'CPK (Value Products)', domain: 'Value' },
  { id: 'cpk-hierarchy', label: 'CPK Hierarchy', domain: 'Value' },
  { id: 'cpk-owner', label: 'CPK Owners', domain: 'Value' },

  // Process
  { id: 'task-type', label: 'Task Types', domain: 'Process' },
  { id: 'task-state', label: 'Task States', domain: 'Process' },
  { id: 'workflow', label: 'Workflows', domain: 'Process' },

  // Economy
  { id: 'value-token', label: 'Value Tokens', domain: 'Economy' },
  { id: 'reward-rule', label: 'Reward Rules', domain: 'Economy' },
  { id: 'penalty-rule', label: 'Penalty Rules', domain: 'Economy' },

  // Knowledge
  { id: 'faculty', label: 'Faculties', domain: 'Knowledge' },
  { id: 'methodology', label: 'Methodologies', domain: 'Knowledge' },
  { id: 'knowledge-unit', label: 'Knowledge Units', domain: 'Knowledge' },

  // Legal
  { id: 'legal-entity', label: 'Legal Entities', domain: 'Legal' },
];
