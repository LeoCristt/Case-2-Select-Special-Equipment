import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { fetchRequests, sendRequests } from '../services/api';
import { AuthContext } from '../services/AuthContext';

const RequestList = ({ navigation }) => {
    const [requests, setRequests] = useState([]);
    const [subdivision, setSubdivision] = useState('');
    const { token, decodedToken } = useContext(AuthContext);

    useEffect(() => {
        const decodeJWT = async () => {
            if (decodedToken) {
                setSubdivision(decodedToken.subdivision);
            } else {
                console.log("Токен не найден");
            }
        };

        decodeJWT();
    }, []);

    useEffect(() => {
        const loadRequests = async () => {
            try {
                if (!subdivision) return;
                const fetchedRequests = await fetchRequests(subdivision);
                setRequests(fetchedRequests);
            } catch (error) {
                console.error('Ошибка при загрузке заявок:', error);
            }
        };

        loadRequests();
    }, [subdivision]);

    const navigateToDetail = (request) => {
        navigation.navigate('RequestDetail', { request });
    };

    const navigateToEdit = (dateItem, item, index) => {
        const request_id = item.id;
        const dateItem_index = index;
        navigation.navigate('EditRequest', { dateItem, request_id, dateItem_index }); 
    };

    const navigateToSelect = (dateItem, item, dateItem_index, machinery_index) => {
        const request_id = item.id;
        navigation.navigate('SelectEquipment', { dateItem, request_id, dateItem_index, machinery_index }); 
    };

    const handleSendRequests = async () => {
        try {
            const requestIds = requests.map(request => request.id);
            await sendRequests(requestIds);
            setRequests([]);
            Alert.alert('Успех', 'Все заявки успешно отправлены!');
        } catch (error) {
            console.error('Ошибка при отправке заявок:', error);
            Alert.alert('Ошибка', 'Не удалось отправить заявки.');
        }
    };

    const renderRequestItem = ({ item }) => (
        <View style={styles.requestItem}>
            <Text style={styles.requestTitle}>Заявка: {item.master.name}</Text>
            <View style={styles.datesContainer}>
                <FlatList
                    data={item.date_type_quantity_plannedWorkTime_machinery}
                    renderItem={({ item: dateItem, index }) => (
                        <View style={styles.dateItem}>
                            <Text style={styles.separator}>-----------------------------------------------------</Text>
                            <Text>Тип техники: {dateItem.type}</Text>
                            <Text>Количество: {dateItem.quantity} шт.</Text>
                            <Text>Плановое время работы: {dateItem.plannedWorkTime} часа</Text>
                            <Text>Время подачи: {dateItem.date}</Text>
                            <Text style={styles.separator}>-----------------------------------------------------</Text>
                            <View style={styles.machineryListContainer}>
                                {Array.from({ length: dateItem.quantity }).map((_, machinery_index) => (
                                    <View style={styles.machineryItem} key={machinery_index}>
                                        <Text style={styles.machineryNumber}>Номер Машины {machinery_index + 1} {dateItem.machinery[machinery_index + 1]}</Text>
                                        <TouchableOpacity
                                            style={styles.addNumberButton}
                                            onPress={() => navigateToSelect(dateItem, item, index, machinery_index + 1)}
                                        >
                                            <Text style={styles.buttonText}>Добавить номер</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => navigateToEdit(dateItem, item, index)}
                                >
                                    <Text style={styles.buttonText}>Редактировать</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    keyExtractor={(dateItem, index) => index.toString()}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigateToDetail(item)}
                >
                    <Text style={styles.buttonText}>Добавить новую технику</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                renderItem={renderRequestItem}
                keyExtractor={(item) => item.id.toString()}
            />
            {requests.length > 0 && (
                <Button
                    title="Отправить заявки"
                    onPress={handleSendRequests}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f8f8',
        flex: 1,
    },
    requestItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    requestTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    datesContainer: {
        paddingLeft: 10,
    },
    dateItem: {
        marginBottom: 10,
    },
    machineryListContainer: {
        marginTop: 10,
    },
    machineryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    machineryNumber: {
        fontSize: 16,
    },
    addNumberButton: {
        backgroundColor: '#28a745',
        padding: 8,
        borderRadius: 5,
        width: 150,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    separator: {
        color: '#ccc',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#6c757d',
        padding: 8,
        borderRadius: 5,
        width: 150,
        height: 40,
        alignSelf: 'flex-start',
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default RequestList;
