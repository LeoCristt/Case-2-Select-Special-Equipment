import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const RouteSheet = ({ route, navigation }) => {
    const { request } = route.params; // Получаем данные заявки

    const handleConfirm = () => {
        // Логика для создания путевого листа
        // Например, отправка данных на сервер или сохранение в состоянии
        alert('Путевой лист создан успешно!');
        navigation.goBack(); // Возвращаемся на предыдущий экран
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Подтверждение путевого листа</Text>
            <Text>Объект: {request.object}</Text>
            <Text>Тип техники: {request.type}</Text>
            <Text>Плановое время приезда: {request.plannedArrivalTime}</Text>
            <Text>Плановое время выезда: {request.plannedDepartureTime}</Text>
            <Text>Госномер а/м: {request.vehicleRegistrationNumber || 'Не назначен'}</Text>

            <Button title="Создать путевой лист" onPress={handleConfirm} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default RouteSheet;