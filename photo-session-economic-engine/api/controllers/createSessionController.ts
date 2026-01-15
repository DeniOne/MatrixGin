import { FastifyRequest, FastifyReply } from 'fastify';
import { createSession } from '../../application';
import { ClientSource } from '../../domain';
import { CreateSessionDTO } from '../dto';
import { SessionRepository, StageHistoryRepository, Clock } from '../repositories';
import { domainError } from '../errors';

export interface CreateSessionDeps {
    sessionRepo: SessionRepository;
    historyRepo: StageHistoryRepository;
    clock: Clock;
}

export function createSessionController(deps: CreateSessionDeps) {
    return async (
        request: FastifyRequest<{ Body: CreateSessionDTO }>,
        reply: FastifyReply
    ) => {
        const { clientId, initiatorUserId, clientSnapshot } = request.body;

        try {
            const result = createSession({
                clientId,
                initiatorUserId,
                clientSnapshot: clientSnapshot
                    ? { ...clientSnapshot, source: ClientSource[clientSnapshot.source], createdAt: deps.clock.now() }
                    : undefined,
                clock: deps.clock,
            });

            await deps.sessionRepo.save(result.session);
            await deps.historyRepo.save(result.history);

            return reply.status(201).send({
                sessionId: result.session.id,
                event: result.event,
            });
        } catch (err) {
            throw domainError((err as Error).message);
        }
    };
}
