import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../services/AuthContext'; 

const HomeScreen = ({ navigation }) => {
    const { token, decodedToken } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Добро пожаловать в приложение!</Text>
            {(decodedToken.role === "master" || decodedToken.role === "admin") && (
                <Button
                title="Создать заявку"
                onPress={() => navigation.navigate('RequestForm')}
                color="#FFC107" 
                />
            )}
            {(decodedToken.role === "logistician" || decodedToken.role === "admin") && (
                <Button
                title="Посмотреть заявки"
                onPress={() => navigation.navigate('RequestList')}
                 color="#FFC107" 
                />
            )}
            {(decodedToken.role === "dispatcher" || decodedToken.role === "admin") && (
                <Button
                title="Рабочий стол"
                onPress={() => navigation.navigate('Dashboard')}
                color="#FFC107" 
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
        backgroundColor: '#e0f7fa', 
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
        color: '#003366', 
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 10, 
    },
});

export default HomeScreen;