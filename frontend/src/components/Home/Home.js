import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchFavoriteUsers, addUser, deleteUser, toggleStar } from '../../router.js';
import UserCard from '../UserCard/UserCard';
import './Home.css';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState('');
    const [error, setError] = useState('');

    const closeError = () => {
        setError('');
    };

    useEffect(() => {
        const getUsers = async () => {
            try {
                const fetchedUsers = await fetchFavoriteUsers('name');
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error fetching favorite users:', error);
            }
        };

        getUsers();
    }, []);

    const handleAddUser = async () => {
        setError('');

        try {
            const response = await axios.post('/users', { username: newUser });
            const addedUser = response.data;

            setUsers((prevUsers) => [...prevUsers, addedUser]);
            setNewUser('');
        } catch (error) {
            if (error.response) {
                const { data } = error.response;
                setError(data.error);
            } else {
                setError('Erro ao adicionar usuário favorito.');
            }
        }
    };

    const handleDeleteUser = async (username) => {
        setError('');

        try {
            await deleteUser(username);

            setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
        } catch (error) {
            setError('Erro ao excluir usuário favorito.');
            console.error('Error deleting favorite user:', error);
        }
    };

    const handleToggleStar = async (username) => {
        setError('');

        try {
            await toggleStar(username);

            setUsers((prevUsers) =>
                prevUsers.map((user) => {
                    if (user.username === username) {
                        return { ...user, starred: !user.starred };
                    } else {
                        return { ...user, starred: false };
                    }
                })
            );
        } catch (error) {
            setError('Erro ao atualizar a estrela do usuário.');
            console.error('Error toggling star:', error);
        }
    };

    return (
        <div>
            <h1 className="title">Usuários Favoritos GitHub</h1>

            {
                error && (
                    <div className="error-popup">
                        <p>{error}</p>
                        <button className="close-button" onClick={closeError}>
                            &times;
                        </button>
                    </div>
                )
            }

            <div className="add-user-container">
                <div className="add-user-box">
                    <input
                        className="add-user-input"
                        type="text"
                        value={newUser}
                        onChange={(e) => setNewUser(e.target.value)}
                        placeholder="Digite o nome de usuário"
                    />
                    <button className="add-user-button" onClick={handleAddUser}>Adicionar</button>
                </div>
            </div>

            <div className="user-list">
                {users.map((user) => (
                    <UserCard
                        key={user.username}
                        user={user}
                        onDeleteUser={handleDeleteUser}
                        onToggleStar={handleToggleStar}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
