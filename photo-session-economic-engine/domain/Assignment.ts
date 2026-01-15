import { Role } from './Role';

/**
 * Record of role assignment to a user for a session.
 */
export interface Assignment {
    readonly sessionId: string;
    readonly role: Role;
    readonly userId: string;
    readonly assignedAt: Date;
}
