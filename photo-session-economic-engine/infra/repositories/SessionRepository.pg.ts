import { eq } from 'drizzle-orm';
import { Session, SessionStatus, Role, ClientSnapshot, ClientSource } from '../../domain';
import { SessionRepository, SessionQueryParams } from '../../api/repositories';
import { sessions } from '../db/schema';
import { DbConnection } from '../db/connection';

/**
 * PostgreSQL implementation of SessionRepository.
 */
export class SessionRepositoryPg implements SessionRepository {
    constructor(private readonly db: DbConnection['db']) { }

    async findById(id: string): Promise<Session | null> {
        const result = await this.db
            .select()
            .from(sessions)
            .where(eq(sessions.id, id))
            .limit(1);

        if (result.length === 0) return null;
        return this.toDomain(result[0]);
    }

    async findAll(params: SessionQueryParams): Promise<Session[]> {
        try {
            // Basic query without smart filtering
            const result = await this.db.select().from(sessions);

            // Simple in-memory filtering (no FSM logic)
            return result
                .filter(row => {
                    if (params.status && row.currentStatus !== params.status) return false;
                    if (params.role && row.sessionRole !== params.role) return false;
                    if (params.assignedUserId && row.assignedUserId !== params.assignedUserId) return false;
                    return true;
                })
                .map(row => this.toDomain(row));
        } catch (error) {
            console.error('SessionRepository.findAll error:', error);
            throw error;
        }
    }

    async save(session: Session): Promise<void> {
        await this.db
            .insert(sessions)
            .values({
                id: session.id,
                clientSnapshot: session.clientSnapshot ?? {},
                currentStatus: session.currentStatus,
                sessionRole: session.currentRole,
                assignedUserId: session.assignedUserId || null,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt,
            })
            .onConflictDoUpdate({
                target: sessions.id,
                set: {
                    clientSnapshot: session.clientSnapshot ?? {},
                    currentStatus: session.currentStatus,
                    sessionRole: session.currentRole,
                    assignedUserId: session.assignedUserId || null,
                    updatedAt: session.updatedAt,
                },
            });
    }

    private toDomain(row: typeof sessions.$inferSelect): Session {
        const snapshot = row.clientSnapshot as Record<string, unknown> | null;
        return {
            id: row.id,
            clientId: (snapshot?.clientId as string) ?? row.id,
            clientSnapshot: snapshot ? {
                clientId: snapshot.clientId as string,
                name: snapshot.name as string | undefined,
                phone: snapshot.phone as string | undefined,
                email: snapshot.email as string | undefined,
                consentGiven: snapshot.consentGiven as boolean,
                source: snapshot.source as ClientSource,
                createdAt: new Date(snapshot.createdAt as string),
            } : undefined,
            currentStatus: row.currentStatus as SessionStatus,
            currentRole: row.sessionRole as Role,
            assignedUserId: row.assignedUserId ?? '',
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
    }
}
