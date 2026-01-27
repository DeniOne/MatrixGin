export enum FoundationStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    ACCEPTED = 'ACCEPTED',
    NOT_ACCEPTED = 'NOT_ACCEPTED',
    VERSION_MISMATCH = 'VERSION_MISMATCH'
}

export enum FoundationBlockType {
    CONSTITUTION = 'CONSTITUTION',
    CODEX = 'CODEX',
    GOLDEN_STANDARD = 'GOLDEN_STANDARD',
    ROLE_MODEL = 'ROLE_MODEL',
    MOTIVATION = 'MOTIVATION'
}

export interface FoundationBlock {
    id: FoundationBlockType;
    materialId: string;
    title: string;
    description: string;
    contentText?: string;
    videoUrl?: string;
    isVideoRequired: boolean;
    isMethodologyViolated?: boolean;
    order: number;
    mandatory: boolean;
    status: 'LOCKED' | 'OPEN' | 'COMPLETED';
    isUnlocked: boolean;
    isCompleted: boolean;
}

export interface ImmersionState {
    status: FoundationStatus;
    currentVersion: string;
    blocks: FoundationBlock[];
    canAccept: boolean;
    acceptedAt?: string;
}

export interface BlockViewPayload {
    blockId: FoundationBlockType;
}

export interface DecisionPayload {
    decision: 'ACCEPT' | 'DECLINE';
}
