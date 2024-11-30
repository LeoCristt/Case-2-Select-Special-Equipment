import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const AnalyticsPage = () => {
    const machinesData = [
        { id: 1, name: 'Машина A' },
        { id: 2, name: 'Машина B' },
        { id: 3, name: 'Машина C' },
        { id: 4, name: 'Машина C' },
        { id: 5, name: 'Машина C' },
        { id: 6, name: 'Машина C' },
        { id: 7, name: 'Машина C' },
        { id: 8, name: 'Машина C' },
        { id: 9, name: 'Машина C' },
        { id: 10, name: 'Машина C' },
    ];

    const waybillsData = {
        1: [
            { id: 101, date: '2024-11-01', hours: 8, earnings: 5000 },
            { id: 102, date: '2024-11-05', hours: 6, earnings: 4000 },
            { id: 103, date: '2024-11-05', hours: 36, earnings: 4000 },
            { id: 104, date: '2024-11-05', hours: 6, earnings: 4000 },
            { id: 105, date: '2024-11-05', hours: 6, earnings: 4000 },
            { id: 106, date: '2024-11-05', hours: 6, earnings: 4000 },
            { id: 107, date: '2024-11-05', hours: 6, earnings: 4000 },
            { id: 108, date: '2024-11-05', hours: 6, earnings: 4000 },
            { id: 109, date: '2024-11-05', hours: 6, earnings: 4000 },
        ],
        2: [
            { id: 201, date: '2024-11-02', hours: 10, earnings: 7000 },
            { id: 202, date: '2024-11-06', hours: 5, earnings: 3500 },
        ],
        3: [
            { id: 301, date: '2024-11-03', hours: 7, earnings: 4500 },
        ],
    };

    const [selectedMachine, setSelectedMachine] = useState(null);
    const [waybills, setWaybills] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);

    const handleMachinePress = (machine) => {
        setSelectedMachine(machine);
        const machineWaybills = waybillsData[machine.id] || [];
        setWaybills(machineWaybills);
        const earnings = machineWaybills.reduce((sum, waybill) => sum + waybill.earnings, 0);
        setTotalEarnings(earnings);
    };

    const renderMachineItem = ({ item }) => (
        <TouchableOpacity
            style={styles.machineItem}
            onPress={() => handleMachinePress(item)}
        >
            <Text style={styles.machineText}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderWaybillItem = ({ item }) => (
        <View style={styles.waybillItem}>
            <Text style={styles.waybillText}>Дата: {item.date}</Text>
            <Text style={styles.waybillText}>Время работы: {item.hours} ч</Text>
            <Text style={styles.waybillText}>Общие траты: {item.earnings} руб</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={machinesData}
                renderItem={renderMachineItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.machineList}
            />
            {selectedMachine && (
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailsTitle}>Машина: {selectedMachine.name}</Text>
                    <Text style={styles.totalEarnings}>Общий заработок: {totalEarnings} руб</Text>
                    <FlatList
                        data={waybills}
                        renderItem={renderWaybillItem}
                        keyExtractor={(item) => item.id.toString()}
                        style={styles.waybillList}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#E1D4C2',
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6E473B',
        marginBottom: 20,
    },
    machineList: {
        marginBottom: 20,
    },
    machineItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
        borderColor: '#BEB5A9',
        borderWidth: 1,
    },
    machineText: {
        fontSize: 18,
        color: '#6E473B',
    },
    detailsContainer: {
        height: 350,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#BEB5A9',
        borderWidth: 1,
    },
    detailsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6E473B',
        marginBottom: 10,
    },
    totalEarnings: {
        fontSize: 18,
        color: '#555',
        marginBottom: 20,
    },
    waybillList: {
        marginTop: 10,
    },
    waybillItem: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        marginBottom: 10,
        borderColor: '#E1D4C2',
        borderWidth: 1,
    },
    waybillText: {
        fontSize: 16,
        color: '#555',
    },
});

export default AnalyticsPage;
