const Trip = require("../models/trip");
const Driver = require("../models/Driver");
const { notifyRider } = require('../utils/notifier');
module.exports = (io, socket) => {
    // join driver
    socket.on("driver:join", ({ driverID }) => {
        socket.join(`driver:${driverID}`);
        //console.log(`driver:${driverID} join`);
    });

    // response driver for trip
    socket.on("trip:response", async ({ trip, driverID, lat, lng, accepted }) => {
        //console.log("Received trip:response:", { trip, driverID, accepted });
        if (accepted) {
            try {
                await Trip.findByIdAndUpdate(
                    trip._id,
                    { status: "Accepted" }
                );
                const riderID = trip.userID;
                notifyRider(riderID, "trip:accepted", { driverID, lat, lng });
            } catch (err) {
                //console.error("Error updating trip or notifying rider:", err);
            }
        }
    });


    socket.on("driverAvailable", async ({ driverId, lng,lat }) => {
        try {
            //console.log("Driver available:", { driverId, lng, lat });
            await Driver.findByIdAndUpdate(driverId, {
                isAvailable: true,
                location: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                socketId: socket.id
            });
            // حفظ driverId في socket لسهولة التعامل عند disconnect
            socket.driverId = driverId;
        } catch (err) {
            //console.error("Error in driverAvailable:", err);
        }
    });

    socket.on("disconnect", async () => {
        if (socket.driverId) {
            await Driver.findByIdAndUpdate(socket.driverId, { isAvailable: false });
        }
    });

    socket.on("trip:start", async ({ tripId }) => {
        try {
            //console.log("Trip started:", { tripId });
            await Trip.findByIdAndUpdate(tripId, { status: "Started" });
        } catch (err) {
            //console.error("Error in trip:start:", err);
        }
    });

    socket.on("driverLocationUpdate", async ({ tripId, lng,lat }) => {
        try {
            //console.log("Driver location update:", { tripId, lng, lat });
            await Trip.findByIdAndUpdate(tripId, {
                currentLocation: {
                    type: "Point",
                    coordinates: [lng, lat]
                }
            });
            const trip = await Trip.findById(tripId);
            if (trip && trip.userID) {
                //console.log("Trip data for location update:", trip);
                io.to(`rider:${trip.userID}`).emit("driverLocationUpdateToRider", {
                    tripId,
                    lng,
                    lat
                });
            }
        } catch (err) {
            //console.error("Error in driverLocationUpdate:", err);
        }
    });


    socket.on("trip:end", async ({ tripId}) => {
        try {
            //console.log("Trip ended:", { tripId});
            await Trip.findByIdAndUpdate(tripId, {
                status: "Completed"

            });
        } catch (err) {
            //console.error("Error in trip:end:", err);
        }
    });
}