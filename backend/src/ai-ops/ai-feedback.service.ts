/**
 * PHASE 4.5 - AI Feedback Loop
 * Service: AI Feedback Management
 * 
 * Canon: Feedback ≠ Control, Feedback ≠ Learning
 * Purpose: Collect user feedback on AI recommendations (read-only, immutable)
 */

import { Injectable, ConflictException, UnprocessableEntityException, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SubmitFeedbackDto, FeedbackType } from './dto/submit-feedback.dto';
import { FeedbackResponseDto } from './dto/feedback-response.dto';
import { feedbackEthicsGuard } from './feedback-ethics.guard';

const prisma = new PrismaClient();

@Injectable()
export class AIFeedbackService {
    private readonly logger = new Logger(AIFeedbackService.name);

    /**
     * Submit user feedback on AI recommendation
     * 
     * Idempotency: 1 feedback per user per recommendation
     * Ethics: No auto-learning, no control transfer
     */
    async submitFeedback(
        userId: string,
        dto: SubmitFeedbackDto
    ): Promise<FeedbackResponseDto> {
        // 1. Sanitize comment (trim whitespace)
        const sanitizedComment = dto.comment?.trim() || null;

        // 2. PHASE 4.5 - Ethics Guard validation
        if (sanitizedComment) {
            const ethicsResult = feedbackEthicsGuard.validate(sanitizedComment);
            if (!ethicsResult.valid) {
                this.logger.warn(
                    `Ethics violation in feedback: ${ethicsResult.violationType} - user ${userId}`
                );
                throw new UnprocessableEntityException(ethicsResult.reason);
            }
        }

        // 3. Attempt to create feedback (idempotency via unique constraint)
        try {
            const feedback = await prisma.aIFeedback.create({
                data: {
                    userId,
                    recommendationId: dto.recommendationId,
                    feedbackType: dto.feedbackType as any, // Prisma enum mapping
                    comment: sanitizedComment,
                    // PHASE 4.5 - Context Binding (P45-PR-03)
                    basedOnSnapshotId: dto.basedOnSnapshotId || null,
                    aiVersion: dto.aiVersion || null,
                    ruleSetVersion: dto.ruleSetVersion || null,
                },
            });

            this.logger.log(
                `Feedback submitted: ${feedback.id} by user ${userId} on recommendation ${dto.recommendationId}`
            );

            return {
                id: feedback.id,
                recommendationId: feedback.recommendationId,
                feedbackType: feedback.feedbackType as FeedbackType,
                timestamp: feedback.timestamp.toISOString(),
            };
        } catch (error: any) {
            // Prisma P2002 = unique constraint violation (duplicate feedback)
            if (error.code === 'P2002') {
                this.logger.warn(
                    `Duplicate feedback attempt: user ${userId} on recommendation ${dto.recommendationId}`
                );
                throw new ConflictException(
                    'You have already submitted feedback for this recommendation'
                );
            }

            // Re-throw other errors
            this.logger.error('Error submitting feedback', error);
            throw error;
        }
    }

    /**
     * PHASE 4.5 - Get aggregated feedback analytics
     * 
     * Returns aggregated statistics WITHOUT user-level breakdown
     * For internal AI team use only
     */
    async getAnalytics(): Promise<any> {
        // Get all feedback (no user filtering - aggregated only)
        const allFeedback = await prisma.aIFeedback.findMany({
            select: {
                feedbackType: true,
                timestamp: true,
                // Explicitly exclude userId and comment for privacy
            },
        });

        const total = allFeedback.length;

        // Count by type
        const byType = {
            HELPFUL: allFeedback.filter(f => f.feedbackType === 'HELPFUL').length,
            NOT_APPLICABLE: allFeedback.filter(f => f.feedbackType === 'NOT_APPLICABLE').length,
            UNSURE: allFeedback.filter(f => f.feedbackType === 'UNSURE').length,
        };

        // Calculate percentages
        const percentages = {
            helpful: total > 0 ? Math.round((byType.HELPFUL / total) * 100) : 0,
            notApplicable: total > 0 ? Math.round((byType.NOT_APPLICABLE / total) * 100) : 0,
            unsure: total > 0 ? Math.round((byType.UNSURE / total) * 100) : 0,
        };

        // Get period range
        const timestamps = allFeedback.map(f => f.timestamp);
        const periodStart = timestamps.length > 0
            ? new Date(Math.min(...timestamps.map(t => t.getTime()))).toISOString()
            : new Date().toISOString();
        const periodEnd = timestamps.length > 0
            ? new Date(Math.max(...timestamps.map(t => t.getTime()))).toISOString()
            : new Date().toISOString();

        this.logger.log(`Analytics generated: ${total} total feedback entries`);

        return {
            totalFeedback: total,
            byType,
            percentages,
            periodStart,
            periodEnd,
            generatedAt: new Date().toISOString(),
        };
    }
}

export const aiFeedbackService = new AIFeedbackService();
