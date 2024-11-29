import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import { login } from '../services/auth';
import { AuthContext } from '../services/AuthContext';

const SignInScreen = ({ navigation }) => {
    const { updateToken } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        setLoading(true);
        try {
            const tokens = await login(username, password, updateToken);
            Alert.alert('Успешный вход', 'Добро пожаловать!');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            Alert.alert('Ошибка', 'Неверный логин или пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <Text style={styles.title}>Добро пожаловать!</Text>
                <Text style={styles.subtitle}>Войдите, чтобы продолжить</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Логин"
                    placeholderTextColor="#A78D78"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Пароль"
                    placeholderTextColor="#A78D78"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#A78D78" />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                        <Text style={styles.buttonText}>Войти</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(41, 28, 14, 0.8)', // Полупрозрачный фон
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        backgroundColor: '#E1D4C2',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#6E473B',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#A78D78',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#BEB5A9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#291C0E',
        borderWidth: 1,
        borderColor: '#6E473B',
    },
    button: {
        backgroundColor: '#6E473B',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#E1D4C2',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SignInScreen;
