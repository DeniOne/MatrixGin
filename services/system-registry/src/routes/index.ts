import { Router } from 'express';
import { RegistryController } from '../controllers/registry.controller';

const router = Router();
const controller = new RegistryController();

// Parameter :type matches one of the 47 foundation entities

router.get('/:type', controller.list);
router.post('/:type', controller.create);
router.get('/:type/:id', controller.getById);
router.patch('/:type/:id', controller.update);
router.post('/:type/:id/lifecycle', controller.lifecycle);
router.get('/:type/:id/audit', controller.audit);

export default router;
