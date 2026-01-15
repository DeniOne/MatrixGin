/**
 * PSEE Infrastructure Layer - DI Wiring
 */

import { createDbConnection, DbConfig } from './db/connection';
import {
    SessionRepositoryPg,
    StageHistoryRepositoryPg,
    AssignmentRepositoryPg,
    EventStorePg,
} from './repositories';
import { realClock } from '../api/repositories';

export interface InfraConfig {
    database: DbConfig;
}

/**
 * Creates all infrastructure dependencies.
 */
export function createInfrastructure(config: InfraConfig) {
    const { db, client } = createDbConnection(config.database);

    const sessionRepo = new SessionRepositoryPg(db);
    const historyRepo = new StageHistoryRepositoryPg(db);
    const assignmentRepo = new AssignmentRepositoryPg(db);
    const eventStore = new EventStorePg(db);

    return {
        db,
        client,
        sessionRepo,
        historyRepo,
        assignmentRepo,
        eventStore,
        clock: realClock,
    };
}

export type Infrastructure = ReturnType<typeof createInfrastructure>;

// Re-exports
export * from './db/schema';
export * from './db/connection';
export * from './repositories';
