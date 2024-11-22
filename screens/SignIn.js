import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import { login } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        setLoading(true);
        try {
            const tokens = await login(username, password);
            await AsyncStorage.setItem('accessToken', tokens.access);
            await AsyncStorage.setItem('refreshToken', tokens.refresh);
            Alert.alert('Успешный вход', 'Добро пожаловать на платформу управления спецтехникой!');
            navigation.navigate('HomeScreen');
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            Alert.alert('Ошибка', 'Неверный логин или пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Вход в систему</Text>
            <Button title="Войти" onPress={() => navigation.navigate('Main')} color="#FFC107" />
            <TextInput
                style={styles.input}
                placeholder="Логин"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {loading ? (
                <ActivityIndicator size="large" color="#FFC107" />
            ) : (
                <Button title="Войти" onPress={handleSignIn} color="#FFC107" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
});

export default SignInScreen;