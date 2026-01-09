import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import passport from 'passport';
import { requireRoles } from '../middleware/roles.middleware';
import { UserRole } from '../dto/common/common.enums';

const router = Router();
const taskController = new TaskController();

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => taskController.create(req, res));
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => taskController.getAll(req, res));
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => taskController.getById(req, res));
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => taskController.update(req, res));
router.patch('/:id/status', passport.authenticate('jwt', { session: false }), (req, res) => taskController.updateStatus(req, res));
router.post('/:id/assign', passport.authenticate('jwt', { session: false }), requireRoles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.DEPARTMENT_HEAD), (req, res) => taskController.assign(req, res));

export default router;
