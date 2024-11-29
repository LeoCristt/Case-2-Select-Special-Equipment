import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { AuthContext } from '../services/AuthContext';

const HomeScreen = ({ navigation }) => {
    const { decodedToken } = useContext(AuthContext);

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <Text style={styles.title}>Добро пожаловать в приложение!</Text>

                <View style={styles.buttonContainer}>
                    {(decodedToken.role === "master" || decodedToken.role === "admin") && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('RequestForm')}
                        >
                            <Text style={styles.buttonText}>Создать заявку</Text>
                        </TouchableOpacity>
                    )}
                    {(decodedToken.role === "logistician" || decodedToken.role === "admin") && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('RequestList')}
                        >
                            <Text style={styles.buttonText}>Посмотреть заявки</Text>
                        </TouchableOpacity>
                    )}
                    {(decodedToken.role === "dispatcher" || decodedToken.role === "admin") && (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('Dashboard')}
                        >
                            <Text style={styles.buttonText}>Рабочий стол</Text>
                        </TouchableOpacity>
                    )}
                </View>
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
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#6E473B',
        marginBottom: 30,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 15,
    },
    button: {
        backgroundColor: '#6E473B',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#E1D4C2',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default HomeScreen;