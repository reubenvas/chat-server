import SocketIO from 'socket.io';
import { emitNicknameApprovedEvent } from './socket/emitters';
import logger, { errorLogHandler } from './logger';

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

    logIn = (nickname: string, loginTime: number): void => {
        this.nickname = nickname;
        this.loginTime = loginTime;
        this.lastActivity = loginTime;
        this.startInactivityTimer();
        emitNicknameApprovedEvent(this.socket, nickname);
    }

    logOut = (): void => {
        this.nickname = undefined;
        this.loginTime = undefined;
        this.lastActivity = undefined;
        this.socket.leave('chat');
    }

    private startInactivityTimer = (): void => {
        const inactivityLimit = 2 * 60 * 1000; // 2 minutes

        const startRecursiveTimer = (
            firstActivityTimestamp: number, latterActivityTimestamp: number,
        ): void => {
            setTimeout(() => {
                errorLogHandler(() => {
                    const latestActivityTimestamp = this.lastActivity as number + inactivityLimit;
                    if (latestActivityTimestamp === latterActivityTimestamp) {
                        this.socket.leave('chat', (err: Error | void) => {
                            if (err) {
                                throw err;
                            }
                            this.socket.emit('disconnect user', this.nickname, 'You have now been inactive for too long... Bye');
                            this.socket.broadcast.to('chat').emit('user inactivity', this.nickname, `${this.nickname} had to leave due to inactivity`);
                            logger.info(`Client ${this.socket.id} was disconnected because of inactivity`);
                            this.logOut();
                        });
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
                this.socket.leave('chat', (err: Error | void) => {
                    if (err) {
                        throw err;
                    }
                    this.socket.emit('disconnect user', this.nickname, 'You have now been inactive for too long... Bye');
                    this.socket.broadcast.to('chat').emit('user inactivity', this.nickname, `${this.nickname} had to leave due to inactivity`);
                    logger.info(`Client ${this.socket.id} was disconnected because of inactivity`);
                    this.logOut();
                });
                return;
            }
            startRecursiveTimer(firstActivityTime, latestActivityTime);
        }, inactivityLimit);
    }
}
