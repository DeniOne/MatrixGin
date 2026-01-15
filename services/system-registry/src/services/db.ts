import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const config: PoolConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
};

export const pool = new Pool(config);

pool.on('error', (err, client) => {
    logger.error('Unexpected error on idle client', err);
});

export async function checkDatabaseConnection() {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT NOW()');
        client.release();
        logger.info(`Database connected successfully: ${res.rows[0].now}`);
    } catch (err) {
        logger.error('Database connection failed', err);
        process.exit(1);
    }
}
