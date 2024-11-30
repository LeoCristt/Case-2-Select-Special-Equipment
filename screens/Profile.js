import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../services/AuthContext';

const ProfileScreen = ({ navigation }) => {
    const { token, decodedToken } = useContext(AuthContext);

    const user = {
        name: decodedToken.username,
        role: decodedToken.role,
        email: decodedToken.email,
    };

    const handleLogout = () => {
        console.log('Выход из аккаунта');
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
        });
        // Например, очистка токенов, переход на экран входа и т.д.
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <View style={styles.profileInfo}>
                    <Image
                        source={getProfileImage(user.role)}
                        style={styles.avatar}
                    />
                    <Text style={styles.userName}>Имя: {user.name}</Text>
                    <Text style={styles.userRole}>Роль: {user.role}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.commonButton, styles.logoutButton]} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Выйти</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

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

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(41, 28, 14, 0.7)',
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
    profileInfo: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#6E473B',  // Using the same accent color
        marginBottom: 10,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6E473B',
        marginBottom: 5,
    },
    userRole: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6E473B',
    },
    buttonContainer: {
        marginTop: 5,
    },
    commonButton: {
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButton: {
        backgroundColor: '#ff3d00',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default ProfileScreen;
