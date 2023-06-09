import React, { useEffect, useState } from 'react';
import { fetchFavoriteUsers, addUser, deleteUser, toggleStar } from '../../router.js';
import UserCard from '../UserCard/UserCard';
import './Home.css';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState('');
    const [error, setError] = useState('');

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
            const addedUser = await addUser(newUser);

            setUsers((prevUsers) => [...prevUsers, addedUser]);
            setNewUser('');
        } catch (error) {
            setError('Erro ao adicionar usuário favorito.');
            console.error('Error adding favorite user:', error);
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
            {error && <p>{error}</p>}
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
