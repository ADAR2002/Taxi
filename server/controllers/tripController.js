const Trip = require('../models/trip');
const Driver = require('../models/Driver');
/**
 * @desc Create new trip
 * @route /new_trip
 * @method post
 * @access public
 */

exports.newTrip = async (req, res) => {
    try {
        const trip = Trip({
            userID: req.body.userID,
            driverID: req.body.driverID,
            start_location: { coordinates: [req.body.start_location_lat, req.body.start_location_lng] },
            end_location: { coordinates: [req.body.end_location_lat, req.body.end_location_lng] },
            distance_km: req.body.distance_km,
            duration_min: req.body.duration_min,
            price: req.body.price,
        });
        const result = await trip.save();
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        }
        );
    }
}


/**
 * @desc find driver
 * @route /findDrivers
 * @method get
 * @access public
 */

exports.findNearbyDrivers = async (req, res) => {
    try {
        const { start_location_lat, start_location_lng ,vehicleType , vehicleSize} = req.body;
        const drivers = await Driver.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [start_location_lat, start_location_lng],
                    },
                    $maxDistance: 5000,
                }
            },
            isAvailable: true,
            vehicleType:vehicleType,
            vehicleSize:vehicleSize
        });
        res.status(201).json(drivers);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        }
        );
    }
}