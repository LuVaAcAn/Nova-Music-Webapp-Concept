import axios from 'axios';

const API_URL = 'http://localhost:3000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = () => api.get('users');
export const createUser = (userData) => api.post('users', userData);

export default api;