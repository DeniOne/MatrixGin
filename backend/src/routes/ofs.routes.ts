import { Router } from 'express';
import ofsController from '../controllers/ofs.controller';
import passport from 'passport';

const router = Router();

// All routes require authentication
const authenticate = passport.authenticate('jwt', { session: false });

// Departments Management
router.get('/departments', authenticate, (req, res) => ofsController.getDepartments(req, res));
router.post('/departments', authenticate, (req, res) => ofsController.createDepartment(req, res));
router.put('/departments/:id', authenticate, (req, res) => ofsController.updateDepartment(req, res));
router.delete('/departments/:id', authenticate, (req, res) => ofsController.deleteDepartment(req, res));
router.post('/departments/:id/move', authenticate, (req, res) => ofsController.moveDepartment(req, res));

// Role Matrix Management
router.get('/role-matrix', authenticate, (req, res) => ofsController.getRoleMatrix(req, res));
router.post('/role-matrix', authenticate, (req, res) => ofsController.createRole(req, res));
router.put('/role-matrix/:id', authenticate, (req, res) => ofsController.updateRole(req, res));
router.delete('/role-matrix/:id', authenticate, (req, res) => ofsController.deleteRole(req, res));
router.post('/role-matrix/:roleId/assign', authenticate, (req, res) => ofsController.assignRole(req, res));

// Employee Management
router.get('/employees', authenticate, (req, res) => ofsController.getEmployees(req, res));
router.put('/employees/:id/competencies', authenticate, (req, res) => ofsController.updateEmployeeCompetencies(req, res));
router.post('/employees/:id/transfer', authenticate, (req, res) => ofsController.transferEmployee(req, res));

// Reporting Relationships
router.get('/reporting/:employeeId', authenticate, (req, res) => ofsController.getReportingRelationships(req, res));
router.post('/reporting', authenticate, (req, res) => ofsController.createReportingRelationship(req, res));

// Org Chart
router.get('/org-chart', authenticate, (req, res) => ofsController.getOrgChart(req, res));

// History & Audit
router.get('/history', authenticate, (req, res) => ofsController.getHistory(req, res));

// Reports
router.get('/reports/structure', authenticate, (req, res) => ofsController.getStructureReport(req, res));

// Pyramid of Interdependence
router.get('/pyramid', authenticate, (req, res) => ofsController.getPyramidRoles(req, res));
router.post('/pyramid', authenticate, (req, res) => ofsController.createPyramidRole(req, res));

// Triangle of Interdependence
router.get('/triangle', authenticate, (req, res) => ofsController.getTriangleAssignments(req, res));
router.post('/triangle/assign', authenticate, (req, res) => ofsController.assignTriangleRole(req, res));
router.get('/triangle/stats', authenticate, (req, res) => ofsController.getTriangleStats(req, res));

// 7-Level Organizational Hierarchy
router.get('/hierarchy/levels', authenticate, (req, res) => ofsController.getHierarchyLevels(req, res));
router.get('/hierarchy/structure', authenticate, (req, res) => ofsController.getHierarchyStructure(req, res));

// RACI Matrix
router.post('/raci', authenticate, (req, res) => ofsController.createRACIAssignment(req, res));
router.get('/raci/:projectName', authenticate, (req, res) => ofsController.getProjectRACI(req, res));

// Idea Channels (Strategic, Tactical, Mentoring)
router.post('/ideas', authenticate, (req, res) => ofsController.submitIdea(req, res));
router.get('/ideas', authenticate, (req, res) => ofsController.getIdeas(req, res));

// Hybrid Team (Human + AI)
router.post('/hybrid/interaction', authenticate, (req, res) => ofsController.logHybridInteraction(req, res));
router.get('/hybrid/stats', authenticate, (req, res) => ofsController.getHybridTeamStats(req, res));

export default router;
