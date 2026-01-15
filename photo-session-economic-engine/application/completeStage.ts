import { Session, SessionStatus, StageHistory } from '../domain';
import { StageCompletedEvent } from './events';

export interface CompleteStageInput {
    readonly session: Session;
    readonly userId: string;
    readonly clock: { now(): Date };
}

export interface CompleteStageResult {
    readonly session: Session;
    readonly history: StageHistory;
    readonly event: StageCompletedEvent;
}

/**
 * Transition table for completeStage.
 */
const TRANSITIONS: ReadonlyMap<SessionStatus, SessionStatus> = new Map([
    [SessionStatus.PHOTOGRAPHER_CONFIRMED, SessionStatus.SHOOTING_COMPLETED],
    [SessionStatus.SHOOTING_COMPLETED, SessionStatus.RETUSH_IN_PROGRESS],
    [SessionStatus.RETUSH_IN_PROGRESS, SessionStatus.RETUSH_COMPLETED],
    [SessionStatus.RETUSH_COMPLETED, SessionStatus.PRINT_IN_PROGRESS],
    [SessionStatus.PRINT_IN_PROGRESS, SessionStatus.PRINT_COMPLETED],
    [SessionStatus.PRINT_COMPLETED, SessionStatus.READY_FOR_DELIVERY],
    [SessionStatus.READY_FOR_DELIVERY, SessionStatus.DELIVERED],
]);

/**
 * Completes the current stage and transitions to the next status.
 *
 * Allowed transitions are defined in TRANSITIONS map.
 *
 * @throws Error if no valid transition exists for current status
 */
export function completeStage(input: CompleteStageInput): CompleteStageResult {
    const { session, userId, clock } = input;
    const fromStatus = session.currentStatus;

    const toStatus = TRANSITIONS.get(fromStatus);
    if (toStatus === undefined) {
        throw new Error(
            `Cannot complete stage: no valid transition from status ${fromStatus}`
        );
    }

    const now = clock.now();
    const durationSec = Math.floor((now.getTime() - session.updatedAt.getTime()) / 1000);

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

    const event: StageCompletedEvent = {
        eventType: 'StageCompleted',
        sessionId: session.id,
        status: fromStatus,
        durationSec,
        timestamp: now,
    };

    return { session: updatedSession, history, event };
}
