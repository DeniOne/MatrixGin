/**
 * Foundation Immersion Blocks
 * CANON v2.2: Mandatory Admission Scope
 * 
 * These are NOT courses. They are fundamental distinct implementation units.
 * Users must "view" (audit log) all blocks before they can Accept the Foundation.
 */

export const FOUNDATION_VERSION = 'v1.0';

export enum FoundationBlockType {
    CONSTITUTION = 'CONSTITUTION',
    CODEX = 'CODEX',
    GOLDEN_STANDARD = 'GOLDEN_STANDARD',
    ROLE_MODEL = 'ROLE_MODEL',
    MOTIVATION = 'MOTIVATION'
}

export interface FoundationBlock {
    id: FoundationBlockType;
    title: string;
    description: string;
    order: number;
    mandatory: boolean; // Always true for this set
}

export const FOUNDATION_BLOCKS: FoundationBlock[] = [
    {
        id: FoundationBlockType.CONSTITUTION,
        title: 'Constitution',
        description: ' The Supreme Law of the Corporation. Rights, Hierarchy, and Power.',
        order: 1,
        mandatory: true
    },
    {
        id: FoundationBlockType.CODEX,
        title: 'Corporate Codex',
        description: 'Anti-Fraud Policy, Honor Code, and Ethical Red Lines.',
        order: 2,
        mandatory: true
    },
    {
        id: FoundationBlockType.GOLDEN_STANDARD,
        title: 'Golden Standard',
        description: 'Cultural Values: "Client is Guest", "cleanliness", "speed".',
        order: 3,
        mandatory: true
    },
    {
        id: FoundationBlockType.ROLE_MODEL,
        title: 'Role Model (MDR)',
        description: 'How Roles, Results, and Responsibility Zones work.',
        order: 4,
        mandatory: true
    },
    {
        id: FoundationBlockType.MOTIVATION,
        title: 'Motivation Core',
        description: 'The Economy: MC, GMC, and how to earn.',
        order: 5,
        mandatory: true
    }
];
