import { Pool, QueryResult } from 'pg';
import { pool } from '../services/db';
import { RegistryEntityDTO } from '../dto/registry.dto';
import { getTableForEntity, EntityType } from '../dto/domain';

export class RegistryRepository {
    private tableName: string;
    private entityType: EntityType;

    constructor(entityType: EntityType) {
        this.entityType = entityType;
        this.tableName = getTableForEntity(entityType);
    }

    async findAll(limit: number, offset: number): Promise<{ items: RegistryEntityDTO[]; total: number }> {
        const query = `
      SELECT 
        id, code, name, description, lifecycle_status, created_at, updated_at,
        count(*) OVER() as full_count
      FROM ${this.tableName}
      ORDER BY updated_at DESC
      LIMIT $1 OFFSET $2
    `;

        const result = await pool.query(query, [limit, offset]);

        const items = result.rows.map(this.mapRowToDTO);
        const total = result.rows.length > 0 ? parseInt(result.rows[0].full_count) : 0;

        return { items, total };
    }

    async findById(id: string): Promise<RegistryEntityDTO | null> {
        const query = `
      SELECT id, code, name, description, lifecycle_status, created_at, updated_at
      FROM ${this.tableName}
      WHERE id = $1
    `;
        const result = await pool.query(query, [id]);
        return result.rows.length > 0 ? this.mapRowToDTO(result.rows[0]) : null;
    }

    async findByCode(code: string): Promise<RegistryEntityDTO | null> {
        const query = `
      SELECT id, code, name, description, lifecycle_status, created_at, updated_at
      FROM ${this.tableName}
      WHERE code = $1
    `;
        const result = await pool.query(query, [code]);
        return result.rows.length > 0 ? this.mapRowToDTO(result.rows[0]) : null;
    }

    async create(code: string, name: string, description?: string, actorId: string = 'system'): Promise<RegistryEntityDTO> {
        // Note: created_by and source are standard columns system wide, but RegistryEntityDTO doesn't strict expose them.
        // lifecycle_status defaults to 'active' in DB schema, but Guardrails/Service Logic says 'draft'.
        // We explicitly set 'draft'.

        const query = `
      INSERT INTO ${this.tableName} (code, name, description, lifecycle_status, created_by, source)
      VALUES ($1, $2, $3, 'draft', $4::uuid, 'registry')
      RETURNING id, code, name, description, lifecycle_status, created_at, updated_at
    `;

        // If actorId is 'system' or invalid UUID, we can pass NULL or a specific system UUID.
        // For now, if 'system', we pass NULL (DB allows nullable created_by).
        const safeActor = (actorId === 'system' || !this.isUuid(actorId)) ? null : actorId;

        const result = await pool.query(query, [code, name, description || null, safeActor]);
        return this.mapRowToDTO(result.rows[0]);
    }

    async update(id: string, name?: string, description?: string): Promise<RegistryEntityDTO> {
        // Dynamic update set
        const updates: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (name !== undefined) {
            updates.push(`name = $${idx++}`);
            values.push(name);
        }
        if (description !== undefined) {
            updates.push(`description = $${idx++}`);
            values.push(description);
        }

        if (updates.length === 0) {
            // Nothing to update, return current
            const current = await this.findById(id);
            if (!current) throw new Error('Entity not found');
            return current;
        }

        updates.push(`updated_at = now()`);
        values.push(id); // ID is final param

        const query = `
      UPDATE ${this.tableName}
      SET ${updates.join(', ')}
      WHERE id = $${idx}
      RETURNING id, code, name, description, lifecycle_status, created_at, updated_at
    `;

        const result = await pool.query(query, values);
        return this.mapRowToDTO(result.rows[0]);
    }

    async updateLifecycle(id: string, newStatus: string): Promise<RegistryEntityDTO> {
        const query = `
      UPDATE ${this.tableName}
      SET lifecycle_status = $1, updated_at = now()
      WHERE id = $2
      RETURNING id, code, name, description, lifecycle_status, created_at, updated_at
    `;
        const result = await pool.query(query, [newStatus, id]);
        return this.mapRowToDTO(result.rows[0]);
    }

    private mapRowToDTO(row: any): RegistryEntityDTO {
        return {
            id: row.id,
            code: row.code,
            name: row.name,
            description: row.description,
            lifecycle_status: row.lifecycle_status,
            created_at: row.created_at.toISOString(),
            updated_at: row.updated_at.toISOString(),
        };
    }

    private isUuid(str: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
    }
}
