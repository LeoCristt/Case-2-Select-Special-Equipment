import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const RequestDetail = ({ route, navigation }) => {
    const { request } = route.params; // Получаем переданную заявку
    const [newEquipment, setNewEquipment] = useState('');

    const addEquipment = () => {
        if (newEquipment) {
            // Логика добавления техники (например, отправка на сервер или обновление состояния)
            console.log(`Добавлено новое оборудование: ${newEquipment}`);
            setNewEquipment(''); // Сбросить поле ввода
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Тип техники: {request.type}</Text>
            <TextInput
                style={styles.input}
                placeholder="Добавить технику"
                value={newEquipment}
                onChangeText={setNewEquipment}
            />
            <Text style={styles.label}>Количество: {request.quantity}</Text>
            <TextInput
                style={styles.input}
                placeholder="Количество"
                value={newEquipment}
                onChangeText={setNewEquipment}
            />
            <Text style={styles.label}>Время: {request.time}</Text>
            <Button title="Добавить" onPress={addEquipment} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f8f8',
        flex: 1,
    },
    label: {
        fontSize: 18,
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});

export default RequestDetail;