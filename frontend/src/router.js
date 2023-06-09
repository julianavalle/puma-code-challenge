import axios from 'axios';

const router = axios.create({
  baseURL: 'http://localhost:3000',
});

export const fetchFavoriteUsers = async (sort) => {
  try {
    const response = await router.get('/users', { params: { sort } });
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite users:', error);
    throw error;
  }
};

export const addUser = async (username) => {
  try {
    const response = await router.post('/users', { username });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const deleteUser = async (username) => {
  try {
    await router.delete(`/users/${username}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const toggleStar = async (username) => {
  try {
    await router.patch(`/users/${username}/toggle-star`);
  } catch (error) {
    console.error('Error toggling star:', error);
    throw error;
  }
};