import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import passport from 'passport';
import { requireRoles } from '../middleware/roles.middleware';
import { UserRole } from '../dto/common/common.enums';

const router = Router();
const employeeController = new EmployeeController();

router.post('/', passport.authenticate('jwt', { session: false }), requireRoles(UserRole.ADMIN, UserRole.HR_MANAGER), (req, res) => employeeController.create(req, res));
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => employeeController.getById(req, res));
router.put('/:id', passport.authenticate('jwt', { session: false }), requireRoles(UserRole.ADMIN, UserRole.HR_MANAGER), (req, res) => employeeController.update(req, res));
router.patch('/:id/emotional-tone', passport.authenticate('jwt', { session: false }), requireRoles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD), (req, res) => employeeController.updateEmotionalTone(req, res));
router.post('/:id/promote', passport.authenticate('jwt', { session: false }), requireRoles(UserRole.ADMIN, UserRole.HR_MANAGER), (req, res) => employeeController.promote(req, res));
router.post('/:id/demote', passport.authenticate('jwt', { session: false }), requireRoles(UserRole.ADMIN, UserRole.HR_MANAGER), (req, res) => employeeController.demote(req, res));

export default router;
