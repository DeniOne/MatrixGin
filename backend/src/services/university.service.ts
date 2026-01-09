/**
 * University Service
 * Handles Corporate University module business logic
 */


import { prisma } from '../config/prisma';

export class UniversityService {
    /**
     * Get all academies
     */
    async getAcademies() {
        const academies = await prisma.academy.findMany({
            where: { is_active: true },
            include: {
                _count: {
                    select: {
                        courses: true,
                        skills: true,
                    },
                },
            },
        });

        return academies.map((academy) => ({
            id: academy.id,
            name: academy.name,
            description: academy.description,
            iconUrl: academy.icon_url,
            isActive: academy.is_active,
            coursesCount: academy._count.courses,
            skillsCount: academy._count.skills,
        }));
    }

    /**
     * Get academy by ID with courses
     */
    async getAcademyById(id: string) {
        const academy = await prisma.academy.findUnique({
            where: { id },
            include: {
                courses: {
                    where: { is_active: true },
                    include: {
                        _count: {
                            select: {
                                modules: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        skills: true,
                    },
                },
            },
        });

        if (!academy) {
            throw new Error('Academy not found');
        }

        return {
            id: academy.id,
            name: academy.name,
            description: academy.description,
            iconUrl: academy.icon_url,
            isActive: academy.is_active,
            coursesCount: academy.courses.length,
            skillsCount: academy._count.skills,
            courses: academy.courses.map((course) => ({
                id: course.id,
                title: course.title,
                description: course.description,
                requiredGrade: course.required_grade,
                rewardMC: course.reward_mc,
                rewardGMC: course.reward_gmc,
                isMandatory: course.is_mandatory,
                modulesCount: course._count.modules,
            })),
        };
    }

    /**
     * Create new academy
     */
    async createAcademy(data: { name: string; description?: string; icon_url?: string }) {
        return await prisma.academy.create({
            data: {
                name: data.name,
                description: data.description,
                icon_url: data.icon_url,
            },
        });
    }

    /**
     * Update academy
     */
    async updateAcademy(
        id: string,
        data: { name?: string; description?: string; icon_url?: string; is_active?: boolean }
    ) {
        return await prisma.academy.update({
            where: { id },
            data,
        });
    }

    /**
     * Get all courses with filters
     */
    async getCourses(filters?: {
        academyId?: string;
        requiredGrade?: string;
        isMandatory?: boolean;
    }) {
        const where: any = { is_active: true };

        if (filters?.academyId) {
            where.academy_id = filters.academyId;
        }

        if (filters?.requiredGrade) {
            where.required_grade = filters.requiredGrade;
        }

        if (filters?.isMandatory !== undefined) {
            where.is_mandatory = filters.isMandatory;
        }

        const courses = await prisma.course.findMany({
            where,
            include: {
                academy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        modules: true,
                    },
                },
            },
        });

        return courses.map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            academyId: course.academy?.id,
            academyName: course.academy?.name,
            requiredGrade: course.required_grade,
            rewardMC: course.reward_mc,
            rewardGMC: course.reward_gmc,
            isMandatory: course.is_mandatory,
            isActive: course.is_active,
            modulesCount: course._count.modules,
        }));
    }

    /**
     * Get course by ID with modules
     */
    async getCourseById(id: string) {
        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                academy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                modules: {
                    orderBy: {
                        module_order: 'asc',
                    },
                    include: {
                        material: {
                            select: {
                                id: true,
                                type: true,
                                title: true,
                                duration_minutes: true,
                            },
                        },
                    },
                },
            },
        });

        if (!course) {
            throw new Error('Course not found');
        }

        const totalDuration = course.modules.reduce(
            (sum, module) => sum + (module.material?.duration_minutes || 0),
            0
        );

        return {
            id: course.id,
            title: course.title,
            description: course.description,
            academy: course.academy,
            modules: course.modules.map((module) => ({
                id: module.id,
                order: module.module_order,
                material: module.material,
                isRequired: module.is_required,
            })),
            requiredGrade: course.required_grade,
            rewardMC: course.reward_mc,
            rewardGMC: course.reward_gmc,
            isMandatory: course.is_mandatory,
            totalDuration,
        };
    }

    /**
     * Create new course
     */
    async createCourse(data: {
        title: string;
        description?: string;
        academyId?: string;
        requiredGrade?: string;
        rewardMC?: number;
        rewardGMC?: number;
        isMandatory?: boolean;
    }) {
        return await prisma.course.create({
            data: {
                title: data.title,
                description: data.description,
                academy_id: data.academyId,
                required_grade: data.requiredGrade as any,
                reward_mc: data.rewardMC || 0,
                reward_gmc: data.rewardGMC || 0,
                is_mandatory: data.isMandatory || false,
            },
        });
    }

    /**
     * Update course
     */
    async updateCourse(
        id: string,
        data: {
            title?: string;
            description?: string;
            requiredGrade?: string;
            rewardMC?: number;
            rewardGMC?: number;
            isMandatory?: boolean;
            isActive?: boolean;
        }
    ) {
        return await prisma.course.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                required_grade: data.requiredGrade as any,
                reward_mc: data.rewardMC,
                reward_gmc: data.rewardGMC,
                is_mandatory: data.isMandatory,
                is_active: data.isActive,
            },
        });
    }

    /**
     * Add module to course
     */
    async addCourseModule(
        courseId: string,
        data: {
            materialId: string;
            order: number;
            isRequired?: boolean;
        }
    ) {
        return await prisma.courseModule.create({
            data: {
                course_id: courseId,
                material_id: data.materialId,
                module_order: data.order,
                is_required: data.isRequired ?? true,
            },
        });
    }
}

export const universityService = new UniversityService();

