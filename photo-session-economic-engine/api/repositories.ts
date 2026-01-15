import { Session, StageHistory, Assignment } from '../domain';

/**
 * Query parameters for findAll.
 * Plain query, no FSM logic.
 */
export interface SessionQueryParams {
    status?: string;
    role?: string;
    assignedUserId?: string;
}

/**
 * Session repository interface.
 * Implementation provided by Infrastructure layer.
 */
export interface SessionRepository {
    findById(id: string): Promise<Session | null>;
    findAll(params: SessionQueryParams): Promise<Session[]>;
    save(session: Session): Promise<void>;
}

/**
 * StageHistory repository interface.
 */
export interface StageHistoryRepository {
    findBySessionId(sessionId: string): Promise<StageHistory[]>;
    save(history: StageHistory): Promise<void>;
}

/**
 * Assignment repository interface.
 */
export interface AssignmentRepository {
    findBySessionId(sessionId: string): Promise<Assignment[]>;
    save(assignment: Assignment): Promise<void>;
}

/**
 * Clock interface for DI.
 */
export interface Clock {
    now(): Date;
}

/**
 * Real clock implementation.
 */
export const realClock: Clock = {
    now: () => new Date(),
};
