const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const checkAdmin = require('../middleware/checkAdmin');
const dec = require('../middleware/auth');


router.post('/apply', driverController.apply);
router.put('/approve/:id', dec.authMiddleware, checkAdmin.checkAdmin, driverController.approve);
router.put('/availablility/:id', driverController.availablility);
router.delete('/:id', driverController.removeDriver);
router.get('/:id', driverController.getDriver);
router.get('/', driverController.getAllDriver);

module.exports = router;
