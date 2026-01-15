import { FastifyRequest, FastifyReply } from 'fastify';
import { rejectStage } from '../../application';
import { RejectStageDTO } from '../dto';
import { SessionRepository, Clock } from '../repositories';
import { notFoundError, domainError } from '../errors';

export interface RejectStageDeps {
    sessionRepo: SessionRepository;
    clock: Clock;
}

export function rejectStageController(deps: RejectStageDeps) {
    return async (
        request: FastifyRequest<{ Params: { id: string }; Body: RejectStageDTO }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const { userId, reason } = request.body;

        const session = await deps.sessionRepo.findById(id);
        if (!session) throw notFoundError('Session');

        try {
            const result = rejectStage({ session, userId, reason, clock: deps.clock });
            await deps.sessionRepo.save(result.session);
            return reply.send({ event: result.event });
        } catch (err) {
            throw domainError((err as Error).message);
        }
    };
}
