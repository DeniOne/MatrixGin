import { prisma } from '../config/prisma';
import { FOUNDATION_BLOCKS, FOUNDATION_VERSION, FoundationBlockType } from '../config/foundation.constants';
import { FoundationDecision } from '@prisma/client';
import { logger } from '../config/logger';

export class FoundationService {
    private static instance: FoundationService;

    private constructor() { }

    public static getInstance(): FoundationService {
        if (!FoundationService.instance) {
            FoundationService.instance = new FoundationService();
        }
        return FoundationService.instance;
    }

    /**
     * Get user's Immersion Progress and Acceptance Status
     */
    async getImmersionState(userId: string) {
        // 1. Check Acceptance
        const acceptance = await prisma.foundationAcceptance.findUnique({
            where: { person_id: userId }
        });

        const isAccepted = acceptance?.decision === FoundationDecision.ACCEPTED;
        const isVersionMatch = acceptance?.version === FOUNDATION_VERSION;

        // 2. Calculate Block Progress (from Audit Log)
        // We look for 'BLOCK_VIEWED' events for the current version
        const blockLogs = await prisma.foundationAuditLog.findMany({
            where: {
                user_id: userId,
                event_type: 'BLOCK_VIEWED',
                // Optional: filter by version in metadata if we want strict versioning on blocks
                // For now, allow any view, but cleaner to check metadata path
            },
            select: { metadata: true }
        });

        // Extract viewed block IDs
        const viewedBlockIds = new Set<string>();
        blockLogs.forEach(log => {
            const meta = log.metadata as any;
            if (meta?.blockId && meta?.version === FOUNDATION_VERSION) {
                viewedBlockIds.add(meta.blockId);
            }
        });

        const blocks = FOUNDATION_BLOCKS.map(block => ({
            ...block,
            status: viewedBlockIds.has(block.id) ? 'COMPLETED' : 'LOCKED' // or OPEN based on order
        }));

        // Basic sequential locking logic for frontend convenience
        // If order N is not completed, N+1 is locked.
        let previousCompleted = true;
        const blocksWithLocking = blocks.map(block => {
            const isCompleted = block.status === 'COMPLETED';
            const isUnlocked = previousCompleted;
            if (!isCompleted) previousCompleted = false; // Next one will be locked

            return {
                ...block,
                isUnlocked,
                isCompleted
            };
        });

        return {
            accepted: isAccepted && isVersionMatch,
            acceptanceRecord: acceptance,
            currentVersion: FOUNDATION_VERSION,
            blocks: blocksWithLocking,
            canAccept: viewedBlockIds.size === FOUNDATION_BLOCKS.length
        };
    }

    /**
     * Register that a user has viewed a block
     */
    async registerBlockView(userId: string, blockId: string) {
        // Validate Block ID
        const isValidBlock = FOUNDATION_BLOCKS.some(b => b.id === blockId);
        if (!isValidBlock) {
            throw new Error('Invalid Foundation Block ID');
        }

        // Idempotency: Check if already viewed to avoid spamming Audit Log?
        // Canon: Audit Log is append-only. Repetitive views are fine, but we can debounce if needed.
        // Strategies:
        // A) Log every view (Good for analytics: "read it 5 times")
        // B) Log unique only
        // Let's log unique per day or just log it. "BLOCK_VIEWED" implies an action.

        // Let's check if already viewed for this version to keep log clean (optional)
        const existing = await prisma.foundationAuditLog.findFirst({
            where: {
                user_id: userId,
                event_type: 'BLOCK_VIEWED',
                metadata: {
                    path: ['blockId'],
                    equals: blockId
                }
            }
        });

        // Actually, Prisma JSON filtering is tricky. Let's just create.
        await prisma.foundationAuditLog.create({
            data: {
                user_id: userId,
                event_type: 'BLOCK_VIEWED',
                timestamp: new Date(),
                metadata: {
                    blockId,
                    version: FOUNDATION_VERSION,
                    userAgent: 'API' // Context could be passed
                }
            }
        });

        return { success: true };
    }

    /**
     * Assert user has accepted current Foundation version
     * Throws error if not accepted or version mismatch
     */
    async assertFoundationAccessForApplied(userId: string) {
        const acceptance = await prisma.foundationAcceptance.findUnique({
            where: { person_id: userId }
        });

        if (!acceptance || acceptance.decision !== FoundationDecision.ACCEPTED) {
            await this.logGatingViolation(userId, 'ACCESS_DENIED_NO_ACCEPTANCE');
            throw new Error('FOUNDATION_REQUIRED: You must accept the Foundation to access Applied content.');
        }

        if (acceptance.version !== FOUNDATION_VERSION) {
            await this.logGatingViolation(userId, 'ACCESS_DENIED_VERSION_MISMATCH', {
                userVersion: acceptance.version,
                requiredVersion: FOUNDATION_VERSION
            });
            throw new Error(`FOUNDATION_VERSION_OUTDATED: Your acceptance is for version ${acceptance.version}, but ${FOUNDATION_VERSION} is required.`);
        }
    }

    /**
     * Internal audit logging for gating violations
     */
    private async logGatingViolation(userId: string, reason: string, extraMetadata: any = {}) {
        await prisma.foundationAuditLog.create({
            data: {
                user_id: userId,
                event_type: 'BLOCKED_ACCESS',
                foundation_version: FOUNDATION_VERSION,
                metadata: {
                    reason,
                    context: 'ENROLLMENT_GATE',
                    timestamp: new Date(),
                    ...extraMetadata
                }
            }
        });
    }
}

export const foundationService = FoundationService.getInstance();
