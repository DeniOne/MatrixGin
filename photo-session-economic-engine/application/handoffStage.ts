import { Session, Role, Assignment } from '../domain';
import { SessionAssignedEvent } from './events';

export interface HandoffStageInput {
    readonly session: Session;
    readonly nextRole: Role;
    readonly assignedUserId: string;
    readonly clock: { now(): Date };
}

export interface HandoffStageResult {
    readonly session: Session;
    readonly assignment: Assignment;
    readonly event: SessionAssignedEvent;
}

/**
 * Hands off the session to a new role/user.
 *
 * Effect:
 * - Changes currentRole to nextRole
 * - Creates Assignment record
 * - STATUS DOES NOT CHANGE
 */
export function handoffStage(input: HandoffStageInput): HandoffStageResult {
    const { session, nextRole, assignedUserId, clock } = input;
    const now = clock.now();

    const updatedSession: Session = {
        ...session,
        currentRole: nextRole,
        assignedUserId,
        updatedAt: now,
    };

    const assignment: Assignment = {
        sessionId: session.id,
        role: nextRole,
        userId: assignedUserId,
        assignedAt: now,
    };

    const event: SessionAssignedEvent = {
        eventType: 'SessionAssigned',
        sessionId: session.id,
        role: nextRole,
        userId: assignedUserId,
        timestamp: now,
    };

    return { session: updatedSession, assignment, event };
}
