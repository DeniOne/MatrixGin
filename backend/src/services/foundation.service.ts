import { prisma } from '../config/prisma';
import { FOUNDATION_BLOCKS, FOUNDATION_VERSION, FoundationBlockType, FoundationStatus } from '../config/foundation.constants';
import { FoundationDecision } from '@prisma/client';
import { logger } from '../config/logger';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class FoundationService {
    private static instance: FoundationService;
    private eventEmitter: EventEmitter2;

    private constructor(eventEmitter?: EventEmitter2) {
        this.eventEmitter = eventEmitter || new EventEmitter2();
    }

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

        // 2. Fetch Materials for content
        const materialIds = FOUNDATION_BLOCKS.map(b => b.materialId);
        const materials = await prisma.material.findMany({
            where: { id: { in: materialIds } },
            select: { id: true, content_text: true, content_url: true, is_video_required: true }
        });
        const materialMap = new Map(materials.map(m => [m.id, { text: m.content_text, url: m.content_url, required: m.is_video_required }]));

        // 3. Calculate Block Progress (from Audit Log)
        const blockLogs = await prisma.foundationAuditLog.findMany({
            where: {
                user_id: userId,
                event_type: 'BLOCK_VIEWED',
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

        const blocks = FOUNDATION_BLOCKS.map(block => {
            const material = materialMap.get(block.materialId);

            // Critical Methodology Check: If video is required but content_url is missing
            const isMethodologyViolated = material?.required && !material?.url;

            return {
                ...block,
                contentText: material?.text || '',
                videoUrl: material?.url || undefined,
                isVideoRequired: material?.required || false,
                isMethodologyViolated
            };
        });

        // 4. Final state calculation
        let status: FoundationStatus = FoundationStatus.NOT_STARTED;

        if (isAccepted) {
            status = isVersionMatch ? FoundationStatus.ACCEPTED : FoundationStatus.VERSION_MISMATCH;
        } else if (viewedBlockIds.size > 0) {
            status = FoundationStatus.IN_PROGRESS;
        }

        // Sequential locking logic
        let previousCompleted = true;
        const blocksWithLocking = blocks.map((block, index) => {
            const isCompleted = viewedBlockIds.has(block.id);
            // Block is unlocked if previously completed OR if it's the 1st block OR if already accepted
            const isUnlocked = index === 0 || previousCompleted || isAccepted;

            if (!isCompleted) previousCompleted = false;

            return {
                ...block,
                isUnlocked,
                isCompleted
            };
        });

        try {
            return {
                status,
                currentVersion: FOUNDATION_VERSION,
                blocks: blocksWithLocking,
                canAccept: viewedBlockIds.size === FOUNDATION_BLOCKS.length,
                acceptedAt: (acceptance?.accepted_at instanceof Date) ? acceptance.accepted_at.toISOString() : undefined
            };
        } catch (error: any) {
            logger.error('CRITICAL ERROR in getImmersionState (return block):', {
                error: error.message,
                stack: error.stack,
                userId,
                acceptanceExists: !!acceptance,
                accepted_at: acceptance?.accepted_at
            });
            throw error;
        }
    }

    /**
     * Register that a user has viewed a block
     */
    /**
     * Register that a user has viewed a block
     */
    async registerBlockView(userId: string, blockId: string, source: string = 'API') {
        const blockIndex = FOUNDATION_BLOCKS.findIndex(b => b.id === blockId);
        if (blockIndex === -1) {
            throw new Error('Invalid Foundation Block ID');
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            // @ts-ignore - added via migration
            select: { foundation_progress: true, foundation_status: true }
        });

        if (!user) throw new Error('User not found');

        // Sequential Check: Only allow increment if viewing exactly the NEXT block
        // @ts-ignore
        const currentProgress = user.foundation_progress || 0;
        let newProgress = currentProgress;

        if (blockIndex === currentProgress) {
            newProgress = currentProgress + 1;
        }

        // Standard Audit Log
        await prisma.foundationAuditLog.create({
            data: {
                user_id: userId,
                event_type: 'FOUNDATION_BLOCK_VIEWED',
                foundation_version: FOUNDATION_VERSION,
                timestamp: new Date(),
                metadata: {
                    userId,
                    action: 'FOUNDATION_BLOCK_VIEWED',
                    block: blockIndex + 1,
                    blockId,
                    version: FOUNDATION_VERSION,
                    source,
                    progressAfter: newProgress
                }
            }
        });

        // Update User State
        await prisma.user.update({
            where: { id: userId },
            data: {
                // @ts-ignore
                foundation_progress: newProgress,
                foundation_current_block_id: blockId,
                // @ts-ignore
                foundation_status: newProgress > 0 && user.foundation_status === 'NOT_STARTED'
                    ? 'IN_PROGRESS'
                    : user.foundation_status
            }
        });

        return { success: true, currentProgress: newProgress };
    }

    /**
     * Submit decision on 'Base' (Foundation)
     * CANON: Accepted, Not_Accepted
     */
    async submitDecision(userId: string, decision: 'ACCEPT' | 'DECLINE', source: string = 'API') {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            // @ts-ignore
            select: { foundation_progress: true, foundation_status: true }
        });

        if (!user) throw new Error('User not found');

        if (decision === 'ACCEPT') {
            // Guard: All blocks must be viewed
            // @ts-ignore
            if (user.foundation_progress < FOUNDATION_BLOCKS.length) {
                await this.logGatingViolation(userId, 'SUBMIT_DECISION_INCOMPLETE_PROGRESS', {
                    // @ts-ignore
                    currentProgress: user.foundation_progress,
                    requiredProgress: FOUNDATION_BLOCKS.length
                });
                throw new Error('FOUNDATION_REQUIRED: Необходимо ознакомиться со всеми блоками Базы перед принятием.');
            }

            // Acceptance Record
            await prisma.foundationAcceptance.upsert({
                where: { person_id: userId },
                create: {
                    person_id: userId,
                    decision: FoundationDecision.ACCEPTED,
                    version: FOUNDATION_VERSION,
                    accepted_at: new Date()
                },
                update: {
                    decision: FoundationDecision.ACCEPTED,
                    version: FOUNDATION_VERSION,
                    accepted_at: new Date()
                }
            });

            await prisma.user.update({
                where: { id: userId },
                data: {
                    // @ts-ignore
                    foundation_status: 'ACCEPTED',
                    // @ts-ignore
                    admission_status: 'BASE_ACCEPTED',
                    base_accepted_at: new Date(),
                    base_version: FOUNDATION_VERSION
                }
            });

            // Standard Audit Log
            await prisma.foundationAuditLog.create({
                data: {
                    user_id: userId,
                    event_type: 'FOUNDATION_ACCEPTED',
                    foundation_version: FOUNDATION_VERSION,
                    timestamp: new Date(),
                    metadata: {
                        userId,
                        action: 'FOUNDATION_ACCEPTED',
                        version: FOUNDATION_VERSION,
                        source,
                    }
                }
            });

            // Emit event for business effects (e.g., unlocking tasks)
            this.eventEmitter.emit('foundation.accepted', {
                userId,
                version: FOUNDATION_VERSION,
                timestamp: new Date()
            });

            return { success: true, status: 'ACCEPTED' };
        } else {
            await prisma.foundationAuditLog.create({
                data: {
                    user_id: userId,
                    event_type: 'FOUNDATION_DECLINED',
                    foundation_version: FOUNDATION_VERSION,
                    timestamp: new Date(),
                    metadata: {
                        userId,
                        action: 'FOUNDATION_DECLINED',
                        source
                    }
                }
            });
            // @ts-ignore
            return { success: true, status: user.foundation_status };
        }
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
