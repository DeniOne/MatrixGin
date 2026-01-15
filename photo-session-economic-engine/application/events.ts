import { SessionStatus, Role } from '../domain';

/**
 * Event emitted when a new session is created.
 */
export interface SessionCreatedEvent {
    readonly eventType: 'SessionCreated';
    readonly sessionId: string;
    readonly clientId: string;
    readonly initiatorUserId: string;
    readonly timestamp: Date;
}

/**
 * Event emitted when session status changes.
 */
export interface SessionStatusChangedEvent {
    readonly eventType: 'SessionStatusChanged';
    readonly sessionId: string;
    readonly fromStatus: SessionStatus;
    readonly toStatus: SessionStatus;
    readonly role: Role;
    readonly userId: string;
    readonly timestamp: Date;
}

/**
 * Event emitted when a stage is completed.
 */
export interface StageCompletedEvent {
    readonly eventType: 'StageCompleted';
    readonly sessionId: string;
    readonly status: SessionStatus;
    readonly durationSec: number;
    readonly timestamp: Date;
}

/**
 * Event emitted when a stage is rejected.
 * Note: This does NOT change the session status.
 */
export interface StageRejectedEvent {
    readonly eventType: 'StageRejected';
    readonly sessionId: string;
    readonly status: SessionStatus;
    readonly reason: string;
    readonly userId: string;
    readonly timestamp: Date;
}

/**
 * Event emitted when a session is assigned to a new role/user.
 */
export interface SessionAssignedEvent {
    readonly eventType: 'SessionAssigned';
    readonly sessionId: string;
    readonly role: Role;
    readonly userId: string;
    readonly timestamp: Date;
}

export type DomainEvent =
    | SessionCreatedEvent
    | SessionStatusChangedEvent
    | StageCompletedEvent
    | StageRejectedEvent
    | SessionAssignedEvent;
