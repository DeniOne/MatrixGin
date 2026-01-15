import { eq } from 'drizzle-orm';
import { StageHistory, SessionStatus, Role } from '../../domain';
import { StageHistoryRepository } from '../../api/repositories';
import { stageHistory } from '../db/schema';
import { DbConnection } from '../db/connection';

/**
 * PostgreSQL implementation of StageHistoryRepository.
 */
export class StageHistoryRepositoryPg implements StageHistoryRepository {
    constructor(private readonly db: DbConnection['db']) { }

    async findBySessionId(sessionId: string): Promise<StageHistory[]> {
        const result = await this.db
            .select()
            .from(stageHistory)
            .where(eq(stageHistory.sessionId, sessionId));

        return result.map(row => this.toDomain(row));
    }

    async save(history: StageHistory): Promise<void> {
        await this.db.insert(stageHistory).values({
            id: crypto.randomUUID(),
            sessionId: history.sessionId,
            fromStatus: history.fromStatus,
            toStatus: history.toStatus,
            role: history.role,
            userId: history.userId,
            startedAt: history.startedAt,
            endedAt: history.endedAt,
        });
    }

    private toDomain(row: typeof stageHistory.$inferSelect): StageHistory {
        return {
            sessionId: row.sessionId,
            fromStatus: row.fromStatus as SessionStatus,
            toStatus: row.toStatus as SessionStatus,
            role: row.role as Role,
            userId: row.userId ?? '',
            startedAt: row.startedAt,
            endedAt: row.endedAt ?? row.startedAt,
        };
    }
}
