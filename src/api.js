import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api',
});

export const fetchUsers = () => API.get('/users');
export const createUser = (user) => API.post('/users', user);
export const getUser = (id) => API.get(`/users/${id}`);
export const updateUser = (id, user) => API.put(`/users/${id}`, user);
export const deleteUser = (id) => API.delete(`/users/${id}`);
