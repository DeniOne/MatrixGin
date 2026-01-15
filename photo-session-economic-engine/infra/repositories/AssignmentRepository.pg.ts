import { eq } from 'drizzle-orm';
import { Assignment, Role } from '../../domain';
import { AssignmentRepository } from '../../api/repositories';
import { assignments } from '../db/schema';
import { DbConnection } from '../db/connection';

/**
 * PostgreSQL implementation of AssignmentRepository.
 */
export class AssignmentRepositoryPg implements AssignmentRepository {
    constructor(private readonly db: DbConnection['db']) { }

    async findBySessionId(sessionId: string): Promise<Assignment[]> {
        const result = await this.db
            .select()
            .from(assignments)
            .where(eq(assignments.sessionId, sessionId));

        return result.map(row => this.toDomain(row));
    }

    async save(assignment: Assignment): Promise<void> {
        await this.db.insert(assignments).values({
            id: crypto.randomUUID(),
            sessionId: assignment.sessionId,
            role: assignment.role,
            assignedUserId: assignment.userId,
            createdAt: assignment.assignedAt,
        });
    }

    private toDomain(row: typeof assignments.$inferSelect): Assignment {
        return {
            sessionId: row.sessionId,
            role: row.role as Role,
            userId: row.assignedUserId,
            assignedAt: row.createdAt,
        };
    }
}
