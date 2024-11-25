import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchRequests_dispatcher } from '../services/api';

const Dashboard = () => {
    const navigation = useNavigation();

    // Примерные данные для заявок
    const [summaryRequests, setSummaryRequests] = useState([]);

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const fetchedRequests = await fetchRequests_dispatcher();
                setSummaryRequests(fetchedRequests);
            } catch (error) {
                console.error('Ошибка при загрузке заявок:', error);
            }
        };

        loadRequests();
    }, []);

    const renderRequestItem = ({ item }) => {
        return (
            <View style={styles.requestItem}>
                <Text>Объект: {item.master.facility}</Text>
    
                {/* Список с элементами */}
                <FlatList
                    data={item.date_type_quantity_plannedWorkTime_machinery}
                    renderItem={({ item: dateItem }) => {
                        return (
                            <View style={styles.dateItem}>
                                <Text>Тип техники: {dateItem.type}</Text>
                                <Text>Госномер а/м: {dateItem.machinery || 'Не назначен'}</Text>
                                <Text>Плановое время выезда: {'Не назначен'}</Text>
                                <Text>Плановое время приезда на объект: {dateItem.date}</Text>
                                <Text>Плановое время работы на объекте: {dateItem.plannedWorkTime} часа</Text>
    
                                {dateItem.machinery ? (
                                    <TouchableOpacity
                                        style={styles.confirmButton}
                                        onPress={() =>
                                            navigation.navigate('SelectEquipment', {
                                                requestId: item.id,
                                                dateItemId: dateItem.id,
                                            })
                                        }
                                    >
                                        <Text style={styles.buttonText}>Изменить выбор а/м</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.selectButton}
                                        onPress={() =>
                                            navigation.navigate('SelectEquipment', {
                                                requestId: item.id,
                                                dateItemId: dateItem.id,
                                            })
                                        }
                                    >
                                        <Text style={styles.buttonText}>Добавить ТС</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    }}
                    keyExtractor={(dateItem, index) => index.toString()}
                />
    
                {/* Кнопка создания путевого листа */}
                <TouchableOpacity
                    style={styles.routeSheetButton}
                    onPress={() => navigation.navigate('RouteSheet', { request: item })}
                >
                    <Text style={styles.buttonText}>Создать путевой лист</Text>
                </TouchableOpacity>
            </View>
        );
    };    

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