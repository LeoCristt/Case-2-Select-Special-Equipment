import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { fetchRequests, sendRequests } from '../services/api'; // Предположим, что sendRequests импортируется из api

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

    const navigateToEdit = (request) => {
        navigation.navigate('EditRequest', { request }); // Переход на экран редактирования с передачей данных заявки
    };

    const handleSendRequests = async () => {
        try {
            const requestIds = requests.map(request => request.id); // Получаем массив ID всех заявок
            await sendRequests(requestIds); // Отправляем все заявки на сервер
            setRequests([]); // Очищаем список заявок
            Alert.alert('Успех', 'Все заявки успешно отправлены!');
        } catch (error) {
            console.error('Ошибка при отправке заявок:', error);
            Alert.alert('Ошибка', 'Не удалось отправить заявки.');
        }
    };

    const renderRequestItem = ({ item }) => (
        <View style={styles.requestItem}>
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
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => navigateToDetail(item)}
                >
                    <Text style={styles.buttonText}>Добавить</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => navigateToEdit(item)} 
                >
                    <Text style={styles.buttonText}>Редактировать</Text>
                </TouchableOpacity>
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
    actionButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default RequestList;