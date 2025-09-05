const driverSocket = require('./driver.sockets');
const riderSocket = require('./rider.socket');

module.exports = (io,socket)=>{
    driverSocket(io,socket);
    riderSocket(io,socket);
}
