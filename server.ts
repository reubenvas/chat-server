import SocketIO from 'socket.io';
import supervisSocketConnection from './socket/superviseSocketConnection';

const PORT = process.env.PORT || 8000;
const io = SocketIO(PORT);

supervisSocketConnection(io);

process.on('SIGINT', () => {
    console.info('SIGINT signal received.');
    io.close(() => {
        process.exit(0);
    });
});
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    io.close(() => {
        process.exit(0);
    });
});
