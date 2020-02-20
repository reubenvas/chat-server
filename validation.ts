import clientManager from './ClientManager';

export default {
    nickname: {
        invalid: {
            alreadyInUse: {
                message: 'This nickname is alredy taken by another visitor',
                invalidate: (nickname: string) => clientManager.getAllClients()
                    .map((client) => client.nickname).includes(nickname),
            },
            tooShort: {
                message: 'This nickname is way too short',
                invalidate: (nickname: string) => nickname.length < 3,
            },
            tooLong: {
                message: 'This nickname is way too long',
                invalidate: (nickname: string) => nickname.length > 6,
            },
            notOnlyLetters: {
                message: 'This nickname contains other characters than letters',
                invalidate: (nickname: string) => !/^[A-Za-z]+$/.test(nickname),
            },
        },
    },
};
