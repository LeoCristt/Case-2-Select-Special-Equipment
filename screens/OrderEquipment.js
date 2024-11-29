import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

const OrderEquipment = ({ navigation }) => {
    const [equipmentType, setEquipmentType] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [requestDescription, setRequestDescription] = useState('');

    const handleSubmit = () => {
        // Logic for form submission
        console.log('Заявка на стороннюю технику:', {
            equipmentType,
            contactName,
            contactPhone,
            requestDescription,
        });
        navigation.navigate('Dashboard'); // Navigate to the Dashboard after submission
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'android' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'android' ? 100 : 0}
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Заказ сторонней техники</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Тип техники:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите тип техники"
                        value={equipmentType}
                        onChangeText={setEquipmentType}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Контактное лицо:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите имя контакта"
                        value={contactName}
                        onChangeText={setContactName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Телефон:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите номер телефона"
                        keyboardType="phone-pad"
                        value={contactPhone}
                        onChangeText={setContactPhone}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Описание заявки:</Text>
                    <TextInput
                        style={styles.textarea}
                        placeholder="Опишите заявку"
                        value={requestDescription}
                        onChangeText={setRequestDescription}
                        multiline
                    />
                </View>

                <Button
                    title="Отправить заявку"
                    onPress={handleSubmit}
                    color="#6E473B" // Consistent button color
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E1D4C2', // Matching the theme of RequestForm
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
        marginBottom: 15, // Controls spacing between input groups
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold', // Match your first code
        color: '#6E473B',
        marginBottom: 8, // Same spacing as your first code
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#BEB5A9',
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    textarea: {
        height: 100,
        borderWidth: 1,
        borderColor: '#BEB5A9',
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
    },
});

export default OrderEquipment;
