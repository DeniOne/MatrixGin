/**
 * TypeScript types for Participation Status & Ranks
 */

export interface ParticipationStatus {
    code: string;
    description: string;
    governanceFlags: {
        can_mentor?: boolean;
        vote_weight?: number;
        can_propose_ideas?: boolean;
        can_vote_on_ideas?: boolean;
        can_review_proposals?: boolean;
        can_approve_governance?: boolean;
    };
    isActive: boolean;
}

export interface UserParticipationStatus {
    id: string;
    userId: string;
    statusCode: string;
    statusDescription: string;
    governanceFlags: any;
    assignedAt: Date;
    assignedBy: string;
    reason: string;
}

export interface StatusHistoryEntry {
    id: string;
    userId: string;
    oldStatus: string | null;
    newStatus: string;
    reason: string;
    changedAt: Date;
    changedBy: string;
}

export interface ParticipationRank {
    code: string;
    description: string;
    minGmc: number;
    minDurationDays: number;
    isActive: boolean;
}

export interface UserParticipationRank {
    userId: string;
    rankCode: string;
    rankDescription: string;
    gmcBalance: number;
    calculatedAt: Date;
}

export interface AssignStatusRequest {
    userId: string;
    statusCode: string;
    reason: string;
}
