import { FastifyRequest, FastifyReply } from 'fastify';
import { handoffStage } from '../../application';
import { Role } from '../../domain';
import { HandoffStageDTO } from '../dto';
import { SessionRepository, AssignmentRepository, Clock } from '../repositories';
import { notFoundError, domainError } from '../errors';

export interface HandoffStageDeps {
    sessionRepo: SessionRepository;
    assignmentRepo: AssignmentRepository;
    clock: Clock;
}

export function handoffStageController(deps: HandoffStageDeps) {
    return async (
        request: FastifyRequest<{ Params: { id: string }; Body: HandoffStageDTO }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const { nextRole, assignedUserId } = request.body;

        const session = await deps.sessionRepo.findById(id);
        if (!session) throw notFoundError('Session');

        try {
            const result = handoffStage({
                session,
                nextRole: Role[nextRole],
                assignedUserId,
                clock: deps.clock,
            });
            await deps.sessionRepo.save(result.session);
            await deps.assignmentRepo.save(result.assignment);
            return reply.send({ event: result.event });
        } catch (err) {
            throw domainError((err as Error).message);
        }
    };
}
