const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.get('/', verifyToken, settingsController.getSettings);
router.put('/', verifyToken, authorizeRoles('ADMIN'), settingsController.updateSetting);

module.exports = router;
