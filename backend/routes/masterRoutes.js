const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');

router.get('/paths', masterController.getPaths);
router.get('/paths/:id', masterController.getPathById);
router.get('/programs', masterController.getPrograms);
router.get('/programs/:id', masterController.getProgramById);
router.post('/seed', masterController.seedMasterData); // Dev endpoint

module.exports = router;
