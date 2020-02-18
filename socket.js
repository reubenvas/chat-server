const socketServer = require('socket.io');
const server = require('./server');

const io = socketServer(server);

console.log(server);

io.on('connection', (socket) => {
    console.log('New client connected with id:', socket.id);
});


module.exports.io = io;
