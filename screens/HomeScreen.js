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
                />
            )}
            {(decodedToken.role === "logistician" || decodedToken.role === "admin") && (
                <Button
                title="Посмотреть заявки"
                onPress={() => navigation.navigate('RequestList')}
                />
            )}
            {(decodedToken.role === "dispatcher" || decodedToken.role === "admin") && (
                <Button
                title="Рабочий стол"
                onPress={() => navigation.navigate('Dashboard')}
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
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
    },
});

export default HomeScreen;