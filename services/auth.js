import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://192.168.0.28:8000/api";

export const login = async (username, password, updateToken) => {
    try {
        const response = await axios.post(`${API_URL}/token/`, { username, password });
        const accessToken = response.data.access;
        const refreshToken = response.data.refresh;

        // Установка заголовка авторизации
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        // Сохранение токенов в AsyncStorage
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);

        // Обновление токена в контексте
        updateToken(accessToken);

        return response.data;
    } catch (error) {
        console.error('Ошибка при входе:', error);
        throw error;
    }
};

export const refreshAccessToken = async (updateToken) => {
    try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('Refresh token отсутствует');
        }

        const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
        const accessToken = response.data.access;

        // Установка заголовка авторизации
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        // Сохранение нового access токена
        await AsyncStorage.setItem('accessToken', accessToken);

        // Обновление токена в контексте
        updateToken(accessToken);
    } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
        throw error;
    }
};
