import ClientManager from '../../ClientManager';
import { emitDisconnectUserEvent, emitMessageInvalidEvent } from '../emitters';
import Client from '../../Client';
import logger, { errorLogHandler } from '../../logger';

export default (
    io: SocketIO.Server, socket: SocketIO.Socket, client: Client, setLastActivity: ClientManager['setLastActivity'],
) => (msg: string): void => errorLogHandler(() => {
    const { isLoggedIn, nickname } = client;

    console.log('From', socket.id, 'received message:', msg);

    if (!isLoggedIn) {
        emitDisconnectUserEvent(
            socket,
            nickname,
            'Looks like you need to log in again. Don\'t worry!',
        );
        logger.info(`Client ${socket.id} tried to send a message "${msg}" without being logged in. Emitting disconnect event`);
        return;
    }

    if (msg.length === 0) {
        emitMessageInvalidEvent(
            socket,
            msg,
            'OMG! you haven\'t even written antyhing... Try again, but this time write something',
        );
        logger.info(`Client ${socket.id} tried to send a an empty message. Emitting disconnect event`);
        return;
    }
    if (msg.length > 100) {
        emitMessageInvalidEvent(
            socket,
            msg,
            'Nooo!! Are you writing an essay? Try shortening down your message',
        );
        logger.info(`Client ${socket.id} tried to send a message "${msg}" with too many characters. Emitting disconnect event`);
        return;
    }

    const timestamp = Date.now();
    io.to('chat').emit('new message', { content: msg, sender: nickname, date: timestamp });
    setLastActivity(socket.id, timestamp);
    logger.info(`Client ${socket.id} successfully sent a message "${msg}"`);
});
