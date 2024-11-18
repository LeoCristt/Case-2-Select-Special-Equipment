import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';

// Примерные данные для сводных заявок и техники
const summaryRequests = [
    {
        id: 1,
        subdivision: 'Подразделение 1',
        type: 'Экскаватор',
        quantity: 1,
        plannedWorkTime: '08:00 - 12:00',
        submissionTime: '2023-10-01 08:00',
        equipmentNeeded: ['А001', 'А002'], // Номера а/м из выделенного списка
    },
    {
        id: 2,
        subdivision: 'Подразделение 2',
        type: 'Бульдозер',
        quantity: 1,
        plannedWorkTime: '10:00 - 14:00',
        submissionTime: '2023-10-01 09:00',
        equipmentNeeded: ['А003', 'А004'],
    },
];

const availableEquipment = [
    { id: 'A001', type: 'Экскаватор', registrationNumber: '1234AB', location: 'Объект 1' },
    { id: 'A002', type: 'Экскаватор', registrationNumber: '5678CD', location: 'Объект 2' },
    { id: 'A003', type: 'Бульдозер', registrationNumber: '9101EF', location: 'Объект 3' },
    { id: 'A004', type: 'Бульдозер', registrationNumber: '1121GH', location: 'Объект 4' },
];

const DispatcherDashboard = () => {
    const [allocatedEquipment, setAllocatedEquipment] = useState({}); // Для хранения распределенной техники

    const handleAllocateEquipment = (requestId, equipmentId) => {
        setAllocatedEquipment(prev => ({ ...prev, [requestId]: equipmentId }));
        Alert.alert('Успех', 'Техника успешно распределена');
    };

    const handleCreateTravelSheet = (requestId) => {
        const equipmentId = allocatedEquipment[requestId];
        if (!equipmentId) {
            Alert.alert('Ошибка', 'Необходимо сначала распределить технику');
            return;
        }

        const allocated = availableEquipment.find(e => e.id === equipmentId);
        const travelSheet = {
            vehicleRegistrationNumber: allocated.registrationNumber,
            plannedWorkTime: summaryRequests.find(req => req.id === requestId).plannedWorkTime,
            actualDepartureTime: '08:00', // Пример
            actualArrivalTime: '08:30', // Пример
            actualWorkTime: '3 часа', // Пример
            actualWaitingTime: '30 минут', // Пример
        };

        console.log('Путевой лист:', travelSheet);
        Alert.alert('Успех', 'Путевой лист успешно создан');
    };

    const renderRequestItem = ({ item }) => (
        <View style={styles.requestItem}>
            <Text>Подразделение: {item.subdivision}</Text>
            <Text>Тип техники: {item.type}</Text>
            <Text>Количество: {item.quantity}</Text>
            <Text>Плановое время работы: {item.plannedWorkTime}</Text>
            <Text>Время подачи: {item.submissionTime}</Text>

            <Text>Необходимая техника:</Text>
            {item.equipmentNeeded.map(equipmentId => (
                <Text key={equipmentId}>{equipmentId}</Text>
            ))}

            {item.equipmentNeeded.map(equipmentId => (
                <Button
                    key={equipmentId}
                    title={`Распределить технику ${equipmentId}`}
                    onPress={() => handleAllocateEquipment(item.id, equipmentId)}
                />
            ))}
            <Button
                title="Создать путевой лист"
                onPress={() => handleCreateTravelSheet(item.id)}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Рабочий стол диспетчера</Text>
            <FlatList
                data={summaryRequests}
                renderItem={renderRequestItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    requestItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default DispatcherDashboard;