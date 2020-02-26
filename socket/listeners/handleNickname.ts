import ClientManager from '../../clientManagement/ClientManager';
import Client from '../../clientManagement/Client';
import logger, { errorLogHandler } from '../../logger';

export default (socket: SocketIO.Socket, client: Client, allClients: ClientManager['allClients']) => (nickname: string): void => errorLogHandler(() => {
    if (allClients.some((c) => c.nickname && c.nickname.toLowerCase() === nickname.toLowerCase())) {
        socket.emit(
            'nickname invalid',
            'This nickname is alredy taken by another user',
        );
        logger.info(`Client ${socket.id} tried to set the nickname '${nickname}' but it was taken by another user`);
        return;
    }

    if (nickname.length < 3) {
        socket.emit(
            'nickname invalid',
            'This nickname is way too short',
        );
        logger.info(`Client ${socket.id} tried to set the nickname '${nickname}' but it is too short`);
        return;
    }

    if (nickname.length > 10) {
        socket.emit(
            'nickname invalid',
            'This nickname is way too long',
        );
        logger.info(`Client ${socket.id} tried to set the nickname '${nickname}' but it is too long`);
        return;
    }

    if (!/^[A-Öa-ö]+$/.test(nickname)) {
        socket.emit(
            'nickname invalid',
            'This nickname contains other characters than letters',
        );
        logger.info(`Client ${socket.id} tried to set the nickname '${nickname}' but it contains other characters than letters`);
        return;
    }

    socket.join('chat', (err: Error | void) => errorLogHandler(() => {
        if (err) {
            throw err;
        }
        const nicknamesOnline = allClients.map((c) => c.nickname).filter((nn) => nn) as string[];
        client.logIn(nickname, nicknamesOnline, Date.now());
        logger.info(`Client ${socket.id} successfully set the nickname '${nickname}'"`);
    }));
});
