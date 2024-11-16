import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { createRequest } from '../services/api';

const RequestForm = ({ navigation }) => {
    const [requestData, setRequestData] = useState({
        subdivision: '',
        type: '',
        quantity: '',
        plannedWorkTime: '',
        distance: '',
        master: '',
    });
    const [newDateSlot, setNewDateSlot] = useState('');
    const [dateSlots, setDateSlots] = useState([]);

    const handleInputChange = (name, value) => {
        setRequestData({ ...requestData, [name]: value });
    };

    const addDateSlot = () => {
        if (newDateSlot) {
            const { type, quantity, plannedWorkTime } = requestData;
            setDateSlots((prevSlots) => [...prevSlots, { date: newDateSlot, type, quantity, plannedWorkTime }]);
            setNewDateSlot('');
        }
    };

    const handleSubmit = async () => {
        try {
            const formattedDateSlots = dateSlots.map(slot => ({
                type: slot.type,
                quantity: slot.quantity,
                plannedWorkTime: slot.plannedWorkTime,
                date: slot.date + ":00",  // Добавляем секунды
            }));

            // Деструктурируем requestData, чтобы исключить type, quantity, plannedWorkTime
            const { type, quantity, plannedWorkTime, ...remainingRequestData } = requestData;

            // Отправляем запрос с преобразованным временем
            await createRequest({ ...remainingRequestData, date_type_quantity_plannedWorkTime: formattedDateSlots });
            navigation.navigate('RequestList'); 
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
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                    />
                </View>
            );
        } else if (item.type === 'dateSlot') {
            return (
                <View style={styles.dateSlot}>
                    <Text>{item.date}</Text>
                    <Text style={styles.infoText}>Тип: {item.type}, Количество: {item.quantity}, </Text>
                </View>
            );
        }
        return null;
    };

    const data = [
        { type: 'input', label: 'Подразделение', name: 'subdivision' },
        { type: 'input', label: 'Тип техники', name: 'type' },
        { type: 'input', label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
        { type: 'input', label: 'Плановое время работы', name: 'plannedWorkTime', placeholder: 'Введите плановое время работы', keyboardType: 'numeric' },
        { type: 'input', label: 'Расстояние до объекта (км)', name: 'distance', keyboardType: 'numeric' },
        { type: 'input', label: 'Мастер, подавший заявку', name: 'master' },
    ];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'android' ? 'height' : 'padding'}
            keyboardVerticalOffset={Platform.OS === 'android' ? 100 : 0}
        >
            <ScrollView>
                {data.map((item, index) => renderItem({ item }))}
                <View>
                    <Text style={styles.label}>Время подачи:</Text>
                    <TextInputMask
                        type={'datetime'}
                        options={{
                            format: 'YYYY-MM-DD HH:MM:SS',  // Маска для даты (день, месяц) и времени (часы, минуты)
                        }}
                        style={styles.input}
                        value={newDateSlot}
                        onChangeText={setNewDateSlot}
                        placeholder="Введите дату и время (ГГГГ-ММ-ДД ЧЧ:ММ)"
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addDateSlot}>
                        <Text style={styles.addButtonText}>Добавить время</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={dateSlots}
                    renderItem={({ item }) => (
                        <View style={styles.dateSlot}>
                            <Text>Время подачи: {item.date}</Text>
                            <Text style={styles.infoText}>Тип техники: {item.type}, Количество: {item.quantity}, Плановое время работы: {item.plannedWorkTime}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
                
                <Button title="Отправить заявку" onPress={handleSubmit} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f8f8',
        flex: 1,
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
    dateSlot: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#555',
    },
});

export default RequestForm;