import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

const EditRequest = ({ route, navigation }) => {
    const { dateItem } = route.params;

    // Проверяем, что dateItem определен
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
        // Логика сохранения...
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "android" ? "padding" : "height"}
            keyboardVerticalOffset={100}
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Редактировать заявку</Text>
                <Text style={styles.label}>Добавленные временные слоты:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Тип техники"
                    value={type}
                    onChangeText={setType}
                />
                <Text style={styles.label}>Количество:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Количество"
                    value={String(quantity)}
                    keyboardType="numeric"
                    onChangeText={(text) => setQuantity(Number(text))}
                />
                <Text style={styles.label}>Плановое время работы:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Плановое время работы"
                    value={plannedWorkTime}
                    onChangeText={setPlannedWorkTime}
                />
                <Text style={styles.label}>Время подачи:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Время подачи"
                    value={date}
                    onChangeText={setDate}
                />
                <View style={styles.buttonContainer}>
                    <Button title="Сохранить изменения" onPress={handleSave} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    scrollView: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default EditRequest;