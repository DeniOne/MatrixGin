import { FastifyRequest, FastifyReply } from 'fastify';
import { confirmStage } from '../../application';
import { ConfirmStageDTO } from '../dto';
import { SessionRepository, StageHistoryRepository, Clock } from '../repositories';
import { notFoundError, domainError } from '../errors';

export interface ConfirmStageDeps {
    sessionRepo: SessionRepository;
    historyRepo: StageHistoryRepository;
    clock: Clock;
}

export function confirmStageController(deps: ConfirmStageDeps) {
    return async (
        request: FastifyRequest<{ Params: { id: string }; Body: ConfirmStageDTO }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const { userId } = request.body;

        const session = await deps.sessionRepo.findById(id);
        if (!session) throw notFoundError('Session');

        try {
            const result = confirmStage({ session, userId, clock: deps.clock });
            await deps.sessionRepo.save(result.session);
            await deps.historyRepo.save(result.history);
            return reply.send({ event: result.event });
        } catch (err) {
            throw domainError((err as Error).message);
        }
    };
}
