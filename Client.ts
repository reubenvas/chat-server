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

        const startRecursiveTimer = (
            firstActivityTimestamp: number, latterActivityTimestamp: number,
        ): void => {
            setTimeout(() => {
                const latestActivityTimestamp = this.lastActivity as number + inactivityLimit;
                if (latestActivityTimestamp === latterActivityTimestamp) {
                    this.socket.leave('chat', (err: Error | void) => {
                        if (err) {
                            throw err;
                        }
                        this.socket.emit('disconnect user', this.nickname, 'You have now been inactive for too long... Bye');
                        this.socket.broadcast.to('chat').emit('user inactivity', this.nickname, `${this.nickname} had to leave due to inactivity`);
                        this.logout();
                    });
                    return;
                }
                startRecursiveTimer(latterActivityTimestamp, latestActivityTimestamp);
            }, latterActivityTimestamp - firstActivityTimestamp);
        };

        const firstActivityTime = this.lastActivity as number + inactivityLimit;
        setTimeout(() => {
            const latestActivityTime = this.lastActivity as number + inactivityLimit;
            if (latestActivityTime === firstActivityTime) {
                this.socket.leave('chat', (err: Error | void) => {
                    if (err) {
                        throw err;
                    }
                    this.socket.emit('disconnect user', this.nickname, 'You have now been inactive for too long... Bye');
                    this.socket.broadcast.to('chat').emit('user inactivity', this.nickname, `${this.nickname} had to leave due to inactivity`);

                    this.logout();
                });
                return;
            }
            startRecursiveTimer(firstActivityTime, latestActivityTime);
        }, inactivityLimit);
    }
}
