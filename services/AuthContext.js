import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode"

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [decodedToken, setDecodedToken] = useState(null);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('accessToken');
                if (storedToken) {
                    setToken(storedToken);
                    const decoded = jwtDecode(storedToken);
                    setDecodedToken(decoded);
                } else {
                    console.log("Токен отсутствует в AsyncStorage");
                }
            } catch (error) {
                console.error("Ошибка загрузки токена:", error);
            }
        };

        loadToken();
    }, []);

    const getToken = () => token; // Метод для получения токена

    return (
        <AuthContext.Provider value={{ token, decodedToken, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
