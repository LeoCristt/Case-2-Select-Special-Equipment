import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchRequests_dispatcher, fetchMachineries } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
    const [summaryRequests, setSummaryRequests] = useState([]);
    const [expandedRequestIds, setExpandedRequestIds] = useState([]); 
    const [equipmentList, setEquipmentList] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const fetchedRequests = await fetchRequests_dispatcher();
                setSummaryRequests(fetchedRequests);
                const fetchedMachineries = await fetchMachineries();
                // Извлекаем только license_plate
                const licensePlates = fetchedMachineries.map(machinery => machinery.license_plate);

                // Устанавливаем массив licensePlates в состояние
                setEquipmentList(licensePlates);
            } catch (error) {
                console.error('Ошибка при загрузке заявок:', error);
            }
        };

        loadRequests();
    }, []);

    const toggleRequestDetails = (requestId) => {
        if (expandedRequestIds.includes(requestId)) {
            setExpandedRequestIds(expandedRequestIds.filter((id) => id !== requestId)); // Скрыть
        } else {
            setExpandedRequestIds([...expandedRequestIds, requestId]); // Показать
        }
    };

    const navigateToSelect = (dateItem, item, dateItem_index, machinery_index) => {
        const request_id = item.id;
        navigation.navigate('SelectEquipment', { dateItem, request_id, dateItem_index, machinery_index }); 
    };

    const handleCreateRouteSheet = (item, dateItem, index, machineIndex) => {
        const machineData = {
            requestId: item.id,
            dateItem_index: index,
            facility: item.master.facility,
            type: dateItem.type,
            plannedDepartureTime: dateItem.plannedDepartureTime,
            plannedArrivalTime: dateItem.date,
            plannedWorkTime: dateItem.plannedWorkTime,
            vehicleRegistrationNumber: dateItem.machinery[machineIndex + 1],
            machineIndex: machineIndex + 1
        };
    
        navigation.navigate('RouteSheet', { request: machineData }); // Передаем данные
    };

    const renderRequestItem = ({ item }) => {
        const isExpanded = expandedRequestIds.includes(item.id); // Проверка, раскрыта ли заявка
    
        return (
            <View style={styles.requestItem}>
                <Text style={styles.header}>Заявка: {item.master.name}</Text>
                <Text style={styles.subHeader}>Объект: {item.master.facility}</Text>
    
                {/* Кнопка для открытия/закрытия подробностей */}
                <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => toggleRequestDetails(item.id)}
                >
                    <Text style={styles.buttonText}>
                        {isExpanded ? 'Скрыть подробности' : 'Открыть подробности'}
                    </Text>
                </TouchableOpacity>
    
                {/* Блок подробностей */}
                {isExpanded && (
                    <FlatList
                        data={item.date_type_quantity_plannedWorkTime_machinery}
                        renderItem={({ item: dateItem, index }) => (
                            <View style={styles.dateItem}>
                                <Text style={styles.type}>Тип техники: {dateItem.type}</Text>
                                <Text>Количество: {dateItem.quantity}</Text>
                                <Text>Плановое время выезда: {'Не назначен'}</Text>
                                <Text>Плановое время приезда на объект: {dateItem.date}</Text>
                                <Text>Плановое время работы на объекте: {dateItem.plannedWorkTime} часа</Text>
                                
    
                                {Array.from({ length: dateItem.quantity, index }).map((_, machineIndex) => {
                                    const machineryAssigned = !!dateItem.machinery; // Проверка, назначен ли номер
                                    return (
                                        <View style={styles.machineBlock} key={machineIndex}>
                                            <Text>
                                                Машина {machineIndex + 1}: Госномер{' '}
                                                {dateItem.machinery[machineIndex + 1] ? dateItem.machinery[machineIndex + 1] : 'Не назначен'}
                                            </Text>

    
                                            {dateItem.machinery[machineIndex + 1] && equipmentList.includes(dateItem.machinery[machineIndex + 1]) ? (
                                                <TouchableOpacity
                                                    style={styles.selectButton}
                                                    onPress={() =>
                                                        navigateToSelect(dateItem, item, index, machineIndex + 1)
                                                    }
                                                >
                                                    <Text style={styles.buttonText}>
                                                        {dateItem.machinery[machineIndex + 1] ? 'Изменить выбор' : 'Добавить номер'}
                                                    </Text>
                                                </TouchableOpacity>
                                            ) : !dateItem.machinery[machineIndex + 1] && !equipmentList.includes(dateItem.machinery[machineIndex + 1]) ? (
                                                <TouchableOpacity
                                                    style={styles.selectButton}
                                                    onPress={() =>
                                                        navigateToSelect(dateItem, item, index, machineIndex + 1)
                                                    }
                                                >
                                                    <Text style={styles.buttonText}>Добавить номер</Text>
                                                </TouchableOpacity>
                                            ) : null}
    
                                            {dateItem.machinery[machineIndex + 1] ? (
                                                equipmentList.includes(dateItem.machinery[machineIndex + 1]) ? (
                                                    <TouchableOpacity
                                                        style={styles.routeSheetButton}
                                                        onPress={() =>
                                                            handleCreateRouteSheet(item, dateItem, index, machineIndex)
                                                        }
                                                    >
                                                        <Text style={styles.buttonText}>Создать путевой лист</Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <Text style={styles.successText}>Путевой лист создан</Text>
                                                )
                                            ) : null}
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                        keyExtractor={(dateItem, index) => index.toString()}
                    />
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Диспетчерская панель</Text>
            <FlatList
                data={summaryRequests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderRequestItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    requestItem: {
        marginBottom: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subHeader: {
        fontSize: 16,
        marginBottom: 5,
    },
    dateItem: {
        marginTop: 10,
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#e9ecef',
        borderRadius: 5,
    },
    type: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    machineBlock: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f8f9fa',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectButton: {
        backgroundColor: '#007BFF',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
    routeSheetButton: {
        backgroundColor: '#28A745',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
    detailsButton: {
        backgroundColor: '#17A2B8',
        padding: 8,
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
