import React, { useState } from 'react';
import { View, Text, Button, StyleSheet,TextInput, ScrollView } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { createWaybill } from '../services/api';

const RouteSheet = ({ route, navigation }) => {
    const { request } = route.params; // Получаем данные заявки
    const [plannedDepartureTime, setPlannedDepartureTime] = useState(''); // Состояние для ввода времени

    const handleConfirm = async () => {
        // Логика для создания путевого листа
        // Например, отправка данных на сервер или сохранение в состоянии
        await createWaybill({"machinery": request.vehicleRegistrationNumber, "facility": request.facility, "planned_time_of_departure": plannedDepartureTime + ":00", "planned_time_of_arrival_at_the_facility": request.plannedArrivalTime, "planned_time_of_work_at_the_facility": request.plannedWorkTime, "dateItem_index": request.dateItem_index, "machineIndex": request.machineIndex, "requestId": request.requestId});
        alert(`Путевой лист создан успешно! Время выезда: ${plannedDepartureTime}`);
        navigation.goBack(); // Возвращаемся на предыдущий экран
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Подтверждение путевого листа</Text>
            <View style={styles.card}>
                <Text style={styles.label}>Объект:</Text>
                <Text style={styles.value}>{request.facility}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Тип техники:</Text>
                <Text style={styles.value}>{request.type}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Плановое время приезда на объект:</Text>
                <Text style={styles.value}>{request.plannedArrivalTime}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Плановое время работы на объекте:</Text>
                <Text style={styles.value}>{request.plannedWorkTime} часа</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Госномер а/м:</Text>
                <Text style={styles.value}>
                    {request.vehicleRegistrationNumber || 'Не назначен'}
                </Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Плановое время выезда:</Text>
                <TextInputMask
                    type={'datetime'}
                    options={{
                        format: 'YYYY-MM-DD HH:MM',  
                    }}
                    value={plannedDepartureTime}
                    onChangeText={setPlannedDepartureTime}
                    style={styles.input}
                    placeholder="Введите дату и время"
                />
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Фактическое время выезда:</Text>
                <Text style={styles.value}>Не указано</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Фактическое время прибытия:</Text>
                <Text style={styles.value}>Не указано</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Фактическое время работы на объекте:</Text>
                <Text style={styles.value}>Не указано</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Фактическое время ожидания на объекте:</Text>
                <Text style={styles.value}>Не указано</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Создать путевой лист" color="#28A745" onPress={handleConfirm} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#343a40',
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6c757d',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        fontWeight: '400',
        color: '#212529',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6c757d',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        fontSize: 16,
        color: '#212529',
    },
    buttonContainer: {
        marginTop: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
});

export default RouteSheet;
