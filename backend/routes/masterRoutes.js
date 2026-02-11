const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.get('/paths', masterController.getPaths);
router.get('/paths/:id', masterController.getPathById);
router.get('/programs', masterController.getPrograms);
router.get('/programs/:id', masterController.getProgramById);

// Admin Routes (CRUD)
router.get('/admin/paths', verifyToken, authorizeRoles('ADMIN'), masterController.getPathsAdmin);
router.post('/paths', verifyToken, authorizeRoles('ADMIN'), masterController.createPath);
router.put('/paths/:id', verifyToken, authorizeRoles('ADMIN'), masterController.updatePath);
router.delete('/paths/:id', verifyToken, authorizeRoles('ADMIN'), masterController.deletePath);

router.get('/admin/programs', verifyToken, authorizeRoles('ADMIN'), masterController.getProgramsAdmin);
router.post('/programs', verifyToken, authorizeRoles('ADMIN'), masterController.createProgram);
router.put('/programs/:id', verifyToken, authorizeRoles('ADMIN'), masterController.updateProgram);
router.delete('/programs/:id', verifyToken, authorizeRoles('ADMIN'), masterController.deleteProgram);

router.post('/seed', masterController.seedMasterData); // Dev endpoint

module.exports = router;
