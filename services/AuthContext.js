import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode"

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [decodedToken, setDecodedToken] = useState(null);

    // Загрузка токена при первом рендере
    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('accessToken');
                if (storedToken) {
                    updateToken(storedToken);
                } else {
                    console.log("Токен отсутствует в AsyncStorage");
                }
            } catch (error) {
                console.error("Ошибка загрузки токена:", error);
            }
        };

        loadToken();
    }, []);

    // Функция для обновления токена
    const updateToken = (newToken) => {
        setToken(newToken);

        if (newToken) {
            try {
                const decoded = jwtDecode(newToken);
                setDecodedToken(decoded);
            } catch (error) {
                console.error("Ошибка декодирования токена:", error);
                setDecodedToken(null);
            }
        } else {
            setDecodedToken(null);
        }
    };

    // Метод для явной смены токена (например, после входа)
    const refreshToken = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('accessToken');
            updateToken(storedToken);
        } catch (error) {
            console.error("Ошибка обновления токена из AsyncStorage:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ token, decodedToken, updateToken, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
