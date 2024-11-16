import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { createRequest } from '../services/api';

const RequestForm = ({ navigation }) => {
    const [requestData, setRequestData] = useState({
        type: '',
        quantity: '',
        time: '',
    });

    const handleInputChange = (name, value) => {
        setRequestData({ ...requestData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            await createRequest(requestData);
            navigation.navigate('RequestList'); // Вернуться к списку заявок
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
        }
    };

    return (
        <View>
            <Text>Тип техники:</Text>
            <TextInput onChangeText={(value) => handleInputChange('type', value)} />
            <Text>Количество:</Text>
            <TextInput onChangeText={(value) => handleInputChange('quantity', value)} />
            <Text>Время подачи:</Text>
            <TextInput onChangeText={(value) => handleInputChange('time', value)} />
            <Button title="Отправить заявку" onPress={handleSubmit} />
        </View>
    );
};

export default RequestForm;