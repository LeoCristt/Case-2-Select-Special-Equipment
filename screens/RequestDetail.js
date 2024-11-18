import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { patchRequest } from '../services/api';
import { TextInputMask } from 'react-native-masked-text';

const RequestDetail = ({ route, navigation }) => {
    const { request } = route.params; // Получаем переданную заявку
    const [[type, quantity, plannedWorkTime, date], setNewEquipment] = useState('');

    const addEquipment = () => {
        if ([type, quantity, plannedWorkTime, date]) {
            // Логика добавления техники (например, отправка на сервер или обновление состояния)
            patchRequest({id: request.id, date: date, type: type, quantity: quantity, plannedWorkTime: plannedWorkTime})
            console.log(`Добавлено новое оборудование: ${newEquipment}`);
            setNewEquipment(''); // Сбросить поле ввода
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Тип техники:</Text>
            <TextInput
                style={styles.input}
                value={type}
            />
            <Text style={styles.label}>Количество:</Text>
            <TextInput
                style={styles.input}
                keyboardType= {'numeric'}
                value={quantity}
            />
            <Text style={styles.label}>Плановое время работы:</Text>
            <TextInput
                style={styles.input}
                keyboardType= {'numeric'}
                value={plannedWorkTime}
            />
            <Text style={styles.label}>Время подачи:</Text>
                <TextInput
                    style={styles.input}
                    value={date}
                    placeholder="Введите дату и время (ГГГГ-ММ-ДД ЧЧ:ММ)"
                />
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