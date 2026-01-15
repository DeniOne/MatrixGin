import { ClientSource } from './ClientSource';

/**
 * Immutable snapshot. Never updated after creation.
 *
 * Represents the client's contact information captured at the moment
 * of session creation. Used for deferred sales and audit purposes.
 */
export interface ClientSnapshot {
    readonly clientId: string;
    readonly name?: string;
    readonly phone?: string;
    readonly email?: string;
    readonly consentGiven: boolean;
    readonly source: ClientSource;
    readonly createdAt: Date;
}
