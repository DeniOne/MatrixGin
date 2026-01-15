/**
 * PSEE Application Layer - Barrel Export
 *
 * Use cases for PhotoSession Economic Engine.
 */

// Use Cases
export { createSession } from './createSession';
export type { CreateSessionInput, CreateSessionResult } from './createSession';

export { confirmStage } from './confirmStage';
export type { ConfirmStageInput, ConfirmStageResult } from './confirmStage';

export { rejectStage } from './rejectStage';
export type { RejectStageInput, RejectStageResult } from './rejectStage';

export { completeStage } from './completeStage';
export type { CompleteStageInput, CompleteStageResult } from './completeStage';

export { handoffStage } from './handoffStage';
export type { HandoffStageInput, HandoffStageResult } from './handoffStage';

// Events
export type {
    DomainEvent,
    SessionCreatedEvent,
    SessionStatusChangedEvent,
    StageCompletedEvent,
    StageRejectedEvent,
    SessionAssignedEvent,
} from './events';
