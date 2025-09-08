const Trip = require("../models/trip");
const Driver = require("../models/driver");
const { notifyRider } = require('../utils/notifier');
module.exports = (io, socket) => {
    // join driver
    socket.on("driver:join", ({ driverID }) => {
        socket.join(`driver:${driverID}`);
        console.log(`driver:${driverID} join`);
    });

    // response driver for trip
    socket.on("trip:response", async ({ trip, driverID, lat, lng, accepted }) => {
        console.log("Received trip:response:", { trip, driverID, accepted });
        if (accepted) {
            try {
                await Trip.findByIdAndUpdate(
                    trip._id,
                    { status: "Accepted" }
                );
                const riderID = trip.userID;
                notifyRider(riderID, "trip:accepted", { driverID, lat, lng });
            } catch (err) {
                console.error("Error updating trip or notifying rider:", err);
                socket.emit("error", { message: "Server error while accepting trip" });
            }
        }
    });


    // استقبال توفر السائق وتحديث موقعه
    socket.on("driverAvailable", async ({ driverId, lng,lat }) => {
        try {
            console.log("Driver available:", { driverId, lng, lat });
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
            console.error("Error in driverAvailable:", err);
        }
    });

    // عند خروج السائق من التطبيق
    socket.on("disconnect", async () => {
        if (socket.driverId) {
            await Driver.findByIdAndUpdate(socket.driverId, { isAvailable: false });
        }
    });

    socket.on("trip:start", async ({ tripId }) => {
        try {
            console.log("Trip started:", { tripId });
            // تحديث حالة الرحلة في قاعدة البيانات
            await Trip.findByIdAndUpdate(tripId, { status: "Started" });
        } catch (err) {
            console.error("Error in trip:start:", err);
            socket.emit("error", { message: "Server error while starting trip" });
        }
    });

    socket.on("driverLocationUpdate", async ({ tripId, lng,lat }) => {
        try {
            console.log("Driver location update:", { tripId, lng, lat });
            // تحديث موقع الرحلة في قاعدة البيانات
            await Trip.findByIdAndUpdate(tripId, {
                currentLocation: {
                    type: "Point",
                    coordinates: [lng, lat]
                }
            });
            // جلب بيانات الرحلة لمعرفة الراكب
            const trip = await Trip.findById(tripId);
            if (trip && trip.userID) {
                // إرسال الموقع للراكب (غرفة الراكب أو socket.id الخاص به)
                io.to(`rider:${trip.userID}`).emit("driverLocationUpdate", {
                    tripId,
                    lng,
                    lat
                });
            }
        } catch (err) {
            console.error("Error in driverLocationUpdate:", err);
        }
    });


    socket.on("trip:end", async ({ tripId, lng,lat }) => {
        try {
            console.log("Trip ended:", { tripId, lng, lat });
            // تحديث حالة الرحلة في قاعدة البيانات
            await Trip.findByIdAndUpdate(tripId, {
                status: "Completed",
                endLocation: {
                    type: "Point",
                    coordinates: [lng,lat]
                }
            });
        } catch (err) {
            console.error("Error in trip:end:", err);
            socket.emit("error", { message: "Server error while ending trip" });
        }
    });
}