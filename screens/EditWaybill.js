import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { updateWaybill } from '../services/api'; // Функция для отправки данных на сервер

const EditRouteSheet = ({ route, navigation }) => {
    // Получаем данные заявки, если они существуют
    const { routeSheet } = route.params || {}; 

    // Инициализация состояния с пустыми строками или значениями из routeSheet
    const [actualTimeOfDeparture, setActualTimeOfDeparture] = useState(routeSheet?.actual_time_of_departure || '');
    const [actualTimeOfArrival, setActualTimeOfArrival] = useState(routeSheet?.actual_time_of_arrival_at_the_facility || '');
    const [actualTimeOfWork, setActualTimeOfWork] = useState(routeSheet?.actual_time_of_work_at_the_facility || '');
    const [actualTimeOfWaiting, setActualTimeOfWaiting] = useState(routeSheet?.actual_time_of_waiting_at_the_facility || '');

    useEffect(() => {
        if (routeSheet) {  // Убедимся, что routeSheet существует
            setActualTimeOfDeparture(routeSheet.actual_time_of_departure || '');
            setActualTimeOfArrival(routeSheet.actual_time_of_arrival_at_the_facility || '');
            setActualTimeOfWork(routeSheet.actual_time_of_work_at_the_facility || '');
            setActualTimeOfWaiting(routeSheet.actual_time_of_waiting_at_the_facility || '');
        }
    }, [routeSheet]); // Обновить данные, если routeSheet изменяется

    const handleSave = async () => {
        // Логика для сохранения редактируемых данных
        if (routeSheet) {  // Убедимся, что routeSheet существует перед отправкой
            await updateWaybill({
                "actual_time_of_departure": actualTimeOfDeparture,
                "actual_time_of_arrival_at_the_facility": actualTimeOfArrival,
                "actual_time_of_work_at_the_facility": actualTimeOfWork,
                "actual_time_of_waiting_at_the_facility": actualTimeOfWaiting,
            },
            routeSheet.id); // ID waybill, которую нужно обновить
            alert('Путевой лист обновлен успешно!');
            navigation.navigate("Waybills"); // Возвращаемся на предыдущий экран
        } else {
            alert('Не удалось получить данные заявки');
        }
    };

    if (!routeSheet) {
        // Если routeSheet не существует, отображаем сообщение об ошибке
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Ошибка: Не удалось загрузить данные заявки.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Редактирование путевого листа</Text>
            <View style={styles.card}>
                <Text style={styles.label}>Объект:</Text>
                <Text style={styles.value}>{routeSheet.facility}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Плановое время выезда:</Text>
                <Text style={styles.value}>{routeSheet.planned_time_of_departure}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Плановое время приезда на объект:</Text>
                <Text style={styles.value}>{routeSheet.planned_time_of_arrival_at_the_facility}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Плановое время работы на объекте:</Text>
                <Text style={styles.value}>{routeSheet.planned_time_of_work_at_the_facility} часа</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>Госномер а/м:</Text>
                <Text style={styles.value}>
                    {routeSheet.machinery || 'Не назначен'}
                </Text>
            </View>

            {/* Форма для редактирования фактического времени */}
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Фактическое время выезда:</Text>
                <TextInputMask
                    type={'datetime'}
                    options={{
                        format: 'YYYY-MM-DD HH:MM',  // Формат времени
                    }}
                    value={actualTimeOfDeparture}
                    onChangeText={setActualTimeOfDeparture}
                    style={styles.input}
                    placeholder="Введите фактическое время выезда"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Фактическое время прибытия на объект:</Text>
                <TextInputMask
                    type={'datetime'}
                    options={{
                        format: 'YYYY-MM-DD HH:MM',
                    }}
                    value={actualTimeOfArrival}
                    onChangeText={setActualTimeOfArrival}
                    style={styles.input}
                    placeholder="Введите фактическое время прибытия"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Фактическое время работы на объекте:</Text>
                <TextInputMask
                    type={'datetime'}
                    options={{
                        format: 'YYYY-MM-DD HH:MM',
                    }}
                    value={actualTimeOfWork}
                    onChangeText={setActualTimeOfWork}
                    style={styles.input}
                    placeholder="Введите фактическое время работы"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Фактическое время ожидания на объекте:</Text>
                <TextInputMask
                    type={'datetime'}
                    options={{
                        format: 'YYYY-MM-DD HH:MM',
                    }}
                    value={actualTimeOfWaiting}
                    onChangeText={setActualTimeOfWaiting}
                    style={styles.input}
                    placeholder="Введите фактическое время ожидания"
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Сохранить изменения" color="#28A745" onPress={handleSave} />
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
    error: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default EditRouteSheet;
