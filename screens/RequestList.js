import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { jwtDecode } from "jwt-decode"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchRequests, sendRequests } from '../services/api';

const RequestList = ({ navigation }) => {
    const [requests, setRequests] = useState([]);
    const [subdivision, setSubdivision] = useState('');

    useEffect(() => {
        const decodeJWT = async () => {
            try {
                const token = await getAuthToken();
                console.log("Получен токен:", token);  // Проверка полученного токена
                if (token) {
                    const decoded = jwtDecode(token);
                    console.log("Декодированный токен:", decoded);  // Проверка декодированного токена
                    setSubdivision(decoded.subdivision);
                } else {
                    console.log("Токен не найден");
                }
            } catch (error) {
                console.error('Ошибка при декодировании JWT:', error);
            }
        };
        

        decodeJWT();
    }, []);

    useEffect(() => {
        const loadRequests = async () => {
            try {
                if (!subdivision) return;
                const fetchedRequests = await fetchRequests(subdivision);
                setRequests(fetchedRequests);
            } catch (error) {
                console.error('Ошибка при загрузке заявок:', error);
            }
        };

        loadRequests();
    }, [subdivision]);

    const navigateToDetail = (request) => {
        navigation.navigate('RequestDetail', { request });
    };

    const navigateToEdit = (request) => {
        navigation.navigate('EditRequest', { request });
    };

    const handleSendRequests = async () => {
        try {
            const requestIds = requests.map(request => request.id);
            await sendRequests(requestIds);
            setRequests([]);
            Alert.alert('Успех', 'Все заявки успешно отправлены!');
        } catch (error) {
            console.error('Ошибка при отправке заявок:', error);
            Alert.alert('Ошибка', 'Не удалось отправить заявки.');
        }
    };

    const renderRequestItem = ({ item }) => (
        <View style={styles.requestItem}>
            <TouchableOpacity onPress={() => navigateToDetail(item)}>
                <Text style={styles.requestTitle}>Заявка: {item.master}</Text>
                <View style={styles.datesContainer}>
                    <FlatList
                        data={item.date_type_quantity_plannedWorkTime}
                        renderItem={({ item: dateItem }) => (
                            <View style={styles.dateItem}>
                                <Text style={styles.separator}>-----------------------------------------------------</Text>
                                <Text>Тип техники: {dateItem.type}</Text>
                                <Text>Количество: {dateItem.quantity}</Text>
                                <Text>Плановое время работы: {dateItem.plannedWorkTime}</Text>
                                <Text>Время подачи: {dateItem.date}</Text>
                                <Text style={styles.separator}>-----------------------------------------------------</Text>
                            </View>
                        )}
                        keyExtractor={(dateItem, index) => index.toString()}
                    />
                </View>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <Button 
                    title="Редактировать" 
                    onPress={() => navigateToEdit(item)} 
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                renderItem={renderRequestItem}
                keyExtractor={(item) => item.id.toString()}
            />
            {requests.length > 0 && (
                <Button 
                    title="Отправить заявки" 
                    onPress={handleSendRequests} 
                />
            )}
        </View>
    );
};

const getAuthToken = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        return token;
    } catch (error) {
        console.error('Ошибка при получении токена из AsyncStorage:', error);
        return null;
    }
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f8f8',
        flex: 1,
    },
    requestItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    requestTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    datesContainer: {
        paddingLeft: 10,
    },
    dateItem: {
        marginBottom: 10,
    },
    separator: {
        color: '#ccc',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default RequestList;
