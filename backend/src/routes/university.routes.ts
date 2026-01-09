/**
 * University Routes
 * Routes for Corporate University module
 */

import { Router } from 'express';
import { universityController } from '../controllers/university.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/roles.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ===== Academy Routes =====

/**
 * GET /api/university/academies
 * Get all academies
 */
router.get('/academies', universityController.getAcademies.bind(universityController));

/**
 * GET /api/university/academies/:id
 * Get academy by ID with courses
 */
router.get('/academies/:id', universityController.getAcademyById.bind(universityController));

/**
 * POST /api/university/academies
 * Create new academy (Admin only)
 */
router.post(
    '/academies',
    requireRole(['ADMIN']),
    universityController.createAcademy.bind(universityController)
);

// ===== Course Routes =====

/**
 * GET /api/university/courses
 * Get all courses with filters
 */
router.get('/courses', universityController.getCourses.bind(universityController));

/**
 * GET /api/university/courses/:id
 * Get course by ID with modules
 */
router.get('/courses/:id', universityController.getCourseById.bind(universityController));

/**
 * POST /api/university/courses
 * Create new course (Admin only)
 */
router.post(
    '/courses',
    requireRole(['ADMIN', 'HR_MANAGER']),
    universityController.createCourse.bind(universityController)
);

/**
 * POST /api/university/courses/:id/enroll
 * Enroll in a course
 */
router.post('/courses/:id/enroll', universityController.enrollInCourse.bind(universityController));

/**
 * POST /api/university/courses/:id/complete
 * Complete a course
 */
router.post('/courses/:id/complete', universityController.completeCourse.bind(universityController));

// ===== Enrollment Routes =====

/**
 * GET /api/university/my-courses
 * Get my enrolled courses
 */
router.get('/my-courses', universityController.getMyCourses.bind(universityController));

/**
 * PUT /api/university/enrollments/:id/progress
 * Update module progress
 */
router.put(
    '/enrollments/:id/progress',
    universityController.updateModuleProgress.bind(universityController)
);

// ===== Certification Routes =====

/**
 * GET /api/university/certifications
 * Get my certifications
 */
router.get('/certifications', universityController.getCertifications.bind(universityController));

// ===== Trainer Routes =====

/**
 * GET /api/university/trainers
 * Get all trainers with filters
 */
router.get('/trainers', universityController.getTrainers.bind(universityController));

/**
 * POST /api/university/trainers
 * Apply to become a trainer
 */
router.post('/trainers', universityController.createTrainer.bind(universityController));

/**
 * PUT /api/university/trainers/:id/accredit
 * Accredit a trainer (Admin/HR Manager only)
 */
router.put(
    '/trainers/:id/accredit',
    requireRole(['ADMIN', 'HR_MANAGER']),
    universityController.accreditTrainer.bind(universityController)
);

/**
 * GET /api/university/trainers/:id/assignments
 * Get trainer's assignments
 */
router.get(
    '/trainers/:id/assignments',
    universityController.getTrainerAssignments.bind(universityController)
);

/**
 * POST /api/university/trainers/assign
 * Assign trainer to trainee (Admin/HR Manager only)
 */
router.post(
    '/trainers/assign',
    requireRole(['ADMIN', 'HR_MANAGER', 'DEPARTMENT_HEAD']),
    universityController.assignTrainer.bind(universityController)
);

/**
 * POST /api/university/trainers/results
 * Create training result (Trainer/Admin only)
 */
router.post(
    '/trainers/results',
    universityController.createTrainingResult.bind(universityController)
);

export default router;
