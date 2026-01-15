import { Session, SessionStatus } from '../domain';
import { StageRejectedEvent } from './events';

export interface RejectStageInput {
    readonly session: Session;
    readonly userId: string;
    readonly reason: string;
    readonly clock: { now(): Date };
}

export interface RejectStageResult {
    readonly session: Session;
    readonly event: StageRejectedEvent;
}

/**
 * Rejects a stage.
 *
 * Allowed only if: status === PHOTOGRAPHER_PENDING
 * Effect: STATUS DOES NOT CHANGE — only creates a rejection event
 *
 * @throws Error if status is not PHOTOGRAPHER_PENDING
 */
export function rejectStage(input: RejectStageInput): RejectStageResult {
    const { session, userId, reason, clock } = input;

    if (session.currentStatus !== SessionStatus.PHOTOGRAPHER_PENDING) {
        throw new Error(
            `Cannot reject stage: expected status PHOTOGRAPHER_PENDING, got ${session.currentStatus}`
        );
    }

    const now = clock.now();

    // Session remains unchanged (status does not change)
    const unchangedSession: Session = {
        ...session,
        updatedAt: now,
    };

    const event: StageRejectedEvent = {
        eventType: 'StageRejected',
        sessionId: session.id,
        status: session.currentStatus,
        reason,
        userId,
        timestamp: now,
    };

    return { session: unchangedSession, event };
}
