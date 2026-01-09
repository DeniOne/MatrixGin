/**
 * Trainer Service
 * Handles Trainer Institute functionality
 */


import { prisma } from '../config/prisma';

export class TrainerService {
    /**
     * Get all trainers with filters
     */
    async getTrainers(filters?: {
        specialty?: 'PHOTOGRAPHER' | 'SALES' | 'DESIGNER';
        status?: string;
        minRating?: number;
    }) {
        const where: any = {};

        if (filters?.specialty) {
            where.specialty = filters.specialty;
        }

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.minRating) {
            where.rating = {
                gte: filters.minRating,
            };
        }

        const trainers = await prisma.trainer.findMany({
            where,
            orderBy: {
                rating: 'desc',
            },
        });

        return trainers.map((trainer) => ({
            id: trainer.id,
            userId: trainer.user_id,
            specialty: trainer.specialty,
            status: trainer.status,
            rating: trainer.rating ? Number(trainer.rating) : null,
            accreditationDate: trainer.accreditation_date?.toISOString(),
            statistics: {
                traineesTotal: trainer.trainees_total,
                traineesSuccessful: trainer.trainees_successful,
                avgNPS: trainer.avg_nps ? Number(trainer.avg_nps) : null,
            },
        }));
    }

    /**
     * Apply to become a trainer
     */
    async createTrainer(userId: string, specialty: 'PHOTOGRAPHER' | 'SALES' | 'DESIGNER') {
        // Check if already a trainer
        const existing = await prisma.trainer.findUnique({
            where: { user_id: userId },
        });

        if (existing) {
            throw new Error('User is already a trainer');
        }

        return await prisma.trainer.create({
            data: {
                user_id: userId,
                specialty,
                status: 'CANDIDATE',
            },
        });
    }

    /**
     * Accredit a trainer
     */
    async accreditTrainer(trainerId: string) {
        const trainer = await prisma.trainer.findUnique({
            where: { id: trainerId },
        });

        if (!trainer) {
            throw new Error('Trainer not found');
        }

        return await prisma.trainer.update({
            where: { id: trainerId },
            data: {
                status: 'ACCREDITED',
                accreditation_date: new Date(),
            },
        });
    }

    /**
     * Get trainer's assignments
     */
    async getTrainerAssignments(trainerId: string) {
        return await prisma.trainerAssignment.findMany({
            where: { trainer_id: trainerId },
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    /**
     * Assign trainer to trainee
     */
    async assignTrainer(data: {
        trainerId: string;
        traineeId: string;
        startDate: string;
        plan?: any;
    }) {
        // Check if trainer exists and is accredited
        const trainer = await prisma.trainer.findUnique({
            where: { id: data.trainerId },
        });

        if (!trainer) {
            throw new Error('Trainer not found');
        }

        if (trainer.status === 'CANDIDATE') {
            throw new Error('Trainer must be accredited before assignments');
        }

        // Create assignment
        const assignment = await prisma.trainerAssignment.create({
            data: {
                trainer_id: data.trainerId,
                trainee_id: data.traineeId,
                start_date: new Date(data.startDate),
                status: 'ACTIVE',
                plan: data.plan || null,
            },
        });

        // Increment trainer's trainees count
        await prisma.trainer.update({
            where: { id: data.trainerId },
            data: {
                trainees_total: {
                    increment: 1,
                },
            },
        });

        return assignment;
    }

    /**
     * Create training result
     */
    async createTrainingResult(data: {
        assignmentId: string;
        kpiImprovement?: number;
        npsScore?: number;
        retentionDays?: number;
        hotLeadsPercentage?: number;
        qualityScore?: number;
        notes?: string;
    }) {
        const assignment = await prisma.trainerAssignment.findUnique({
            where: { id: data.assignmentId },
            include: {
                trainer: true,
            },
        });

        if (!assignment) {
            throw new Error('Assignment not found');
        }

        // Create training result
        const result = await prisma.trainingResult.create({
            data: {
                assignment_id: data.assignmentId,
                kpi_improvement: data.kpiImprovement,
                nps_score: data.npsScore,
                retention_days: data.retentionDays,
                hot_leads_percentage: data.hotLeadsPercentage,
                quality_score: data.qualityScore,
                notes: data.notes,
            },
        });

        // Update assignment status to completed
        await prisma.trainerAssignment.update({
            where: { id: data.assignmentId },
            data: {
                status: 'COMPLETED',
                end_date: new Date(),
            },
        });

        // Check if trainee was successful (retention >= 60 days)
        if (data.retentionDays && data.retentionDays >= 60) {
            await prisma.trainer.update({
                where: { id: assignment.trainer_id },
                data: {
                    trainees_successful: {
                        increment: 1,
                    },
                },
            });

            // Award trainer with MC/GMC
            await this.awardTrainer(assignment.trainer_id, {
                reason: 'Successful trainee completion',
                mc: 50,
                gmc: 5,
            });
        }

        // Update trainer rating
        await this.updateTrainerRating(assignment.trainer_id);

        return result;
    }

    /**
     * Update trainer rating based on results
     */
    private async updateTrainerRating(trainerId: string) {
        const results = await prisma.trainingResult.findMany({
            where: {
                assignment: {
                    trainer_id: trainerId,
                },
            },
            include: {
                assignment: true,
            },
        });

        if (results.length === 0) return;

        // Calculate average NPS
        const npsScores = results.filter((r) => r.nps_score !== null).map((r) => r.nps_score!);
        const avgNPS = npsScores.length > 0 ? npsScores.reduce((a, b) => a + b, 0) / npsScores.length : 0;

        // Calculate success rate (retention >= 60 days)
        const successfulTrainees = results.filter(
            (r) => r.retention_days !== null && r.retention_days >= 60
        ).length;
        const successRate = results.length > 0 ? successfulTrainees / results.length : 0;

        // Calculate rating: 60% NPS weight + 40% success rate weight
        const rating = avgNPS * 0.6 + successRate * 5 * 0.4;

        await prisma.trainer.update({
            where: { id: trainerId },
            data: {
                rating: rating,
                avg_nps: avgNPS,
            },
        });
    }

    /**
     * Award trainer with MC/GMC
     */
    private async awardTrainer(
        trainerId: string,
        reward: { reason: string; mc: number; gmc: number }
    ) {
        const trainer = await prisma.trainer.findUnique({
            where: { id: trainerId },
        });

        if (!trainer) return;

        // Get or create wallet
        let wallet = await prisma.wallet.findUnique({
            where: { user_id: trainer.user_id },
        });

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    user_id: trainer.user_id,
                    mc_balance: 0,
                    gmc_balance: 0,
                },
            });
        }

        // Update wallet
        await prisma.wallet.update({
            where: { user_id: trainer.user_id },
            data: {
                mc_balance: { increment: reward.mc },
                gmc_balance: { increment: reward.gmc },
            },
        });

        // Create transactions
        if (reward.mc > 0) {
            await prisma.transaction.create({
                data: {
                    type: 'REWARD',
                    currency: 'MC',
                    amount: reward.mc,
                    recipient_id: trainer.user_id,
                    description: `Trainer reward: ${reward.reason}`,
                    metadata: {
                        trainerId: trainer.id,
                        type: 'trainer_reward',
                    },
                },
            });
        }

        if (reward.gmc > 0) {
            await prisma.transaction.create({
                data: {
                    type: 'REWARD',
                    currency: 'GMC',
                    amount: reward.gmc,
                    recipient_id: trainer.user_id,
                    description: `Trainer reward: ${reward.reason}`,
                    metadata: {
                        trainerId: trainer.id,
                        type: 'trainer_reward',
                    },
                },
            });
        }
    }
}

export const trainerService = new TrainerService();

