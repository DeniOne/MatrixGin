import { z } from 'zod';

// --- Shared Types ---
export type LifecycleStatus = 'draft' | 'active' | 'archived';

// --- DTO Schemas (Zod) ---

// A. RegistryEntityDTO (Response)
export const RegistryEntitySchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  lifecycle_status: z.enum(['draft', 'active', 'archived']),
  created_at: z.string().datetime(), // ISO 8601
  updated_at: z.string().datetime(), // ISO 8601
});

export type RegistryEntityDTO = z.infer<typeof RegistryEntitySchema>;

// B. RegistryEntityListDTO (Response)
export const RegistryEntityListSchema = z.object({
  items: z.array(RegistryEntitySchema),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
  }),
});

export type RegistryEntityListDTO = z.infer<typeof RegistryEntityListSchema>;

// C. CreateRegistryEntityDTO (Request)
export const CreateRegistryEntitySchema = z.object({
  code: z.string().regex(/^[a-z_][a-z0-9_]*$/, "Code must be snake_case (a-z, 0-9, _)"),
  name: z.string().min(1),
  description: z.string().optional(),
});

export type CreateRegistryEntityDTO = z.infer<typeof CreateRegistryEntitySchema>;

// D. UpdateRegistryEntityDTO (Request)
export const UpdateRegistryEntitySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
}).strict();

export type UpdateRegistryEntityDTO = z.infer<typeof UpdateRegistryEntitySchema>;

// E. LifecycleTransitionDTO (Request)
export const LifecycleTransitionSchema = z.object({
  transition: z.enum(['activate', 'archive']),
});

export type LifecycleTransitionDTO = z.infer<typeof LifecycleTransitionSchema>;

// F. AuditRecordDTO (Response)
export const AuditRecordSchema = z.object({
  timestamp: z.string().datetime(),
  actor_id: z.string(), // uuid or 'system'
  operation: z.enum(['CREATE', 'UPDATE_META', 'UPDATE_LIFECYCLE']),
  field: z.string().optional(),
  old_value: z.string().optional(),
  new_value: z.string().optional(),
});

export type AuditRecordDTO = z.infer<typeof AuditRecordSchema>;
