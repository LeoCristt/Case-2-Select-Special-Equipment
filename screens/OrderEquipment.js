import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const OrderEquipment = ({ navigation }) => {
    const [equipmentType, setEquipmentType] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [requestDescription, setRequestDescription] = useState('');

    const handleSubmit = () => {
        // Здесь вы можете добавить логику для отправки данных формы на сервер
        console.log('Заявка на стороннюю технику:', {
            equipmentType,
            contactName,
            contactPhone,
            requestDescription,
        });
        // После отправки заявки, можете перенаправить пользователя на другую страницу
        navigation.navigate('Dashboard');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Заказ сторонней техники</Text>
            <TextInput
                style={styles.input}
                placeholder="Тип техники"
                value={equipmentType}
                onChangeText={setEquipmentType}
            />
            <TextInput
                style={styles.input}
                placeholder="Контактное лицо"
                value={contactName}
                onChangeText={setContactName}
            />
            <TextInput
                style={styles.input}
                placeholder="Телефон"
                value={contactPhone}
                onChangeText={setContactPhone}
            />
            <TextInput
                style={styles.textarea}
                placeholder="Описание заявки"
                value={requestDescription}
                onChangeText={setRequestDescription}
                multiline
            />
            <Button title="Отправить заявку" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    textarea: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default OrderEquipment;