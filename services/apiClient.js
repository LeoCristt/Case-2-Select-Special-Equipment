import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccessToken } from './auth'; // Импорт вашей функции

const API_URL = "http://192.168.0.79:8000/api";

const apiClient = axios.create({
    baseURL: API_URL,
});

// Интерсептор для автоматического обновления токена
apiClient.interceptors.response.use(
    (response) => response, // Если запрос успешный, просто возвращаем ответ
    async (error) => {
        const originalRequest = error.config;

        // Если ошибка 401 и токен истёк
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('Refresh token отсутствует');
                }

                // Обновляем accessToken
                const { access } = await refreshAccessToken(refreshToken);

                // Сохраняем новый accessToken
                await AsyncStorage.setItem('accessToken', access);

                // Обновляем заголовок Authorization
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                originalRequest.headers['Authorization'] = `Bearer ${access}`;

                // Повторяем оригинальный запрос с новым токеном
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error('Не удалось обновить токен:', refreshError);
                throw refreshError; // Генерируем ошибку, чтобы приложение знало о проблеме
            }
        }

        throw error; // Если это другая ошибка, просто передаём её дальше
    }
);

export default apiClient;
