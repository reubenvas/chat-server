import SocketIO from 'socket.io';
import superviseSocketConnection from './socket/superviseSocketConnection';
import logger from './logger';

const PORT = process.env.PORT || 8000;
const io = SocketIO(PORT);
logger.info(`Server started on port: ${PORT}`);

superviseSocketConnection(io);

const gracefulShutDown = (signal: string) => (): void => {
    logger.info(`Server terminated on received ${signal} signal`);
    io.close(() => {
        process.exit(0);
    });
};

process.on('SIGINT', gracefulShutDown('SIGINT'));
process.on('SIGTERM', gracefulShutDown('SIGTERM'));
