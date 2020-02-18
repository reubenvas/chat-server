// type client = {
//     socketId: string;
//     nickname: string;
// }

class ClientManager {
    clients = [];

    addClient = (client) => {
        this.clients.push(client);
    };

    addClientNickname = (clientId, nickname) => {
        const index = this.clients.findIndex(({ socketId }) => socketId === clientId);
        this.clients[index].nickname = nickname;
    }

    deleteClient = (clientId) => {
        const index = this.clients.indexOf(clientId);
        this.clients.splice(index, 1);
    };

    getClient = (clientId) => {
        const index = this.clients.findIndex(({ socketId }) => socketId === clientId);
        return this.clients[index];
    };

    getAllClients = () => this.clients;
}

module.exports = ClientManager;

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
