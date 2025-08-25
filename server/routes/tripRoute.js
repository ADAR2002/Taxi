const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

router.post('/newTrip',tripController.newTrip);
router.post('/findDrivers',tripController.findNearbyDrivers);
module.exports = router;