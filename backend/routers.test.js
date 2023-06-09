const axios = require('axios');
const { favoriteUsers } = require('./index');

describe('POST /users', () => {
    it('should add a new user to favoriteUsers array when a valid username is provided', async () => {
        const response = await axios.post('http://localhost:3000/users', { username: 'john' });
        expect(response.status).toBe(201);
        expect(response.data.username).toBe('john');
        expect(response.data.starred).toBe(false);
    });

    it('should return an error when trying to add a user that already exists in favoriteUsers array', async () => {
        favoriteUsers.push({ username: 'john', starred: false });

        try {
            const response = await axios.post('http://localhost:3000/users', { username: 'john' });
            expect(response.status).toBe(400);
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data.error).toBe('Usuário já adicionado');
        }
    });


    describe('GET /users', () => {

        it('should return the favoriteUsers array without sorting when no sort query parameter is provided', async () => {
            const response = await axios.get('http://localhost:3000/users');
            expect(response.status).toBe(200);
        });
    });
});

