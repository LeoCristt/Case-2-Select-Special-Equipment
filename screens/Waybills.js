import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchRouteSheets } from '../services/api'; // Импортируем API-функцию для получения путевых листов
import { useNavigation } from '@react-navigation/native';

const RouteSheets = () => {
    const [routeSheets, setRouteSheets] = useState([]);
    const [expandedRouteSheetIds, setExpandedRouteSheetIds] = useState([]); // Состояние для управления раскрытием
    const navigation = useNavigation();

    useEffect(() => {
        const loadRouteSheets = async () => {
            try {
                const fetchedRouteSheets = await fetchRouteSheets();
                setRouteSheets(fetchedRouteSheets);
            } catch (error) {
                console.error('Ошибка при загрузке путевых листов:', error);
            }
        };

        loadRouteSheets();
    }, []);

    const toggleRouteSheetDetails = (routeSheetId) => {
        if (expandedRouteSheetIds.includes(routeSheetId)) {
            setExpandedRouteSheetIds(expandedRouteSheetIds.filter((id) => id !== routeSheetId)); // Скрыть
        } else {
            setExpandedRouteSheetIds([...expandedRouteSheetIds, routeSheetId]); // Показать
        }
    };

    const handleEditRouteSheet = (routeSheet) => {
        navigation.navigate('EditWaybill', { routeSheet }); // Переход на экран редактирования
    };

    const renderRouteSheetItem = ({ item }) => {
        const isExpanded = expandedRouteSheetIds.includes(item.id); // Проверка, раскрыт ли путевой лист

        return (
            <View style={styles.routeSheetItem}>
                <Text style={styles.header}>Путевой лист №{item.id}</Text>
                <Text style={styles.subHeader}>Объект: {item.facility}</Text>
                <Text style={styles.subHeader}>Госномер: {item.machinery}</Text>

                {/* Кнопка для открытия/закрытия подробностей */}
                <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => toggleRouteSheetDetails(item.id)}
                >
                    <Text style={styles.buttonText}>
                        {isExpanded ? 'Скрыть подробности' : 'Показать подробности'}
                    </Text>
                </TouchableOpacity>

                {/* Блок подробностей */}
                {isExpanded && (
                    <View style={styles.details}>
                        <Text>Плановое время выезда: {item.planned_time_of_departure}</Text>
                        <Text>Плановое время приезда на объект: {item.planned_time_of_arrival_at_the_facility}</Text>
                        <Text>Плановое время работы на объекте: {item.planned_time_of_work_at_the_facility} часа</Text>
                        <Text>Фактическое время выезда: {item.actual_time_of_departure}</Text>
                        <Text>Фактическое время прибытия: {item.actual_time_of_arrival_at_the_facility}</Text>
                        <Text>Фактическое время работы на объекте: {item.actual_time_of_work_at_the_facility}</Text>
                        <Text>Фактическое время ожидания на объекте: {item.actual_time_of_waiting_at_the_facility}</Text>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => handleEditRouteSheet(item)}
                            >
                                <Text style={styles.buttonText}>Редактировать</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Путевые листы</Text>
            <FlatList
                data={routeSheets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderRouteSheetItem}
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
    routeSheetItem: {
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
    details: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#e9ecef',
        borderRadius: 5,
    },
    detailsButton: {
        backgroundColor: '#17A2B8',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#FFC107',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginRight: 5,
    },
    deleteButton: {
        backgroundColor: '#DC3545',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default RouteSheets;
