import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
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

    const renderDateSlot = (item) => (
        <View style={styles.dateSlot}>
            <Text>{item.date}</Text>
            <Text style={styles.infoText}>Тип: {item.type}, Количество: {item.quantity}, Плановое время работы: {item.plannedWorkTime}</Text>
        </View>
    );

    const data = [
        { label: 'Подразделение', name: 'subdivision' },
        { label: 'Тип техники', name: 'type' },
        { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
        { label: 'Плановое время работы', name: 'plannedWorkTime', placeholder: 'Введите плановое время работы', keyboardType: 'numeric' },
        { label: 'Расстояние до объекта (км)', name: 'distance', keyboardType: 'numeric' },
        { label: 'Мастер, подавший заявку', name: 'master' },
    ];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                {data.map((item, index) => (
                    <View key={index}>
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
                ))}
                
                <Text style={styles.label}>Время подачи:</Text>
                <TextInputMask
                    type={'datetime'}
                    options={{
                        format: 'YYYY-MM-DD HH:MM',  // Маска для времени
                    }}
                    value={newDateSlot}
                    onChangeText={setNewDateSlot}
                    style={styles.input}
                    placeholder="Введите дату и время"
                />
                <Button title="Добавить временной слот" onPress={addDateSlot} />

                <Text style={styles.label}>Добавленные временные слоты:</Text>
                {dateSlots.map((slot, index) => renderDateSlot(slot, index))}

                <Button title="Отправить заявку" onPress={handleSubmit } />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingBottom: 60,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    dateSlot: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#555',
    },
});

export default RequestForm;