import Client from './Client';


export default class ClientManager {
    private clients: Client[] = [];

    private findClientIndex = (clientSocketId: string): number => (
        this.clients.findIndex(({ socketId }) => socketId === clientSocketId)
    );

    addClient = (socketId: string, socket: SocketIO.Socket): Promise<number | string> => new Promise((res, rej) => {
        try {
            this.clients.push(new Client(socketId, socket));
            res(this.clients.length);
        } catch (err) {
            rej(err);
        }
    });

    setNickname = (clientSocketId: Client['socketId'], nickname: string): Promise<string> => new Promise((res, rej) => {
        try {
            const index = this.findClientIndex(clientSocketId);
            this.clients[index].nickname = nickname;
            res(nickname);
        } catch (err) {
            rej(err);
        }
    });

    setLastActivity = (clientSocketId: Client['socketId'], timestamp: number): void => {
        const index = this.findClientIndex(clientSocketId);
        this.clients[index].lastActivity = timestamp;
    };

    setLoginTime = (clientSocketId: Client['socketId'], timestamp: number): void => {
        const index = this.findClientIndex(clientSocketId);
        this.clients[index].loginTime = timestamp;
    };

    deleteClient = (clientSocketId: Client['socketId']): void => {
        const index = this.findClientIndex(clientSocketId);
        this.clients.splice(index, 1);
    };

    getClient = (clientSocketId: Client['socketId']): Client => {
        const index = this.findClientIndex(clientSocketId);
        return this.clients[index];
    };



    getAllClients = (): Client[] => this.clients;
}


// const clients = [];


// const addClient = (client) => {
//     clients.push(client);
// };

// const deleteClient = (clientId) => {
//     const index = clients.indexOf(clientId);
//     clients.splice(index, 1);
// };

// const getAllClients = () => clients;

// module.exports = {
//     addClient, getAllClients, deleteClient,
// };

// export default new ClientManager();
