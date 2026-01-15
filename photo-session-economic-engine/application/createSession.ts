import { Session, SessionStatus, Role, ClientSnapshot, StageHistory } from '../domain';
import { SessionCreatedEvent } from './events';

export interface CreateSessionInput {
    readonly clientId: string;
    readonly initiatorUserId: string;
    readonly clientSnapshot?: ClientSnapshot;
    readonly clock: { now(): Date };
}

export interface CreateSessionResult {
    readonly session: Session;
    readonly history: StageHistory;
    readonly event: SessionCreatedEvent;
}

/**
 * Creates a new photo session.
 *
 * - Status: PHOTOGRAPHER_PENDING
 * - Role: PHOTOGRAPHER
 * - initiatorUserId is recorded in the event only, not in Session
 */
export function createSession(input: CreateSessionInput): CreateSessionResult {
    const now = input.clock.now();
    const sessionId = generateId();

    const session: Session = {
        id: sessionId,
        clientId: input.clientId,
        clientSnapshot: input.clientSnapshot,
        currentStatus: SessionStatus.PHOTOGRAPHER_PENDING,
        currentRole: Role.PHOTOGRAPHER,
        assignedUserId: '',
        createdAt: now,
        updatedAt: now,
    };

    const history: StageHistory = {
        sessionId,
        fromStatus: SessionStatus.CREATED,
        toStatus: SessionStatus.PHOTOGRAPHER_PENDING,
        role: Role.PHOTOGRAPHER,
        userId: input.initiatorUserId,
        startedAt: now,
        endedAt: now,
    };

    const event: SessionCreatedEvent = {
        eventType: 'SessionCreated',
        sessionId,
        clientId: input.clientId,
        initiatorUserId: input.initiatorUserId,
        timestamp: now,
    };

    return { session, history, event };
}

/**
 * Simple ID generator. In production, inject a proper ID generator.
 */
function generateId(): string {
    return `ses_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}
