
module.exports = (io, socket) => {
    socket.on("rider:join", ({ riderID }) => {
        socket.join(`rider:${riderID}`);
        console.log(`rider ${riderID} join`);
    });
}