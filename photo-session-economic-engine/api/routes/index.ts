import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import {
    CreateSessionSchema,
    ConfirmStageSchema,
    RejectStageSchema,
    CompleteStageSchema,
    HandoffStageSchema,
    SessionQuerySchema,
} from '../dto';
import {
    createSessionController,
    listSessionsController,
    getSessionController,
    confirmStageController,
    rejectStageController,
    completeStageController,
    handoffStageController,
} from '../controllers';
import { SessionRepository, StageHistoryRepository, AssignmentRepository, Clock, realClock } from '../repositories';
import { SLAThresholds } from '../../analytics';
import { ApiError } from '../errors';

export interface RouteDeps {
    sessionRepo: SessionRepository;
    historyRepo: StageHistoryRepository;
    assignmentRepo: AssignmentRepository;
    slaThresholds: SLAThresholds;
    clock?: Clock;
}

export async function sessionRoutes(
    fastify: FastifyInstance,
    opts: FastifyPluginOptions & { deps: RouteDeps }
) {
    const app = fastify.withTypeProvider<TypeBoxTypeProvider>();
    const { deps } = opts;
    const clock = deps.clock ?? realClock;

    // Error handler
    app.setErrorHandler((error, request, reply) => {
        if (error instanceof ApiError) {
            return reply.status(error.statusCode).send(error.toResponse());
        }
        return reply.status(500).send({ code: 'INTERNAL_ERROR', message: error.message });
    });

    // POST /psee/sessions
    app.post('/psee/sessions', {
        schema: { body: CreateSessionSchema },
    }, createSessionController({ sessionRepo: deps.sessionRepo, historyRepo: deps.historyRepo, clock }));

    // GET /psee/sessions
    app.get('/psee/sessions', {
        schema: { querystring: SessionQuerySchema },
    }, listSessionsController({ sessionRepo: deps.sessionRepo, historyRepo: deps.historyRepo, slaThresholds: deps.slaThresholds }));

    // GET /psee/sessions/:id
    app.get('/psee/sessions/:id', {}, getSessionController({
        sessionRepo: deps.sessionRepo,
        historyRepo: deps.historyRepo,
        slaThresholds: deps.slaThresholds,
        clock,
    }));

    // POST /psee/sessions/:id/confirm
    app.post('/psee/sessions/:id/confirm', {
        schema: { body: ConfirmStageSchema },
    }, confirmStageController({ sessionRepo: deps.sessionRepo, historyRepo: deps.historyRepo, clock }));

    // POST /psee/sessions/:id/reject
    app.post('/psee/sessions/:id/reject', {
        schema: { body: RejectStageSchema },
    }, rejectStageController({ sessionRepo: deps.sessionRepo, clock }));

    // POST /psee/sessions/:id/complete
    app.post('/psee/sessions/:id/complete', {
        schema: { body: CompleteStageSchema },
    }, completeStageController({ sessionRepo: deps.sessionRepo, historyRepo: deps.historyRepo, clock }));

    // POST /psee/sessions/:id/handoff
    app.post('/psee/sessions/:id/handoff', {
        schema: { body: HandoffStageSchema },
    }, handoffStageController({ sessionRepo: deps.sessionRepo, assignmentRepo: deps.assignmentRepo, clock }));
}
