import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import './UserCard.css';

const UserCard = ({ user, onDeleteUser, onToggleStar }) => {
    const { username, avatar, name, url } = user;

    return (
        <div className="user-card">
            <img className="imagem" src={avatar} alt={`Avatar de ${username}`} />
            <div>
                <a href={url} target="_blank" rel="noopener noreferrer">
                    {name} (@{username})
                </a>
                <div>
                    <button onClick={() => onDeleteUser(username)}>Excluir</button>
                    <button className={user.starred ? "star-button starred" : "star-button"} onClick={() => onToggleStar(user.username)}>
                        {user.starred ? <i className="fas fa-star"></i> : <i className="far fa-star"></i>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
