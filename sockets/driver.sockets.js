const { default: mongoose } = require("mongoose");
const Trip = require("../models/trip");
const { notifyRider } = require('../utils/notifier');
module.exports = (io, socket) => {
    // join driver
    socket.on("driver:join", ({ driverID }) => {
        socket.join(`driver:${driverID}`);
        console.log(`driver:${driverID} join`);
    });

    // response driver for trip
    socket.on("trip:response", ({ trip, driverID, accepted }) => {
        if(!mongoose.Types.ObjectId.isValid(trip._id)){
            console.error("Invalid trip ID");
            return;
        }
        if (accepted) {
            console.log(`driver ${driverID} accepted trip ${trip._id}`);
            Trip.findByIdAndUpdate(
                trip._id,
                { status: "Accepted" }
            );
            const riderID = trip.userId;
            notifyRider(riderID, "trip:accepted", { riderID, driverID });
        }
    });
}