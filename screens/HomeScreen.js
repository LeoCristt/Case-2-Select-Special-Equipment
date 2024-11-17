import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Добро пожаловать в приложение!</Text>
            <Button
                title="Создать заявку"
                onPress={() => navigation.navigate('RequestForm')}
            />
            <Button
                title="Посмотреть заявки"
                onPress={() => navigation.navigate('RequestList')}
            />
            <Button
                title="Рабочий стол"
                onPress={() => navigation.navigate('Dashboard')}
            />
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