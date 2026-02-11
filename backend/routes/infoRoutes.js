const express = require('express');
const router = express.Router();
const infoController = require('../controllers/infoController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/news', infoController.getNews);
router.get('/schedules', infoController.getSchedules);

// Admin-only management routes
router.get('/admin/news', verifyToken, authorizeRoles('ADMIN'), infoController.getAllNewsAdmin);
router.post('/news', verifyToken, authorizeRoles('ADMIN'), infoController.createNews);
router.put('/news/:id', verifyToken, authorizeRoles('ADMIN'), infoController.updateNews);
router.delete('/news/:id', verifyToken, authorizeRoles('ADMIN'), infoController.deleteNews);

router.get('/admin/schedules', verifyToken, authorizeRoles('ADMIN'), infoController.getAllSchedulesAdmin);
router.post('/schedules', verifyToken, authorizeRoles('ADMIN'), infoController.createSchedule);
router.put('/schedules/:id', verifyToken, authorizeRoles('ADMIN'), infoController.updateSchedule);
router.delete('/schedules/:id', verifyToken, authorizeRoles('ADMIN'), infoController.deleteSchedule);

module.exports = router;
