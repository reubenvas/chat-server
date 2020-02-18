const app = require('express')();
const socketServer = require('socket.io');

const clientManager = new (require('./ClientManager'))();


const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('basic server is up');
});

const server = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log('Server running on port:', PORT);
});

const io = socketServer(server);

io.on('connection', (socket) => {
    console.log('New client connected with id:', socket.id);
    clientManager.addClient({ socketId: socket.id, nickname: '' });
    clientManager.addClientNickname(socket.id, 'nicky');

    socket.on('message', (msg) => {
        console.log('From', socket.id, 'received message:', msg);
        const clientNickname = clientManager.getClient(socket.id).nickname;
        socket.broadcast.emit('message', { content: msg, sender: clientNickname });
    });

    // console.log(client);

    console.log(clientManager.getAllClients());

    socket.on('disconnect', () => {
        console.log(clientManager.getAllClients());
        console.log('Client', socket.id, 'disconnected.');
        clientManager.deleteClient(socket.id);
    });
});
