import SocketIO from 'socket.io';
import logger, { errorLogHandler } from '../logger';

export default class Client {
    constructor(socket: SocketIO.Socket) {
        this.socketId = socket.id;
        this.socket = socket;
    }

    socketId: string;

    private socket: SocketIO.Socket;

    nickname?: string;

    loginTime?: number;

    lastActivity?: number;

    get isLoggedIn(): boolean {
        return !!this.nickname && !!this.loginTime;
    }

    logIn = (nickname: string, nicknamesOnline: string[], loginTime: number): void => {
        this.nickname = nickname;
        this.loginTime = loginTime;
        this.lastActivity = loginTime;
        this.startInactivityTimer();
        this.socket.emit('nickname approved', nickname, nicknamesOnline, loginTime);
        this.socket.to('chat').emit('user joined', { content: `${nickname} joined the chat.`, type: 'notification', date: loginTime });
    }

    logOut = (): void => {
        this.nickname = undefined;
        this.loginTime = undefined;
        this.lastActivity = undefined;
        this.socket.leave('chat', (err: Error | void) => errorLogHandler(() => {
            if (err) {
                throw err;
            }
        }));
    }

    private startInactivityTimer = (): void => {
        const inactivityLimit = 2 * 60 * 1000; // 2 minutes

        const disconnectInactivity = (): void => {
            this.socket.leave('chat', (err: Error | void) => errorLogHandler(() => {
                if (err) {
                    throw err;
                }
                this.socket.emit('disconnect user', 'You have now been inactive for too long... Bye');
                this.socket.broadcast.to('chat').emit('user disconnected', { content: `${this.nickname} had to leave due to inactivity`, type: 'notification', date: Date.now() });
                logger.info(`Client ${this.socket.id} was disconnected because of inactivity`);
                this.logOut();
            }));
        };

        const startRecursiveTimer = (
            firstActivityTimestamp: number, latterActivityTimestamp: number,
        ): void => {
            setTimeout(() => {
                errorLogHandler(() => {
                    const latestActivityTimestamp = this.lastActivity as number + inactivityLimit;
                    if (latestActivityTimestamp === latterActivityTimestamp) {
                        disconnectInactivity();
                        return;
                    }
                    startRecursiveTimer(latterActivityTimestamp, latestActivityTimestamp);
                });
            }, latterActivityTimestamp - firstActivityTimestamp);
        };

        const firstActivityTime = this.lastActivity as number + inactivityLimit;
        setTimeout(() => {
            const latestActivityTime = this.lastActivity as number + inactivityLimit;
            if (latestActivityTime === firstActivityTime) {
                disconnectInactivity();
                return;
            }
            startRecursiveTimer(firstActivityTime, latestActivityTime);
        }, inactivityLimit);
    }
}
