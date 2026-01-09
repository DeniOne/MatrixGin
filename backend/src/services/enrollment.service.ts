/**
 * Enrollment Service
 * Handles course enrollments and progress tracking
 */


import { prisma } from '../config/prisma';

export class EnrollmentService {
    /**
     * Enroll user in a course
     */
    async enrollInCourse(userId: string, courseId: string, assignedBy?: string) {
        // Check if already enrolled
        const existing = await prisma.enrollment.findUnique({
            where: {
                user_id_course_id: {
                    user_id: userId,
                    course_id: courseId,
                },
            },
        });

        if (existing) {
            throw new Error('Already enrolled in this course');
        }

        // Create enrollment
        const enrollment = await prisma.enrollment.create({
            data: {
                user_id: userId,
                course_id: courseId,
                assigned_by: assignedBy,
                status: 'ACTIVE',
            },
        });

        // Create progress tracking for all modules
        const courseModules = await prisma.courseModule.findMany({
            where: { course_id: courseId },
        });

        const progressRecords = courseModules.map((module) => ({
            enrollment_id: enrollment.id,
            module_id: module.id,
            status: 'NOT_STARTED' as const,
        }));

        await prisma.moduleProgress.createMany({
            data: progressRecords,
        });

        return enrollment;
    }

    /**
     * Get user's courses
     */
    async getMyCourses(userId: string) {
        const enrollments = await prisma.enrollment.findMany({
            where: { user_id: userId },
            include: {
                course: {
                    include: {
                        academy: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                enrolled_at: 'desc',
            },
        });

        const active = enrollments
            .filter((e) => e.status === 'ACTIVE')
            .map((e) => this.formatEnrollment(e));

        const completed = enrollments
            .filter((e) => e.status === 'COMPLETED')
            .map((e) => this.formatEnrollment(e));

        const abandoned = enrollments
            .filter((e) => e.status === 'ABANDONED')
            .map((e) => this.formatEnrollment(e));

        return { active, completed, abandoned };
    }

    /**
     * Update module progress
     */
    async updateModuleProgress(
        enrollmentId: string,
        moduleId: string,
        status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED',
        score?: number
    ) {
        const progress = await prisma.moduleProgress.findFirst({
            where: {
                enrollment_id: enrollmentId,
                module_id: moduleId,
            },
        });

        if (!progress) {
            throw new Error('Module progress not found');
        }

        const updated = await prisma.moduleProgress.update({
            where: { id: progress.id },
            data: {
                status,
                score,
                started_at: status === 'IN_PROGRESS' && !progress.started_at ? new Date() : progress.started_at,
                completed_at: status === 'COMPLETED' ? new Date() : null,
            },
        });

        // Update enrollment progress
        await this.updateEnrollmentProgress(enrollmentId);

        return updated;
    }

    /**
     * Complete course and award MC/GMC
     */
    async completeCourse(userId: string, courseId: string) {
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                user_id_course_id: {
                    user_id: userId,
                    course_id: courseId,
                },
            },
            include: {
                course: true,
            },
        });

        if (!enrollment) {
            throw new Error('Enrollment not found');
        }

        if (enrollment.status === 'COMPLETED') {
            throw new Error('Course already completed');
        }

        // Check if all required modules are completed
        const allModules = await prisma.courseModule.findMany({
            where: { course_id: courseId },
        });

        const progress = await prisma.moduleProgress.findMany({
            where: {
                enrollment_id: enrollment.id,
            },
        });

        const requiredModules = allModules.filter((m) => m.is_required);
        const completedRequired = progress.filter(
            (p) => p.status === 'COMPLETED' && requiredModules.some((rm) => rm.id === p.module_id)
        );

        if (completedRequired.length < requiredModules.length) {
            throw new Error('Not all required modules completed');
        }

        // Update enrollment status
        const completed = await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: {
                status: 'COMPLETED',
                completed_at: new Date(),
                progress: 100,
            },
        });

        // Award MC/GMC
        if (enrollment.course.reward_mc > 0 || enrollment.course.reward_gmc > 0) {
            await this.awardRewards(userId, enrollment.course);
        }

        // Create certification
        await prisma.certification.create({
            data: {
                user_id: userId,
                course_id: courseId,
                academy_id: enrollment.course.academy_id || undefined,
                score: this.calculateAverageScore(progress),
            },
        });

        return completed;
    }

    /**
     * Get user's certifications
     */
    async getCertifications(userId: string) {
        return await prisma.certification.findMany({
            where: { user_id: userId },
            include: {
                course: {
                    select: {
                        title: true,
                    },
                },
                academy: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                issued_at: 'desc',
            },
        });
    }

    /**
     * Private helper methods
     */

    private formatEnrollment(enrollment: any) {
        return {
            id: enrollment.id,
            userId: enrollment.user_id,
            courseId: enrollment.course_id,
            courseTitle: enrollment.course.title,
            academyName: enrollment.course.academy?.name,
            progress: enrollment.progress,
            status: enrollment.status,
            enrolledAt: enrollment.enrolled_at.toISOString(),
            completedAt: enrollment.completed_at?.toISOString(),
            assignedBy: enrollment.assigned_by,
        };
    }

    private async updateEnrollmentProgress(enrollmentId: string) {
        const allProgress = await prisma.moduleProgress.findMany({
            where: { enrollment_id: enrollmentId },
        });

        const completedCount = allProgress.filter((p) => p.status === 'COMPLETED').length;
        const progressPercentage = Math.round((completedCount / allProgress.length) * 100);

        await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { progress: progressPercentage },
        });
    }

    private calculateAverageScore(progress: any[]): number {
        const withScores = progress.filter((p) => p.score !== null);
        if (withScores.length === 0) return 0;

        const sum = withScores.reduce((acc, p) => acc + p.score, 0);
        return Math.round(sum / withScores.length);
    }

    private async awardRewards(userId: string, course: any) {
        // Get or create wallet
        let wallet = await prisma.wallet.findUnique({
            where: { user_id: userId },
        });

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    user_id: userId,
                    mc_balance: 0,
                    gmc_balance: 0,
                },
            });
        }

        // Update wallet balances
        await prisma.wallet.update({
            where: { user_id: userId },
            data: {
                mc_balance: { increment: course.reward_mc },
                gmc_balance: { increment: course.reward_gmc },
            },
        });

        // Create transaction records
        if (course.reward_mc > 0) {
            await prisma.transaction.create({
                data: {
                    type: 'EARN',
                    currency: 'MC',
                    amount: course.reward_mc,
                    recipient_id: userId,
                    description: `Course completion: ${course.title}`,
                    metadata: {
                        courseId: course.id,
                        type: 'course_completion',
                    },
                },
            });
        }

        if (course.reward_gmc > 0) {
            await prisma.transaction.create({
                data: {
                    type: 'EARN',
                    currency: 'GMC',
                    amount: course.reward_gmc,
                    recipient_id: userId,
                    description: `Course completion: ${course.title}`,
                    metadata: {
                        courseId: course.id,
                        type: 'course_completion',
                    },
                },
            });
        }
    }
}

export const enrollmentService = new EnrollmentService();

