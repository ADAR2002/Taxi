const registerSockets = require('../sockets');

let io = null;

function initSocket(server) {

    io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log(`New connection: ${socket.id}`);

        registerSockets(io, socket);
    });
    return io;
}
module.exports = { initSocket };