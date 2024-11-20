import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { updateRequest } from '../services/api'; // Предположим, что updateRequest импортируется из api

const EditRequest = ({ route, navigation }) => {
    const { request } = route.params; // Получаем данные заявки из параметров маршрута
    const [master, setMaster] = useState(request.master);
    const [dateTypeQuantityPlannedWorkTime, setDateTypeQuantityPlannedWorkTime] = useState(request.date_type_quantity_plannedWorkTime);

    const handleSave = async () => {
        try {
            const updatedRequest = {
                ...request,
                master,
                date_type_quantity_plannedWorkTime,
            };

            await updateRequest(updatedRequest); // Отправляем обновленные данные на сервер
            Alert.alert('Успех', 'Заявка успешно обновлена!');
            navigation.goBack(); // Возвращаемся на предыдущий экран
        } catch (error) {
            console.error('Ошибка при обновлении заявки:', error);
            Alert.alert('Ошибка', 'Не удалось обновить заявку.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "android" ? "padding" : "height"}
            keyboardVerticalOffset={100} // Отступ для клавиатуры
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Редактировать заявку</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Имя мастера"
                    value={master}
                    onChangeText={setMaster}
                />
                {/* Здесь можно добавить дополнительные поля для редактирования */}
                {dateTypeQuantityPlannedWorkTime.map((item, index) => (
                    <View key={index} style={styles.dateItem}>
                        <TextInput
                            style={styles.input}
                            placeholder="Тип техники"
                            value={item.type}
                            onChangeText={(text) => {
                                const newData = [...dateTypeQuantityPlannedWorkTime];
                                newData[index].type = text;
                                setDateTypeQuantityPlannedWorkTime(newData);
                            }}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Количество"
                            value={String(item.quantity)}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                const newData = [...dateTypeQuantityPlannedWorkTime];
                                newData[index].quantity = Number(text);
                                setDateTypeQuantityPlannedWorkTime(newData);
                            }}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Плановое время работы"
                            value={item.plannedWorkTime}
                            onChangeText={(text) => {
                                const newData = [...dateTypeQuantityPlannedWorkTime];
                                newData[index].plannedWorkTime = text;
                                setDateTypeQuantityPlannedWorkTime(newData);
                            }}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Время подачи"
                            value={item.date}
                            onChangeText={(text) => {
                                const newData = [...dateTypeQuantityPlannedWorkTime];
                                newData[index].date = text;
                                setDateTypeQuantityPlannedWorkTime(newData);
                            }}
                        />
                    </View>
                ))}
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
        paddingBottom: 40, // Добавляем отступ внизу для кнопки
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    dateItem: {
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 10, 
    },
});

export default EditRequest;