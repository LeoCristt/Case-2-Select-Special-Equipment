import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { fetchMachineries, patchRequest_edit } from '../services/api';
import { AuthContext } from '../services/AuthContext';

const SelectEquipment = ({ route, navigation }) => {
    const { dateItem, request_id, dateItem_index, machinery_index } = route.params;
    const { token, decodedToken } = useContext(AuthContext);
    // Примерные данные для транспортных средств
    const [equipmentList, setEquipmentList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const fetchedMachineries = await fetchMachineries();
                let filteredMachineries;

                if (decodedToken.role === "logistician") {
                    filteredMachineries = fetchedMachineries.filter(machinery =>
                        machinery.subdivision === decodedToken.subdivision // Укажите ваше условие
                    );
                }
                else {
                    filteredMachineries = fetchedMachineries.filter(machinery =>
                        machinery.type === dateItem.type // Укажите ваше условие
                    );
                }
                setEquipmentList(filteredMachineries);
            } catch (error) {
                console.error('Ошибка при загрузке заявок:', error);
            }
        };

        loadRequests();
    }, []);

    const renderEquipmentItem = ({ item }) => (
        <TouchableOpacity
            style={styles.equipmentItem}
            onPress={async () => {
                await patchRequest_edit({ "date": dateItem.date, "plannedWorkTime": dateItem.plannedWorkTime, "quantity": dateItem.quantity, "type": dateItem.type, "machinery": { [machinery_index]: item.license_plate } }, request_id, dateItem_index)

                if (decodedToken.role === "dispatcher") {
                    navigation.navigate('Dashboard');
                }
                else {
                    navigation.navigate('RequestList');
                }
            }}
        >
            <Text style={styles.equipmentText}>
                {item.license_plate} - {item.type} - {item.subdivision}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Выбор  свободной техники:</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Поиск по госномеру или типу..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList
                data={equipmentList}
                renderItem={renderEquipmentItem}
                contentContainerStyle={styles.list}
            />
            {(decodedToken.role === "dispatcher" || decodedToken.role === "admin") && (
                <View style={styles.noEquipmentContainer}>
                    <Text style={styles.noEquipmentText}>Если вы не нашли необходимую технику.</Text>
                    <Button
                        title="Заказать у контрагента"
                        onPress={() => {
                            navigation.navigate('OrderEquipment')
                        }}
                        color="#6E473B"
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E1D4C2', // Общий фон
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6E473B',
        marginBottom: 20,
        textAlign: 'center',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#BEB5A9',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    equipmentItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#BEB5A9',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    equipmentText: {
        fontSize: 16,
        color: '#6E473B',
    },
    list: {
        paddingBottom: 20,
    },
    noEquipmentContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    noEquipmentText: {
        fontSize: 16,
        color: '#6E473B',
        marginBottom: 10,
    },
});

export default SelectEquipment;