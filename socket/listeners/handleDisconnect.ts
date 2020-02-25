import Client from '../../Client';
import ClientManager from '../../ClientManager';
import logger, { errorLogHandler } from '../../logger';


export default (socket: SocketIO.Socket, client: Client, deleteClient: ClientManager['deleteClient'], socketAlive?: boolean) => (): void => errorLogHandler(() => {
    if (client.isLoggedIn) {
        socket.broadcast.to('chat').emit('user disconnected', client.nickname, `${client.nickname} chose to leave. Hopefully you'll meet sometime soon again.`);
    }
    if (socketAlive) {
        client.logOut();
        logger.info(`Client ${socket.id} left chat session but is still connected with socket`);
        return;
    }
    logger.info(`Client ${socket.id} disconnected from both chat and socket`);
    deleteClient(socket.id);
});
