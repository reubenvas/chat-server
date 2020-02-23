import Client from './Client';


export default class ClientManager {
    private clients: Client[] = [];

    addClient = (socket: SocketIO.Socket): number => {
        this.clients.push(new Client(socket));
        return this.clients.length;
    };

    deleteClient = (clientSocketId: Client['socketId']): void => {
        const index = this.clients.findIndex(({ socketId }) => socketId === clientSocketId);
        this.clients.splice(index, 1);
    };

    setLastActivity = (clientSocketId: Client['socketId'], timestamp: number): void => {
        const client = this.getClient(clientSocketId);
        client.lastActivity = timestamp;
    };

    getClient = (clientSocketId: Client['socketId']): Client | never => {
        const client = this.clients.find((({ socketId }) => socketId === clientSocketId));
        if (!client) {
            throw new Error('Client could not be found.');
        }
        return client;
    };

    get allClients(): Client[] {
        return this.clients;
    }
}
