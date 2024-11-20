import axios from 'axios';

const API_URL = "http://192.168.0.79:8000/api";
let accessToken = null;

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/token/`, { username, password });
        accessToken = response.data.access;
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return response.data;
    } catch (error) {
        console.error('Ошибка при входе:', error);
        throw error;
    }
};

export const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
        accessToken = response.data.access;
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
        throw error;
    }
};
