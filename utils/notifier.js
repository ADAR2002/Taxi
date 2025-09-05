let io = null;
function setIO(ioInstince) {
    io = ioInstince;
}

function notifyDriver(driverID, trip) {
    if (!io) throw new Error("Socket not init");
    io.to(`driver:${driverID}`).emit("trip:request", trip);
}

function notifyRider(riderID, event, paylod) {
    if (!io) throw new Error("Socket not init");
    io.to(`rider:${riderID}`).emit(event, paylod);
}

module.exports = { setIO,notifyDriver, notifyRider };