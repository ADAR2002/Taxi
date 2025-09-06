let io = null;
function setIO(ioInstince) {
    io = ioInstince;
}

function notifyDriver(driverID, trip) {
    console.log("Notifying driver:", driverID, trip);
    if (!io) throw new Error("Socket not init");
    io.to(`driver:${driverID}`).emit("trip:request", trip);
}

function notifyRider(riderID, event, {driverID,lat,lng}) {
    console.log("Notifying rider:", riderID, event, {driverID,lat,lng});
    if (!io) throw new Error("Socket not init");
    io.to(`rider:${riderID}`).emit(event, {driverID,lat,lng});
}

module.exports = { setIO,notifyDriver, notifyRider };