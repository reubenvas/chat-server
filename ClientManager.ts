type Client = {
    socketId: string;
    nickname: string;
    loginTime: number;
    lastActivity?: number;
}

export default class ClientManager {
    private clients: Client[] = [];

    private findClientIndex = (clientSocketId: string) => (
        this.clients.findIndex(({ socketId }) => socketId === clientSocketId)
    );

    addClient = (client: Client) => new Promise((res, rej) => {
        try {
            this.clients.push(client);
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

    setLastActivity = (clientSocketId: Client['socketId'], timeStamp: number) => {
        const index = this.findClientIndex(clientSocketId);
        this.clients[index].lastActivity = timeStamp;
    };

    deleteClient = (clientSocketId: Client['socketId']) => {
        const index = this.findClientIndex(clientSocketId);
        this.clients.splice(index, 1);
    };

    getClient = (clientSocketId: Client['socketId']) => {
        console.log('all clients from getClient:', this.clients);
        const index = this.findClientIndex(clientSocketId);
        console.log('this is the index:', index);
        return this.clients[index];
    };

    getAllClients = () => this.clients;
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
