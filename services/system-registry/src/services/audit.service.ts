import { pool } from './db';
import { AuditRecordDTO, AuditRecordSchema } from '../dto/registry.dto';
import { logger } from '../utils/logger';

export class AuditService {

    async log(
        operation: 'CREATE' | 'UPDATE_META' | 'UPDATE_LIFECYCLE',
        entityType: string,
        entityCode: string,
        actorId: string,
        changes?: { field?: string; old?: string; new?: string }
    ): Promise<void> {

        // Non-blocking log - fire and forget from the perspective of the main transaction usually, 
        // but here we want consistency. However, for performance we might await it.
        // Given the requirements of "Strict Audit", we should await it to ensure it's persisted on write.

        const query = `
      INSERT INTO registry.audit_log (
        actor_id, operation, entity_type, entity_code, field, old_value, new_value
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

        try {
            await pool.query(query, [
                actorId,
                operation,
                entityType,
                entityCode,
                changes?.field || null,
                changes?.old || null,
                changes?.new || null
            ]);
        } catch (err) {
            logger.error('Failed to write audit log', { error: err, entityCode, operation });
            // In a strict environment, failure to audit might mean rolling back the transaction.
            // For now, we log the error. Ideally, this should run inside the same transaction as the change.
            // But our Repository implementation doesn't currently accept an external transaction client.
            // Acceptance: we log error.
        }
    }

    async getHistory(entityType: string, entityCode: string): Promise<AuditRecordDTO[]> {
        const query = `
      SELECT timestamp, actor_id, operation, field, old_value, new_value
      FROM registry.audit_log
      WHERE entity_type = $1 AND entity_code = $2
      ORDER BY timestamp DESC
    `;

        const result = await pool.query(query, [entityType, entityCode]);

        return result.rows.map(row => ({
            timestamp: row.timestamp.toISOString(),
            actor_id: row.actor_id,
            operation: row.operation as any,
            field: row.field,
            old_value: row.old_value,
            new_value: row.new_value
        }));
    }
}
