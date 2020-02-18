import express from 'express';
import socketServer from 'socket.io';
import ClientManager from './ClientManager';

const clientManager = new ClientManager();

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('basic server is up');
});

const server = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log('Server running on port:', PORT);
});

const io = socketServer(server);

io.on('connection', async (socket) => {
    socket.emit('connection');
    console.log('New client connected with id:', socket.id);
    await clientManager.addClient({ socketId: socket.id, nickname: 'babar' });
    await clientManager.addClientNickname(socket.id, 'nicky');
    console.log('new user joined so showing all clients:', clientManager.getAllClients());


    socket.on('message', (msg) => {
        console.log('From', socket.id, 'received message:', msg);
        const client = clientManager.getClient(socket.id);
        console.log(client.nickname);
        const clientNickname = client.nickname;
        io.emit('message', { content: msg, sender: clientNickname, date: Date.now() });
    });

    socket.on('nickname', (nickname) => {
        console.log('received new sexy nickname:', nickname);
        // check double!!
        // check if nickname is unique amongst the users here and in the client
        // * first in the client. Fetch the usernames and check, then send to server.
        // * In server check again just in case... Then add and send a welcome event
        // send it back
    });

    // console.log(client);

    socket.on('disconnect', () => {
        console.log(clientManager.getAllClients());
        console.log('Client', socket.id, 'disconnected.');
        clientManager.deleteClient(socket.id);
    });
});
