import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { patchRequest } from '../services/api';
import { TextInputMask } from 'react-native-masked-text';

const RequestDetail = ({ route, navigation }) => {
    const { request } = route.params;
    const [type, setType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [plannedWorkTime, setPlannedWorkTime] = useState('');
    const [date, setDate] = useState('');

    const addEquipment = () => {
        if ([type, quantity, plannedWorkTime, date].every(Boolean)) {
            patchRequest({ id: request.id, date: date, type: type, quantity: quantity, plannedWorkTime: plannedWorkTime });
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
                <View style={styles.container}>
                    <Text style={styles.label}>Тип техники:</Text>
                    <TextInput
                        style={styles.input}
                        value={type}
                        onChangeText={setType}
                    />
                    <Text style={styles.label}>Количество:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        value={quantity}
                        onChangeText={setQuantity}
                    />
                    <Text style={styles.label}>Плановое время работы:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        value={plannedWorkTime}
                        onChangeText={setPlannedWorkTime}
                    />
                    <Text style={styles.label}>Время подачи:</Text>
                    <TextInputMask
                        type={'datetime'}
                        options={{
                            format: 'YYYY-MM-DD HH:mm'
                        }}
                        value={date}
                        onChangeText={setDate}
                        style={styles.input}
                    />
                    <Button title="Добавить" onPress={addEquipment} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f8f8',
        flex: 1,
    },
    scrollView: {
        padding: 20,
        paddingBottom: 40,
    },
    label: {
        fontSize: 18,
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});

export default RequestDetail;