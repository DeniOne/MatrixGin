import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { sessionRoutes } from './api/routes';
import { createInfrastructure } from './infra';
import { SLAThresholds } from './analytics';

const PORT = Number(process.env.PSEE_PORT) || 3001;
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/matrixgin_dev';

// Default SLA thresholds (seconds)
const defaultSLAThresholds: SLAThresholds = {
    PHOTOGRAPHER_PENDING: { warnSec: 1800, breachSec: 3600 },
    PHOTOGRAPHER_CONFIRMED: { warnSec: 3600, breachSec: 7200 },
    SHOOTING_COMPLETED: { warnSec: 1800, breachSec: 3600 },
    RETUSH_IN_PROGRESS: { warnSec: 7200, breachSec: 14400 },
    RETUSH_COMPLETED: { warnSec: 1800, breachSec: 3600 },
    PRINT_IN_PROGRESS: { warnSec: 3600, breachSec: 7200 },
    PRINT_COMPLETED: { warnSec: 1800, breachSec: 3600 },
    READY_FOR_DELIVERY: { warnSec: 3600, breachSec: 7200 },
};

async function main() {
    // Create infrastructure (DI)
    const infra = createInfrastructure({
        database: { connectionString: DATABASE_URL },
    });

    // Create Fastify instance
    const app = Fastify({
        logger: {
            level: 'info',
        },
    }).withTypeProvider<TypeBoxTypeProvider>();

    // Health check endpoint
    app.get('/health', async () => {
        return { status: 'ok', service: 'psee', timestamp: new Date().toISOString() };
    });

    // Register PSEE API routes
    await app.register(sessionRoutes, {
        deps: {
            sessionRepo: infra.sessionRepo,
            historyRepo: infra.historyRepo,
            assignmentRepo: infra.assignmentRepo,
            slaThresholds: defaultSLAThresholds,
            clock: infra.clock,
        },
    });

    // Graceful shutdown
    const shutdown = async () => {
        console.log('Shutting down PSEE...');
        await app.close();
        await infra.client.end();
        process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    // Start server
    try {
        await app.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`PSEE running at http://localhost:${PORT}`);
        console.log(`Health: http://localhost:${PORT}/health`);
        console.log(`API: http://localhost:${PORT}/psee/sessions`);
    } catch (err) {
        console.error('Failed to start PSEE:', err);
        process.exit(1);
    }
}

main();
