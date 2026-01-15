import { SessionStatus } from './SessionStatus';
import { Role } from './Role';

/**
 * Immutable snapshot. Never updated after creation.
 *
 * Audit trail record for a single stage transition.
 * Forms the basis for SLA calculations and bottleneck analysis.
 */
export interface StageHistory {
    readonly sessionId: string;
    readonly fromStatus: SessionStatus;
    readonly toStatus: SessionStatus;
    readonly role: Role;
    readonly userId: string;
    readonly startedAt: Date;
    readonly endedAt: Date;
}
