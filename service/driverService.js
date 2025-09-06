const Driver = require('../models/Driver')

exports.findNearbyDrivers = async (start_location_lat, start_location_lng, vehicleType, vehicleSize) => {
    try {
        const drivers = await Driver.find(/*{
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [start_location_lat, start_location_lng],
                    },
                    $maxDistance: 50000000000000000000000,
                }
            },
            isAvailable: true,
            vehicleType: vehicleType,
            vehicleSize: vehicleSize
        }*/ );
        return drivers;
    } catch (error) {
        console.log(error);
        return {};

    }
}