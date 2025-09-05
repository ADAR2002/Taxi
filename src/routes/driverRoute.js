const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const checkAdmin = require('../middleware/checkAdmin');
const dec = require('../middleware/auth');


router.post('/apply', driverController.apply);
router.put('/approve/:id', dec.authMiddleware, checkAdmin.checkAdmin, driverController.approve);
router.post('/availablility', driverController.availablility);
router.delete('/:id', dec.authMiddleware, checkAdmin.checkAdmin,driverController.removeDriver);
router.get('/:id', driverController.getDriver);
router.get('/',dec.authMiddleware, checkAdmin.checkAdmin, driverController.getAllDriver);
router.get('/trips/:id', driverController.getTripsForDrivder);

module.exports = router;
