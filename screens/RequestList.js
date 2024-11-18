import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { fetchRequests, sendRequest } from '../services/api'; // Предположим, что sendRequest импортируется из api

const RequestList = ({ navigation }) => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const fetchedRequests = await fetchRequests(); // Получаем данные с API
                setRequests(fetchedRequests);  // Обновляем состояние с полученными заявками
            } catch (error) {
                console.error('Ошибка при загрузке заявок:', error);
            }
        };

        loadRequests();  
    }, []);  

    const navigateToDetail = (request) => {
        navigation.navigate('RequestDetail', { request });
    };

    const handleSendRequest = async (requestId) => {
        try {
            await sendRequest(requestId); // Отправляем заявку на сервер
            setRequests(prevRequests => 
                prevRequests.filter(request => request.id !== requestId) // Удаляем отправленную заявку из списка
            );
            Alert.alert('Успех', 'Заявка успешно отправлена!');
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
            Alert.alert('Ошибка', 'Не удалось отправить заявку.');
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
                        keyExtractor={(dateItem, index) => index.toString()} // Используем индекс как ключ
                    />
                </View>
            </TouchableOpacity>
            <Button 
                title="Отправить заявку" 
                onPress={() => handleSendRequest(item.id)} 
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                renderItem={renderRequestItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
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
});

export default RequestList;