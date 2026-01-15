import { SessionStatus } from './SessionStatus';
import { Role } from './Role';
import { ClientSnapshot } from './ClientSnapshot';

/**
 * Aggregate root representing a photo session.
 */
export interface Session {
    readonly id: string;
    readonly clientId: string;
    readonly clientSnapshot?: ClientSnapshot;
    readonly currentStatus: SessionStatus;
    readonly currentRole: Role;
    readonly assignedUserId: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
