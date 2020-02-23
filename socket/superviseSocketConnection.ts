import chalk from 'chalk';
import ClientManager from '../ClientManager';
import handleMessage from './listeners/handleMessage';
import handleNickname from './listeners/handleNickname';
import handleDisconnect from './listeners/handleDisconnect';
import logger, { errorLogHandler } from '../logger';

const {
    addClient, getClient, setLastActivity, deleteClient, allClients,
} = new ClientManager();

export default (io: SocketIO.Server): void => {
    io.on('connection', (socket) => {
        errorLogHandler(() => {

            logger.info(`Client with socket id "${socket.id}" connected`);

            addClient(socket);
            const client = getClient(socket.id);

            socket.on('message', handleMessage(io, socket, client, setLastActivity));
            socket.on('set nickname', handleNickname(socket, client, allClients));
            socket.on('disconnect user', handleDisconnect(socket, client, deleteClient, true));
            socket.on('disconnect', handleDisconnect(socket, client, deleteClient));
        });
    });
};
