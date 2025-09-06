const Trip = require("../models/trip");
const { notifyRider } = require('../utils/notifier');
module.exports = (io, socket) => {
    // join driver
    socket.on("driver:join", ({ driverID }) => {
        socket.join(`driver:${driverID}`);
        console.log(`driver:${driverID} join`);
    });

    // response driver for trip
    socket.on("trip:response", async ({ trip, driver, accepted }) => {
        console.log("Received trip:response:", { trip, driver, accepted });
        if (accepted) {
            try {
                await Trip.findByIdAndUpdate(
                    trip._id,
                    { status: "Accepted" }
                );
                const riderID = trip.userID;
                notifyRider(riderID, "trip:accepted", driver);
            } catch (err) {
                console.error("Error updating trip or notifying rider:", err);
                socket.emit("error", { message: "Server error while accepting trip" });
            }
        }
    });
}