import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../services/AuthContext'; // Убедитесь, что путь к AuthContext корректен

const HomeScreen = ({ navigation }) => {
    const { token, decodedToken } = useContext(AuthContext);
    console.log(decodedToken.role)

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Добро пожаловать в приложение!</Text>
            {(decodedToken.role === "master" || decodedToken.role === "admin") && (
                <Button
                title="Создать заявку"
                onPress={() => navigation.navigate('RequestForm')}
                color="#FFC107" // Цвет кнопки
                />
            )}
            {(decodedToken.role === "logistician" || decodedToken.role === "admin") && (
                <Button
                title="Посмотреть заявки"
                onPress={() => navigation.navigate('RequestList')}
                 color="#FFC107" // Цвет кнопки
                />
            )}
            {(decodedToken.role === "dispatcher" || decodedToken.role === "admin") && (
                <Button
                title="Рабочий стол"
                onPress={() => navigation.navigate('Dashboard')}
                color="#FFC107" // Цвет кнопки
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0f7fa', // Измененный цвет фона
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
        color: '#003366', // Цвет заголовка
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 10, // Отступ между кнопками
    },
});

export default HomeScreen;