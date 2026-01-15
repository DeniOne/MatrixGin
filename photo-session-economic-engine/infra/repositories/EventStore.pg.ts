import { DomainEvent } from '../../application';
import { events } from '../db/schema';
import { DbConnection } from '../db/connection';

/**
 * Event Store interface.
 */
export interface EventStore {
    append(event: DomainEvent): Promise<void>;
}

/**
 * PostgreSQL implementation of EventStore.
 * Append-only. No updates. No deletes.
 */
export class EventStorePg implements EventStore {
    constructor(private readonly db: DbConnection['db']) { }

    async append(event: DomainEvent): Promise<void> {
        const sessionId = 'sessionId' in event ? (event as { sessionId: string }).sessionId : null;

        await this.db.insert(events).values({
            id: crypto.randomUUID(),
            sessionId,
            eventType: event.eventType,
            payload: event as unknown as Record<string, unknown>,
            createdAt: new Date(),
        });
    }
}
