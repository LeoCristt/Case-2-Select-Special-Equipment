import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { fetchMachineries } from '../services/api';

const SelectEquipment = ({ navigation }) => {
    // Примерные данные для транспортных средств
    const [equipmentList, setEquipmentList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const fetchedRequests = await fetchMachineries();
                setEquipmentList(fetchedRequests);
            } catch (error) {
                console.error('Ошибка при загрузке заявок:', error);
            }
        };

        loadRequests();
    }, []);

    const renderEquipmentItem = ({ item }) => (
        <TouchableOpacity
            style={styles.equipmentItem}
            onPress={() => {
                navigation.navigate('Dashboard');
            }}
        >
            <Text>{item.license_plate} - {item.type} - {item.subdivision}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Выбор свободной техники:</Text>
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
            <View style={styles.noEquipmentContainer}>
                <Text style={styles.noEquipmentText}>Если вы не нашли необходимую технику.</Text>
                <Button
                    title="Заказать у контрагента"
                    onPress={() => {
                        navigation.navigate('OrderEquipment')
                    }}
                />
            </View>

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
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    equipmentItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    list: {
        paddingBottom: 20,
    },
    noEquipmentContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    noEquipmentText: {
        fontSize: 18,
        marginBottom: 10,
    },
});

export default SelectEquipment;