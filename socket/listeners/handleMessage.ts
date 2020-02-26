import ClientManager from '../../clientManagement/ClientManager';
import Client from '../../clientManagement/Client';
import logger, { errorLogHandler } from '../../logger';

export default (
    io: SocketIO.Server, socket: SocketIO.Socket, client: Client, setLastActivity: ClientManager['setLastActivity'],
) => (msg: string): void => errorLogHandler(() => {
    const { isLoggedIn, nickname } = client;

    if (!isLoggedIn) {
        socket.emit(
            'disconnect user',
            'Looks like you need to log in again. Don\'t worry!',
        );
        logger.info(`Client ${socket.id} tried to send a message '${msg}' without being logged in. Emitting disconnect event`);
        return;
    }

    if (msg.length === 0) {
        socket.emit(
            'message invalid',
            'OMG! you haven\'t even written antyhing... Try again, but this time write something',
        );
        logger.info(`Client ${socket.id} tried to send a an empty message`);
        return;
    }
    if (msg.length > 100) {
        socket.emit(
            'message invalid',
            'Nooo!! Are you writing an essay? Try shortening down your message',
        );
        logger.info(`Client ${socket.id} tried to send a message '${msg}' with too many characters`);
        return;
    }

    const timestamp = Date.now();
    io.to('chat').emit('new message', {
        content: msg, sender: nickname, date: timestamp, type: 'message',
    });
    setLastActivity(socket.id, timestamp);
    logger.info(`Client ${socket.id} successfully sent a message '${msg}'`);
});
