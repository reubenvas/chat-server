type Client = {
    socketId: string;
    nickname: string;
}

export default class ClientManager {
    clients: Client[] = [];

    addClient = (client: Client) => new Promise((res, rej) => {
        try {
            this.clients.push(client);
            res(this.clients.length);
        } catch (err) {
            rej(err);
        }
    });

    addClientNickname = (clientId: Client['socketId'], nickname: string) => new Promise((res, rej) => {
        try {
            const index = this.clients.findIndex(({ socketId }) => socketId === clientId);
            this.clients[index].nickname = nickname;
            res(nickname);
        } catch (err) {
            rej(err);
        }
    })

    deleteClient = (clientId: Client['socketId']) => {
        const index = this.clients.indexOf(clientId as unknown as Client);
        this.clients.splice(index, 1);
    };

    getClient = (clientId: Client['socketId']) => {
        console.log('all clients from getClient:', this.clients);
        const index = this.clients.findIndex(({ socketId }) => socketId === clientId);
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
