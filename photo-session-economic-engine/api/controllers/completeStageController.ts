import { FastifyRequest, FastifyReply } from 'fastify';
import { completeStage } from '../../application';
import { CompleteStageDTO } from '../dto';
import { SessionRepository, StageHistoryRepository, Clock } from '../repositories';
import { notFoundError, domainError } from '../errors';

export interface CompleteStageDeps {
    sessionRepo: SessionRepository;
    historyRepo: StageHistoryRepository;
    clock: Clock;
}

export function completeStageController(deps: CompleteStageDeps) {
    return async (
        request: FastifyRequest<{ Params: { id: string }; Body: CompleteStageDTO }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const { userId } = request.body;

        const session = await deps.sessionRepo.findById(id);
        if (!session) throw notFoundError('Session');

        try {
            const result = completeStage({ session, userId, clock: deps.clock });
            await deps.sessionRepo.save(result.session);
            await deps.historyRepo.save(result.history);
            return reply.send({ event: result.event });
        } catch (err) {
            throw domainError((err as Error).message);
        }
    };
}
