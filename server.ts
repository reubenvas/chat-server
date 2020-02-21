import express from 'express';
import SocketIO from 'socket.io';
import chalk from 'chalk';
import ClientManager from './ClientManager';
import validation from './validation';

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

const io = SocketIO(server);

io.on('connection', async (socket) => {
    console.log(chalk.bold.bgBlueBright('User', socket.id, 'connected.'));
    await clientManager.addClient(socket.id, socket); // remove socket.id and only add socket
    clientManager.getClient(socket.id).nickname = 'marcus';


    socket.on('message', (msg: string) => {
        console.log('From', socket.id, 'received message:', msg);

        if (msg === '') {
            socket.emit('message invalid', msg, 'OMG! you haven\'t even written antyhing... Try again, but this time write something');
            return;
        }
        if (msg.length > 100) {
            socket.emit('message invalid', msg, 'Nooo!! Are you writing an essay? Try shortening down your message');
            return;
        }
        const clientNickname = clientManager.getClient(socket.id).nickname;
        const timestamp = Date.now();
        io.to('chat').emit('new message', { content: msg, sender: clientNickname, date: timestamp });
        clientManager.setLastActivity(socket.id, timestamp);
    });

    socket.on('set nickname', (nickname: string) => {
        console.log('received new sexy nickname:', nickname, 'From:', socket.id);

        // Object.values(validation.nickname.invalid).some(({ invalidate, message }) => {
        //     if (invalidate(nickname)) {
        //         socket.emit('nickname invalid', nickname, message);
        //         return true;
        //     }
        //     return false;
        // });

        // make a json file or object with these error terms and messages and also if its error-, warning- or success- message
        if (clientManager.getAllClients().some((client) => client.nickname === nickname)) {
            // socket.emit('nickname invalid', nickname, 'Reason for invalidity');
            socket.emit('nickname invalid', nickname, 'This nickname is alredy taken by another user');
            return;
        }
        if (nickname.length < 3) {
            socket.emit('nickname invalid', nickname, 'This nickname is way too short');
            return;
        }
        if (nickname.length > 10) {
            socket.emit('nickname invalid', nickname, 'This nickname is way too long');
            return;
        }
        if (!/^[A-Za-z]+$/.test(nickname)) {
            socket.emit('nickname invalid', nickname, 'This nickname contains other characters than letters');
            return;
        }

        socket.join('chat', (err: Error | void) => {
            if (err) {
                throw err;
            }

            socket.emit('nickname approved', nickname);

            const timestamp = Date.now();

            clientManager.setNickname(socket.id, nickname);
            clientManager.setLastActivity(socket.id, timestamp);
            clientManager.setLoginTime(socket.id, timestamp);
            clientManager.getClient(socket.id).startInactivityTimer();
        });

        // check double!!
        // check if nickname is unique amongst the users here and in the client
        // * first in the client. Fetch the usernames and check, then send to server.
        // * In server check again just in case... Then add and send a welcome event
        // send it back
    });


    socket.on('disconnect', () => {
        console.log(chalk.bold.bgCyanBright.black('Client', socket.id, 'disconnected.'));
        clientManager.deleteClient(socket.id);
    });
});
