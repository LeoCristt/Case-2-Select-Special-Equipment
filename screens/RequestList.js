import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchRequests } from '../services/api'; // Предположим, что fetchRequests импортируется из api

const RequestList = ({ navigation }) => {
    const [requests, setRequests] = useState([]); // Начальное состояние — пустой массив

    // Загружаем заявки из API при монтировании компонента
    useEffect(() => {
        const loadRequests = async () => {
            try {
                const fetchedRequests = await fetchRequests(); // Получаем данные с API
                setRequests(fetchedRequests);  // Обновляем состояние с полученными заявками
            } catch (error) {
                console.error('Ошибка при загрузке заявок:', error);
            }
        };

        loadRequests();  // Вызов функции загрузки
    }, []);  // Пустой массив зависимостей, чтобы вызвать один раз при монтировании

    const navigateToDetail = (request) => {
        navigation.navigate('RequestDetail', { request });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigateToDetail(item)} style={styles.requestItem}>
                        <View style={styles.datesContainer}>
                            <FlatList
                                data={item.date_type_quantity_plannedWorkTime}
                                renderItem={({ item: dateItem }) => (
                                    <View style={styles.dateItem}>
                                        <Text>Тип техники: {dateItem.type}</Text>
                                        <Text>Количество: {dateItem.quantity}</Text>
                                        <Text>Плановое время работы: {dateItem.plannedWorkTime}</Text>
                                        <Text>Время подачи: {dateItem.date}</Text>
                                    </View>
                                )}
                                keyExtractor={(dateItem, index) => index.toString()} // Используем индекс как ключ
                            />
                        </View>
                    </TouchableOpacity>
                )}
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
    },
});

export default RequestList;
