/**
 * University Controller
 * Handles all Corporate University endpoints
 */

import { Request, Response } from 'express';
import { universityService } from '../services/university.service';
import { enrollmentService } from '../services/enrollment.service';
import { trainerService } from '../services/trainer.service';

export class UniversityController {
    /**
     * GET /api/university/academies
     * Get all academies
     */
    async getAcademies(req: Request, res: Response) {
        try {
            const academies = await universityService.getAcademies();
            res.json({
                success: true,
                data: academies,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * GET /api/university/academies/:id
     * Get academy by ID with courses
     */
    async getAcademyById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const academy = await universityService.getAcademyById(id);
            res.json({
                success: true,
                data: academy,
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * POST /api/university/academies
     * Create new academy (Admin only)
     */
    async createAcademy(req: Request, res: Response) {
        try {
            const academy = await universityService.createAcademy(req.body);
            res.status(201).json({
                success: true,
                data: academy,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * GET /api/university/courses
     * Get all courses with filters
     */
    async getCourses(req: Request, res: Response) {
        try {
            const { academyId, requiredGrade, isMandatory } = req.query;
            const courses = await universityService.getCourses({
                academyId: academyId as string,
                requiredGrade: requiredGrade as string,
                isMandatory: isMandatory === 'true',
            });
            res.json({
                success: true,
                data: courses,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * GET /api/university/courses/:id
     * Get course by ID with modules
     */
    async getCourseById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const course = await universityService.getCourseById(id);
            res.json({
                success: true,
                data: course,
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * POST /api/university/courses
     * Create new course (Admin only)
     */
    async createCourse(req: Request, res: Response) {
        try {
            const course = await universityService.createCourse(req.body);
            res.status(201).json({
                success: true,
                data: course,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * POST /api/university/courses/:id/enroll
     * Enroll in a course
     */
    async enrollInCourse(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id; // From auth middleware
            const { assignedBy } = req.body;

            const enrollment = await enrollmentService.enrollInCourse(userId, id, assignedBy);

            res.status(201).json({
                success: true,
                data: {
                    enrollmentId: enrollment.id,
                    courseId: enrollment.course_id,
                    progress: enrollment.progress,
                    status: enrollment.status,
                },
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * GET /api/university/my-courses
     * Get my enrolled courses
     */
    async getMyCourses(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const courses = await enrollmentService.getMyCourses(userId);
            res.json({
                success: true,
                data: courses,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * PUT /api/university/enrollments/:id/progress
     * Update module progress
     */
    async updateModuleProgress(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { moduleId, status, score } = req.body;

            const progress = await enrollmentService.updateModuleProgress(id, moduleId, status, score);

            res.json({
                success: true,
                data: progress,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * POST /api/university/courses/:id/complete
     * Complete a course
     */
    async completeCourse(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;

            const enrollment = await enrollmentService.completeCourse(userId, id);

            res.json({
                success: true,
                data: {
                    message: 'Course completed successfully',
                    enrollment,
                },
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * GET /api/university/certifications
     * Get my certifications
     */
    async getCertifications(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const certifications = await enrollmentService.getCertifications(userId);
            res.json({
                success: true,
                data: certifications,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * GET /api/university/trainers
     * Get all trainers with filters
     */
    async getTrainers(req: Request, res: Response) {
        try {
            const { specialty, status, minRating } = req.query;
            const trainers = await trainerService.getTrainers({
                specialty: specialty as any,
                status: status as string,
                minRating: minRating ? Number(minRating) : undefined,
            });
            res.json({
                success: true,
                data: trainers,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * POST /api/university/trainers
     * Apply to become a trainer
     */
    async createTrainer(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { specialty } = req.body;

            const trainer = await trainerService.createTrainer(userId, specialty);

            res.status(201).json({
                success: true,
                data: trainer,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * PUT /api/university/trainers/:id/accredit
     * Accredit a trainer (Admin/Coordinator only)
     */
    async accreditTrainer(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const trainer = await trainerService.accreditTrainer(id);
            res.json({
                success: true,
                data: trainer,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * POST /api/university/trainers/assign
     * Assign trainer to trainee
     */
    async assignTrainer(req: Request, res: Response) {
        try {
            const assignment = await trainerService.assignTrainer(req.body);
            res.status(201).json({
                success: true,
                data: assignment,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * GET /api/university/trainers/:id/assignments
     * Get trainer's assignments
     */
    async getTrainerAssignments(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const assignments = await trainerService.getTrainerAssignments(id);
            res.json({
                success: true,
                data: assignments,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    /**
     * POST /api/university/trainers/results
     * Create training result
     */
    async createTrainingResult(req: Request, res: Response) {
        try {
            const result = await trainerService.createTrainingResult(req.body);
            res.status(201).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
}

export const universityController = new UniversityController();
