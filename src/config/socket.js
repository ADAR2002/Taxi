const registerSockets = require('../sockets');

let io = null;

function initSocket(server) {

    io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`New connection: ${socket.id}`);

        registerSockets(io, socket);
    });
    return io;
}
module.exports = { initSocket };