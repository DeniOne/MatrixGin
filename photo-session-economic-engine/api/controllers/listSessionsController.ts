import { FastifyRequest, FastifyReply } from 'fastify';
import { SessionQueryParams } from '../dto';
import { SessionRepository, StageHistoryRepository } from '../repositories';
import { calculateSLA } from '../../analytics';
import { SLAThresholds } from '../../analytics';

export interface ListSessionsDeps {
    sessionRepo: SessionRepository;
    historyRepo: StageHistoryRepository;
    slaThresholds: SLAThresholds;
}

export function listSessionsController(deps: ListSessionsDeps) {
    return async (
        request: FastifyRequest<{ Querystring: SessionQueryParams }>,
        reply: FastifyReply
    ) => {
        const params = request.query;
        const sessions = await deps.sessionRepo.findAll(params);

        const result = await Promise.all(
            sessions.map(async (session) => {
                const history = await deps.historyRepo.findBySessionId(session.id);
                const sla = calculateSLA({ history, thresholds: deps.slaThresholds });
                return { ...session, sla: sla.statusSLA };
            })
        );

        return reply.send(result);
    };
}
