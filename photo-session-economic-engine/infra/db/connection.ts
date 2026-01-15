import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export interface DbConfig {
    connectionString: string;
}

/**
 * Creates a database connection.
 */
export function createDbConnection(config: DbConfig) {
    const client = postgres(config.connectionString, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
    });
    const db = drizzle(client, { schema });
    return { db, client };
}

export type DbConnection = ReturnType<typeof createDbConnection>;
