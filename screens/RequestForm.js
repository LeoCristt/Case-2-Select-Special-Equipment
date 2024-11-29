import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
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

    const isFormValid = () => {
        const { subdivision, type, quantity, plannedWorkTime, distance, master } = requestData;
        return subdivision && type && quantity && plannedWorkTime && distance && master;
    };

    const isDateSlotValid = (date) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
        if (!dateRegex.test(date)) {
            Alert.alert('Ошибка', 'Неправильный формат даты и времени. Используйте формат YYYY-MM-DD HH:MM.');
            return false;
        }

        const [year, month, day, hour, minute] = date.match(/\d+/g).map(Number);
        const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

        const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
            Alert.alert('Ошибка', 'Неправильная дата. Проверьте месяц и день.');
            return false;
        }

        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            Alert.alert('Ошибка', 'Неправильное время. Проверьте часы и минуты.');
            return false;
        }

        return true;
    };

    const addDateSlot = () => {
        if (isFormValid() && isDateSlotValid(newDateSlot)) {
            const { type, quantity, plannedWorkTime } = requestData;

            // Рассчитываем время окончания
            const [year, month, day, hour, minute] = newDateSlot.match(/\d+/g).map(Number);
            const startDate = new Date(year, month - 1, day, hour, minute); // month - 1, так как месяцы начинаются с 0
            const endDate = new Date(startDate.getTime() + (plannedWorkTime * 60 * 60 * 1000)); // Добавляем плановое время работы в миллисекундах

            const formattedStartTime = newDateSlot; // Время подачи
            const formattedEndTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`; // Время окончания

            setDateSlots((prevSlots) => [...prevSlots, { date: formattedStartTime, endTime: formattedEndTime, type, quantity, plannedWorkTime }]);
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
                machinery: {}
            }));

            const { type, quantity, plannedWorkTime, ...remainingRequestData } = requestData;

            await createRequest({ ...remainingRequestData, date_type_quantity_plannedWorkTime_machinery: formattedDateSlots });
            navigation.navigate('RequestList'); 
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
        }
    };

    const renderDateSlot = (item) => (
        < View style={styles.dateSlot} key={item.date}>
            <Text>{item.date} - {item.endTime}</Text>
            <Text style={styles.infoText}>Тип: {item.type}, Количество: {item.quantity}, Плановое время работы: {item.plannedWorkTime}</Text>
        </View>
    );

    const data = [
        { label: 'Подразделение', name: 'subdivision' },
        { label: 'Тип техники', name: 'type' },
        { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
        { label: 'Плановое время работы (часы)', name: 'plannedWorkTime', placeholder: 'Введите плановое время работы', keyboardType: 'numeric' },
        { label: 'Расстояние до объекта (км)', name: 'distance', keyboardType: 'numeric' },
        { label: 'Мастер, подавший заявку', name: 'master' },
    ];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'android' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'android' ? 100 : 0}
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
                        format: 'YYYY-MM-DD HH:MM',  
                    }}
                    value={newDateSlot}
                    onChangeText={setNewDateSlot}
                    style={styles.input}
                    placeholder="Введите дату и время"
                />
                <Button 
                    title="Добавить временной слот" 
                    onPress={addDateSlot} 
                    disabled={!isFormValid() || !newDateSlot} 
                />

                <Text style={styles.label}>Добавленные временные слоты:</Text>
                {dateSlots.map((slot, index) => renderDateSlot(slot, index))}

                <Button 
                    title="Отправить заявку" 
                    onPress={handleSubmit} 
                    disabled={dateSlots.length === 0} 
                />
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