import SocketIO from 'socket.io';
import supervisSocketConnection from './socket/superviseSocketConnection';
import logger from './logger';

const PORT = process.env.PORT || 8000;
const io = SocketIO(PORT);
logger.info(`Server started on port: ${PORT}`);

supervisSocketConnection(io);

process.on('SIGINT', () => {
    logger.info('Server terminated on received SIGINT signal');
    io.close(() => {
        process.exit(0);
    });
});
process.on('SIGTERM', () => {
    logger.info('Server terminated on received SIGTERM signal');
    io.close(() => {
        process.exit(0);
    });
});
