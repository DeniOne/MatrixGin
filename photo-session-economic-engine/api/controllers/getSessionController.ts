import { FastifyRequest, FastifyReply } from 'fastify';
import { SessionRepository, StageHistoryRepository, Clock } from '../repositories';
import { calculateFlowMetrics, calculateSLA, SLAThresholds } from '../../analytics';
import { notFoundError } from '../errors';

export interface GetSessionDeps {
    sessionRepo: SessionRepository;
    historyRepo: StageHistoryRepository;
    slaThresholds: SLAThresholds;
    clock: Clock;
}

export function getSessionController(deps: GetSessionDeps) {
    return async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const session = await deps.sessionRepo.findById(id);

        if (!session) {
            throw notFoundError('Session');
        }

        const history = await deps.historyRepo.findBySessionId(id);
        const metrics = calculateFlowMetrics({ session, history, now: deps.clock.now() });
        const sla = calculateSLA({ history, thresholds: deps.slaThresholds });

        return reply.send({
            ...session,
            metrics,
            sla: sla.statusSLA,
        });
    };
}
