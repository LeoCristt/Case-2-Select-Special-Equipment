import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

// Функция для получения изображения в зависимости от роли
const getProfileImage = (role) => {
    switch (role) {
        case 'dispatcher':
            return require('../assets/profilelogo/dispatcher.png'); 
        case 'logistician':
            return require('../assets/profilelogo/logistician.png'); 
        case 'master':
            return require('../assets/profilelogo/master.png'); 
        case 'admin':
            return require('../assets/profilelogo/admin.png');
        default:
            return require('../assets/profilelogo/default.png'); 
    }
};

// Примерные данные пользователя
const mockUserData = {
    name: 'Иван Иванов',
    email: 'ivan.ivanov@example.com',
    role: 'admin', // Пример роли
};

const ProfileScreen = ({ navigation }) => {
    const user = mockUserData; // Используем примерные данные

    const handleLogout = () => {
        // Логика выхода из аккаунта
        console.log('Выход из аккаунта');
        // Например, очистка токенов, переход на экран входа и т.д.
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <Image
                    source={getProfileImage(user.role)} // Используем функцию для получения изображения
                    style={styles.avatar}
                />
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userRole}>Роль: {user.role}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Выйти</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#6200ee',
        marginBottom: 10,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    userRole: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#ff3d00',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;