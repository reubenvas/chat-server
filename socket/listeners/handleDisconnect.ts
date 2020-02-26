import Client from '../../clientManagement/Client';
import ClientManager from '../../clientManagement/ClientManager';
import logger, { errorLogHandler } from '../../logger';


export default (socket: SocketIO.Socket, client: Client, deleteClient?: ClientManager['deleteClient']) => (): void => errorLogHandler(() => {
    if (client.isLoggedIn) {
        socket.broadcast.to('chat').emit('user disconnected', { content: `${client.nickname} chose to leave.`, type: 'notification', date: Date.now() });
    }
    if (!deleteClient) {
        client.logOut();
        logger.info(`Client ${socket.id} left chat session but is still connected with socket`);
        return;
    }
    logger.info(`Client ${socket.id} disconnected from both chat and socket`);
    deleteClient(socket.id);
});
