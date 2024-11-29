import React, { useState } from 'react';
import { patchRequest } from '../services/api';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

const RequestDetail = ({ route, navigation }) => {
    const { request } = route.params;
    const [type, setType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [plannedWorkTime, setPlannedWorkTime] = useState('');
    const [date, setDate] = useState('');

    const addEquipment = () => {
        if ([type, quantity, plannedWorkTime, date].every(Boolean)) {
            patchRequest({ id: request.id, date: date + ":00", type: type, quantity: quantity, plannedWorkTime: plannedWorkTime, machinery: {} });
            console.log(`Добавлено новое оборудование: ${type}, Количество: ${quantity}, Время работы: ${plannedWorkTime}, Дата: ${date}`);
            setType('');
            setQuantity('');
            setPlannedWorkTime('');
            setDate('');
            navigation.navigate('RequestList');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "android" ? "padding" : "height"}
            keyboardVerticalOffset={100}
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Добавить новое оборудование</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Тип техники:</Text>
                    <TextInput
                        style={styles.input}
                        value={type}
                        onChangeText={setType}
                        placeholder="Введите тип техники"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Количество:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        value={quantity}
                        onChangeText={setQuantity}
                        placeholder="Введите количество"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Плановое время работы:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        value={plannedWorkTime}
                        onChangeText={setPlannedWorkTime}
                        placeholder="Введите плановое время работы"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Время подачи:</Text>
                    <TextInputMask
                        type={'datetime'}
                        options={{
                            format: 'YYYY-MM-DD HH:mm'
                        }}
                        value={date}
                        onChangeText={setDate}
                        style={styles.input}
                        placeholder="Введите дату и время"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button title="Добавить" onPress={addEquipment} color="#6E473B" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E1D4C2',
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingBottom: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6E473B',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6E473B',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#BEB5A9',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default RequestDetail;
