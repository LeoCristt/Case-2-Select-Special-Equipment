import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { createRequest } from '../services/api';
import { TextInputMask } from 'react-native-masked-text';

const RequestForm = ({ navigation }) => {
    const [requestData, setRequestData] = useState({
        subdivision: '',
        type: '',
        quantity: '',
        timeSlots: [],
        plannedWorkTime: '',
        distance: '',
        master: '',
    });
    const [newTimeSlot, setNewTimeSlot] = useState('');

    const handleInputChange = (name, value) => {
        setRequestData({ ...requestData, [name]: value });
    };

    const addTimeSlot = () => {
        if (newTimeSlot) {
            const { type, quantity } = requestData;
            setRequestData((prevData) => ({
                ...prevData,
                timeSlots: [...prevData.timeSlots, { time: newTimeSlot, type, quantity }],
            }));
            setNewTimeSlot('');
        }
    };

    const handleSubmit = async () => {
        try {
            await createRequest(requestData);
            navigation.navigate('RequestList'); // Вернуться к списку заявок
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
        }
    };

    const renderItem = ({ item }) => {
        if (item.type === 'input') {
            return (
                <View>
                    <Text style={styles.label}>{item.label}:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(value) => handleInputChange(item.name, value)}
                        value={requestData[item.name]}
                        keyboardType={item.keyboardType}
                        placeholder={item.placeholder}
                    />
                </View>
            );
        } else if (item.type === 'timeSlot') {
            return (
                <View style={styles.timeSlot}>
                    <Text>{item.time}</Text>
                    <Text style={styles.infoText}>Тип: {item.type}, Количество: {item.quantity}</Text>
                </View>
            );
        }
        return null;
    };

    const data = [
        { type: 'input', label: 'Подразделение', name: 'subdivision' },
        { type: 'input', label: 'Тип техники', name: 'type' },
        { type: 'input', label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
        { type: 'input', label: 'Плановое время работы', name: 'plannedWorkTime', placeholder: 'Введите плановое время работы' },
        { type: 'input', label: 'Расстояние до объекта (км)', name: 'distance', keyboardType: 'numeric' },
        { type: 'input', label: 'Мастер, подавший заявку', name: 'master' },
        { type: 'timeSlot', time: newTimeSlot, type: requestData.type, quantity: requestData.quantity },
    ];

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListFooterComponent={
                    <View>
                        <Text style={styles.label}>Время подачи:</Text>
                        <TextInputMask
                            type={'datetime'}
                            options={{
                                format: 'HH:mm',
                            }}
                            style={styles.input}
                            value={newTimeSlot}
                            onChangeText={setNewTimeSlot}
                            placeholder="Введите время (HH:mm)"
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addTimeSlot}>
                            <Text style={styles.addButtonText}>Добавить время</Text>
                        </TouchableOpacity>
                        <Button title="Отправить заявку" onPress={handleSubmit} />
                    </View>
                }
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
    scrollViewContent: {
        paddingBottom: 20,
    },
    label: {
        marginVertical: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    timeSlot: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#555',
    },
});

export default RequestForm;