import { prisma } from '../config/prisma';

export class AdaptationService {
    /**
     * Get mentorship and 1-on-1 status for a specific user
     */
    async getMyAdaptationStatus(userId: string) {
        const mentorship = await prisma.mentorship.findUnique({
            where: { mentee_id: userId },
            include: {
                mentor: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        avatar: true,
                        role: true,
                    }
                }
            }
        });

        const next1on1 = await prisma.oneOnOne.findFirst({
            where: {
                employee_id: userId,
                scheduled_at: { gte: new Date() },
                completed_at: null
            },
            orderBy: { scheduled_at: 'asc' },
            include: {
                manager: {
                    select: {
                        first_name: true,
                        last_name: true
                    }
                }
            }
        });

        return {
            mentor: mentorship ? {
                id: mentorship.mentor.id,
                name: `${mentorship.mentor.first_name} ${mentorship.mentor.last_name}`,
                avatar: mentorship.mentor.avatar,
                role: mentorship.mentor.role,
                status: mentorship.status
            } : null,
            nextMeeting: next1on1 ? {
                id: next1on1.id,
                scheduledAt: next1on1.scheduled_at,
                managerName: `${next1on1.manager.first_name} ${next1on1.manager.last_name}`
            } : null
        };
    }

    /**
     * Create a 1-on-1 meeting
     */
    async create1on1(data: { managerId: string, employeeId: string, scheduledAt: Date }) {
        return await prisma.oneOnOne.create({
            data: {
                manager_id: data.managerId,
                employee_id: data.employeeId,
                scheduled_at: data.scheduledAt
            }
        });
    }

    /**
     * Complete a 1-on-1 meeting with summary
     */
    async complete1on1(id: string, summary: string, actionItems: string[], emotionalTone: number) {
        return await prisma.oneOnOne.update({
            where: { id },
            data: {
                summary,
                action_items: actionItems,
                emotional_tone: emotionalTone,
                completed_at: new Date()
            }
        });
    }

    /**
     * Get management dashboard stats for a manager
     */
    async getTeamStatus(managerId: string) {
        // 1. Find all mentees
        const mentees = await prisma.mentorship.findMany({
            where: { mentor_id: managerId, status: 'ACTIVE' },
            include: {
                mentee: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        avatar: true,
                        erp_role: { select: { name: true } }
                    }
                }
            }
        });

        // 2. Aggregate emotional tone from last 30 days of 1-on-1s
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentSessions = await prisma.oneOnOne.findMany({
            where: {
                manager_id: managerId,
                completed_at: { gte: thirtyDaysAgo, not: null },
                emotional_tone: { not: null }
            },
            select: { emotional_tone: true }
        });

        const avgTone = recentSessions.length > 0
            ? recentSessions.reduce((acc: number, s: { emotional_tone: number | null }) => acc + (s.emotional_tone || 0), 0) / recentSessions.length
            : null;

        // 3. Find pending 1-on-1s
        const pendingMeetings = await prisma.oneOnOne.findMany({
            where: {
                manager_id: managerId,
                completed_at: null,
                scheduled_at: { gte: new Date() }
            },
            include: {
                employee: { select: { first_name: true, last_name: true } }
            },
            orderBy: { scheduled_at: 'asc' }
        });

        return {
            mentees: mentees.map((m: any) => m.mentee),
            teamHappinessTrend: avgTone ? Math.round(avgTone * 10) / 10 : 'NO_DATA',
            pendingMeetings: pendingMeetings.map((m: any) => ({
                id: m.id,
                employeeName: `${m.employee.first_name} ${m.employee.last_name}`,
                scheduledAt: m.scheduled_at
            })),
            sessionCount30d: recentSessions.length
        };
    }
}

export const adaptationService = new AdaptationService();
