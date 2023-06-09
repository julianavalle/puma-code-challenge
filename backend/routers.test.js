const axios = require('axios');
const { favoriteUsers, server } = require('./index');

describe('POST /users', () => {
    it('should add a new user to favoriteUsers array when a valid username is provided', async () => {
        const response = await axios.post('http://localhost:3000/users', { username: 'sehun' });
        expect(response.status).toBe(201);
        expect(response.data.username).toBe('sehun');
        expect(response.data.starred).toBe(false);
    });

    it('should return an error when trying to add a user that already exists in favoriteUsers array', async () => {
        favoriteUsers.push({ username: 'sehun', starred: false });

        try {
            const response = await axios.post('http://localhost:3000/users', { username: 'sehun' });
            expect(response.status).toBe(400);
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data.error).toBe('Usuário já adicionado');
        }
    });


    describe('GET /users', () => {

        it('should return the favoriteUsers array without sorting when no sort query parameter is provided', async () => {
            const source = axios.CancelToken.source()
            const response = await axios.get('http://localhost:3000/users', { cancelToken: source.token });
            expect(response.status).toBe(200);
            source.cancel('Test completed');
        });
    });
});

describe('DELETE /users/:username', () => {
    beforeEach(() => {
        favoriteUsers.splice(0, favoriteUsers.length);
    });

    it('should remove the user from favoriteUsers array when a valid username is provided', async () => {
        const username = 'sehun';

        favoriteUsers.push({ username, starred: false });

        const response = await axios.delete(`http://localhost:3000/users/${username}`);
        expect(response.status).toBe(204);
        expect(favoriteUsers.length).toBe(0);
    });

    it('should return an error when trying to delete a user that does not exist', async () => {
        const notValidUser = 'notValidUser';

        try {
            await axios.delete(`http://localhost:3000/users/${notValidUser}`);
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data.error).toBe('Usuário não encontrado.');
        }
    });
});

describe('PATCH /users/:username/toggle-star', () => {
    beforeEach(() => {
        // Limpa o array de favoriteUsers antes de cada teste
        favoriteUsers.length = 0;
    });

    afterAll((done) => {
        server.close(() => {
            console.log('Server closed');
            done();
        });
    });

    it('should toggle the star property of the specified user and set all other users as unstarred', async () => {
        favoriteUsers.push(
            { username: 'sehun', starred: true },
            { username: 'taeyeon', starred: false },
            { username: 'yeonjun', starred: false }
        );

        const username = 'sehun';
        const response = await axios.patch(`http://localhost:3000/users/${username}/toggle-star`);

        expect(response.status).toBe(204);
        const updatedUser = favoriteUsers.find(user => user.username === username);
        expect(updatedUser.starred).toBe(false);
        favoriteUsers.forEach(user => {
            if (user.username !== username) {
                expect(user.starred).toBe(false);
            }
        });
    });

    it('should return 404 if the specified user is not found', async () => {
        const username = 'nonexistent';
        try {
            await axios.patch(`http://localhost:3000/users/${username}/toggle-star`);
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });
});


afterAll((done) => {
    server.close(() => {
        console.log('Server closed');
        done();
    });
});