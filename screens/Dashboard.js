import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
    const navigation = useNavigation();

    // Примерные данные для заявок
    const [summaryRequests, setSummaryRequests] = useState([
        {
            id: 1,
            facility: "Строительство здания",
            type: "Экскаватор",
            quantity: 1,
            plannedArrivalTime: "2023-10-01 - 08:00",
            plannedDepartureTime: "2023-10-01 - 17:00",
            vehicleRegistrationNumber: "1234AB", // Транспорт назначен
            submissionTime: "2023-09-30T12:00:00"
        },
        {
            id: 2,
            facility: "Укладка асфальта",
            type: "Бульдозер",
            quantity: 1,
            plannedArrivalTime: "2023-10-01 - 09:00",
            plannedDepartureTime: "2023-10-01 - 15:00",
            vehicleRegistrationNumber: null, // Транспорт не назначен
            submissionTime: "2023-09-30T13:00:00"
        },
        {
            id: 3,
            facility: "Ремонт дороги",
            type: "Кран",
            quantity: 1,
            plannedArrivalTime: "2023-10-01 - 10:00",
            plannedDepartureTime: "2023-10-01 - 14:00",
            vehicleRegistrationNumber: "5678CD", // Транспорт назначен
            submissionTime: "2023-09-30T14:00:00"
        }
    ]);

    const renderRequestItem = ({ item }) => (
        <View style={styles.requestItem}>
            <Text>Объект: {item.facility}</Text>
            <Text>Тип техники: {item.type}</Text>
            <Text>Плановое время приезда: {item.plannedArrivalTime}</Text>
            <Text>Плановое время выезда: {item.plannedDepartureTime}</Text>
            <Text>Госномер а/м: {item.vehicleRegistrationNumber || 'Не назначен'}</Text>

            {item.vehicleRegistrationNumber ? (
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => navigation.navigate('SelectEquipment', { requestId: item.id })}
                >
                    <Text style={styles.buttonText}>Изменить выбор а/м</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => navigation.navigate('SelectEquipment', { requestId: item.id })}
                >
                    <Text style={styles.buttonText}>Добавить ТС</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.routeSheetButton}
                onPress={() => navigation.navigate('RouteSheet', { request: item })}
            >
                <Text style={styles.buttonText}>Создать путевой лист</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Диспетчерская панель</Text>
            <FlatList
                data={summaryRequests}
                keyExtractor={item => item.id.toString()}
                renderItem={renderRequestItem}
            />
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
    requestItem: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    selectButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    confirmButton: {
        backgroundColor: '#FFC107',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    routeSheetButton: {
        backgroundColor: '#28A745',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Dashboard;