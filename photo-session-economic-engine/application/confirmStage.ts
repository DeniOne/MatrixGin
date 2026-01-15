import { Session, SessionStatus, StageHistory } from '../domain';
import { SessionStatusChangedEvent } from './events';

export interface ConfirmStageInput {
    readonly session: Session;
    readonly userId: string;
    readonly clock: { now(): Date };
}

export interface ConfirmStageResult {
    readonly session: Session;
    readonly history: StageHistory;
    readonly event: SessionStatusChangedEvent;
}

/**
 * Confirms a stage.
 *
 * Allowed only if: status === PHOTOGRAPHER_PENDING
 * Effect: PHOTOGRAPHER_PENDING → PHOTOGRAPHER_CONFIRMED
 *
 * @throws Error if status is not PHOTOGRAPHER_PENDING
 */
export function confirmStage(input: ConfirmStageInput): ConfirmStageResult {
    const { session, userId, clock } = input;

    if (session.currentStatus !== SessionStatus.PHOTOGRAPHER_PENDING) {
        throw new Error(
            `Cannot confirm stage: expected status PHOTOGRAPHER_PENDING, got ${session.currentStatus}`
        );
    }

    const now = clock.now();
    const fromStatus = session.currentStatus;
    const toStatus = SessionStatus.PHOTOGRAPHER_CONFIRMED;

    const updatedSession: Session = {
        ...session,
        currentStatus: toStatus,
        updatedAt: now,
    };

    const history: StageHistory = {
        sessionId: session.id,
        fromStatus,
        toStatus,
        role: session.currentRole,
        userId,
        startedAt: session.updatedAt,
        endedAt: now,
    };

    const event: SessionStatusChangedEvent = {
        eventType: 'SessionStatusChanged',
        sessionId: session.id,
        fromStatus,
        toStatus,
        role: session.currentRole,
        userId,
        timestamp: now,
    };

    return { session: updatedSession, history, event };
}
