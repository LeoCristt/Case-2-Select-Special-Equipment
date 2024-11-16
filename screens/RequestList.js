import React, { useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const RequestList = ({ navigation }) => {
    // ЭТА ЗАГЛУШКА ЧТОБЫ Я МОГ ДИЗАЙН СМОТРЕТЬ
    const [requests, setRequests] = useState([
        { id: 1, type: 'Экскаватор', quantity: 2, time: '10:00' },
        { id: 2, type: 'Бульдозер', quantity: 1, time: '11:00' },
        { id: 3, type: 'Гусеничный кран', quantity: 3, time: '12:00' },
    ]);
    const [newRequest, setNewRequest] = useState({ type: '', quantity: '', time: '' });

    const addRequest = () => {
        if (newRequest.type && newRequest.quantity && newRequest.time) {
            const newId = requests.length ? requests[requests.length - 1].id + 1 : 1;
            setRequests([...requests, { id: newId, ...newRequest }]);
            setNewRequest({ type: '', quantity: '', time: '' }); 
        }
    };

    const navigateToDetail = (request) => {
        navigation.navigate('RequestDetail', { request });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigateToDetail(item)} style={styles.requestItem}>
                        <Text>Тип: {item.type}</Text>
                        <Text>Количество: {item.quantity}</Text>
                        <Text>Время: {item.time}</Text>
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});

export default RequestList;