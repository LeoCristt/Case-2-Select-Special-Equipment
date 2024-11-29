import React, { useState } from 'react';
import { patchRequest_edit } from '../services/api';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

const EditRequest = ({ route, navigation }) => {
    const { dateItem, request_id, dateItem_index } = route.params;

    if (!dateItem) {
        console.error('dateItem не передан в EditRequest');
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Ошибка: Не удалось загрузить данные заявки.</Text>
            </View>
        );
    }

    const [type, setType] = useState(dateItem.type);
    const [quantity, setQuantity] = useState(dateItem.quantity);
    const [plannedWorkTime, setPlannedWorkTime] = useState(dateItem.plannedWorkTime);
    const [date, setDate] = useState(dateItem.date);

    const handleSave = async () => {
        try {
            await patchRequest_edit(
                {
                    date,
                    plannedWorkTime,
                    quantity,
                    type,
                },
                request_id,
                dateItem_index
            );
            navigation.navigate('RequestList');
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось сохранить изменения. Попробуйте снова.');
            console.error('Ошибка при сохранении изменений:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'android' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'android' ? 100 : 0}
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Редактировать заявку</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Тип техники:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите тип техники"
                        value={type}
                        onChangeText={setType}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Количество:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите количество"
                        value={String(quantity)}
                        keyboardType="numeric"
                        onChangeText={(text) => setQuantity(Number(text))}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Плановое время работы:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите плановое время работы"
                        value={String(plannedWorkTime)}
                        keyboardType="numeric"
                        onChangeText={(text) => setPlannedWorkTime(Number(text))}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Время подачи:</Text>
                    <TextInputMask
                        type={'datetime'}
                        options={{
                            format: 'YYYY-MM-DD HH:MM',
                        }}
                        style={styles.input}
                        placeholder="Введите дату и время"
                        value={date}
                        onChangeText={setDate}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Сохранить изменения"
                        onPress={handleSave}
                        color="#6E473B" // Consistent button color
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E1D4C2', // Matching theme of RequestForm
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
        marginBottom: 15, // Consistent spacing between input groups
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6E473B',
        marginBottom: 8, // Match your first design
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
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});

export default EditRequest;
