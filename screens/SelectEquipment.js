import React, { useState, useContext } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { AuthContext } from '../services/AuthContext'; 

const SelectEquipment = ({ navigation }) => {
    const { token, decodedToken } = useContext(AuthContext);
    // Примерные данные для транспортных средств
    const [equipmentList] = useState([
        { id: "A001", type: "Экскаватор", registrationNumber: "1234AB" },
        { id: "A002", type: "Бульдозер", registrationNumber: "5678CD" },
        { id: "A003", type: "Кран", registrationNumber: "9101EF" },
        { id: "A004", type: "Экскаватор", registrationNumber: "1121GH" },
        { id: "A005", type: "Бульдозер", registrationNumber: "3141IJ" },
        { id: "A006", type: "Кран", registrationNumber: "5161KL" },
        { id: "A007", type: "Экскаватор", registrationNumber: "7181MN" },
        { id: "A008", type: "Бульдозер", registrationNumber: "9202OP" },
        { id: "A009", type: "Кран", registrationNumber: "2233QR" },
        { id: "A010", type: "Экскаватор", registrationNumber: "4455ST" },
        { id: "A011", type: "Бульдозер", registrationNumber: "6677UV" },
        { id: "A012", type: "Кран", registrationNumber: "8899WX" },
        { id: "A013", type: "Экскаватор", registrationNumber: "1010YZ" },
        { id: "A014", type: "Бульдозер", registrationNumber: "1111AA" },
        { id: "A015", type: "Кран", registrationNumber: "1212BB" },
        { id: "A016", type: "Экскаватор", registrationNumber: "1313CC" },
        { id: "A017", type: "Бульдозер", registrationNumber: "1414DD" },
        { id: "A018", type: "Кран", registrationNumber: "1515EE" },
        { id: "A019", type: "Экскаватор", registrationNumber: "1616FF" },
        { id: "A020", type: "Бульдозер", registrationNumber: "1717GG" },
    ]);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredEquipment = equipmentList.filter(equipment =>
        equipment.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        equipment.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderEquipmentItem = ({ item }) => (
        <TouchableOpacity
            style={styles.equipmentItem}
            onPress={() => {
                navigation.navigate('DispatcherDashboard', { selectedEquipment: item });
            }}
        >
            <Text>{item.registrationNumber} - {item.type}</Text>
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
                data={filteredEquipment}
                keyExtractor={item => item.id}
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