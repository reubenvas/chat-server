import SocketIO from 'socket.io';

export default class Client {
    constructor(socketId: string, socket: SocketIO.Socket) {
        this.socketId = socketId;
        this.socket = socket;
    }

    socketId: string;

    socket: SocketIO.Socket;

    nickname?: string;

    loginTime?: number;

    lastActivity?: number;

    logout = (): void => {
        this.nickname = undefined;
        this.loginTime = undefined;
        this.lastActivity = undefined;
    }

    startInactivityTimer = (): void => {
        const inactivityLimit = 2 * 60 * 1000; // 2 minutes
        const interval = setInterval(() => {
            if (this.lastActivity as number + inactivityLimit < Date.now()) {
                this.socket.emit('disconnect user', this.nickname, 'You have now been inactive for too long... Bye');
                this.socket.broadcast.emit('user inactivity', this.nickname, `${this.nickname} had to leave due to inactivity`);
                this.logout();
                clearInterval(interval);
            }
        }, 1000);
    }
}
