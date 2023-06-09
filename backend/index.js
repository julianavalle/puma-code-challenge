const axios = require('axios');
const express = require("express");
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const MAX_favoriteUsers = 5;

let favoriteUsers = [];

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

app.post('/users', async (req, res) => {
    const { username } = req.body;

    if (favoriteUsers.some(user => user.username === username)) {
        return res.status(400).json({ error: 'Usuário já adicionado' });
    }

    if (favoriteUsers.length >= MAX_favoriteUsers) {
        return res.status(400).json({ error: 'Limite de usuários favoritos atingido' });
    }

    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);

        const { login, name, avatar_url, html_url } = response.data;

        const newUser = {
            username: login,
            name,
            avatar: avatar_url,
            url: html_url,
            starred: false
        };

        favoriteUsers.push(newUser);

        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }
});

app.get('/users', (req, res) => {
    const { sort } = req.query;

    let sortedUsers = [...favoriteUsers];

    if (sort === 'name') {
        sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
    }

    return res.json(sortedUsers);
});

app.delete('/users/:username', (req, res) => {
    const { username } = req.params;

    const userIndex = favoriteUsers.findIndex((user) => user.username === username);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    favoriteUsers.splice(userIndex, 1);

    res.sendStatus(204);
});

app.patch('/users/:username/toggle-star', (req, res) => {
    const { username } = req.params;

    const user = favoriteUsers.find((user) => user.username === username);
    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    favoriteUsers.forEach((user) => {
        if (user.username === username) {
            user.starred = !user.starred;
        } else {
            user.starred = false;
        }
    });

    res.sendStatus(204);
});
