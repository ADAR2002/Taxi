const Trip = require('../models/trip');
const { findNearbyDrivers } = require('../service/driverService');
const { notifyDriver } = require('../utils/notifier');
let drivers;
/**
 * @desc Create new trip
 * @route /new_trip
 * @method post
 * @access public
 */

async function waitForDriverResponse  (driver, trip) {
    return new Promise(resolve => {
        notifyDriver(driver._id, trip);
        setTimeout(async () => {
            console.log(trip);
            const updateTrip = await Trip.findById(trip._id);
            if (updateTrip.status === "Panding") resolve(null);
            else resolve(driver);
        }, 5000);
    })
}

async function assignTripToNextDriver(index, trip) {
    if (index >= drivers.length) return null;
    const driver = drivers[index];
    const result = await waitForDriverResponse(driver, trip);
    if (!result) return await assignTripToNextDriver(index + 1, trip);
    return result;
}


exports.newTrip = async (req, res) => {
    try {
        const trip = Trip({
            userID: req.body.userID,
            start_location: { coordinates: [req.body.start_location_lat, req.body.start_location_lng] },
            end_location: { coordinates: [req.body.end_location_lat, req.body.end_location_lng] },
            distance_km: req.body.distance_km,
            duration_min: req.body.duration_min,
            price: req.body.price,
        });
        const result = await trip.save();
        drivers = await findNearbyDrivers(req.body.start_location_lat,
            req.body.start_location_lng,
            req.body.vehicleType,
            req.body.vehicleSize
        );
        
        const driver = await assignTripToNextDriver(0, result);
        if (!driver) {
            return res.status(500).json({
                success: false,
                message: "We didn't find driver"
            })

        }
        await Trip.findByIdAndUpdate(
            result.id,
            { driverID: driver._id }
        );
        const resultTrip = await Trip.findById(result._id);
        return res.status(200).json(resultTrip);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        }
        );
    }
}


