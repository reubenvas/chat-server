export const emitDisconnectUserEvent = (
    socket: SocketIO.Socket, nickname: string | undefined, message: string,
): void => {
    socket.emit('disconnect user', nickname, message);
};

export const emitMessageInvalidEvent = (
    socket: SocketIO.Socket, chatMessage: string, message: string,
): void => {
    socket.emit('message invalid', chatMessage, message);
};

export const emitNicknameInvalidEvent = (
    socket: SocketIO.Socket, nickname: string, message: string,
): void => {
    socket.emit('nickname invalid', nickname, message);
};

export const emitNicknameApprovedEvent = (
    socket: SocketIO.Socket, nickname: string,
): void => {
    socket.emit('nickname approved', nickname);
};
