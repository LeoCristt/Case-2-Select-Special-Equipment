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

    const renderRequestItem = ({ item }) => (
        <View style={styles.requestItem}>
            <Text style={styles.requestTitle}>Заявка: {item.master.name}</Text>
            <View style={styles.datesContainer}>
                <FlatList
                    data={item.date_type_quantity_plannedWorkTime_machinery}
                    renderItem={({ item: dateItem, index }) => (
                        <View style={styles.dateItem}>
                            <Text style={styles.separator}>-----------------------------------------------------</Text>
                            <Text style={styles.text}>Тип техники: {dateItem.type}</Text>
                            <Text style={styles.text}>Количество: {dateItem.quantity} шт.</Text>
                            <Text style={styles.text}>Плановое время работы: {dateItem.plannedWorkTime} часа</Text>
                            <Text style={styles.text}>Время подачи: {dateItem.date}</Text>
                            <Text style={styles.separator}>-----------------------------------------------------</Text>
                            <View style={styles.machineryListContainer}>
                                {Array.from({ length: dateItem.quantity }).map((_, machinery_index) => (
                                    <View style={styles.machineryItem} key={machinery_index}>
                                        <Text style={styles.machineryLabel}>
                                            Номер машины {machinery_index + 1}:
                                        </Text>
                                        {dateItem.machinery[machinery_index] ? (
                                            <View style={styles.machineryAssigned}>
                                                <Text style={styles.machineryNumber}>
                                                    {dateItem.machinery[machinery_index]}
                                                </Text>
                                                <TouchableOpacity
                                                    style={styles.removeButton}
                                                    onPress={() => navigateToSelect(dateItem, item, index, machinery_index)}
                                                >
                                                    <Text style={styles.buttonText}>✖</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                style={styles.addNumberButton}
                                                onPress={() =>
                                                    navigateToSelect(dateItem, item, index, machinery_index)
                                                }
                                            >
                                                <Text style={styles.buttonText}>Добавить номер</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                            </View>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.commonButton, styles.editButton]}
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
                    style={[styles.commonButton, styles.addButton]}
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
                <View style={styles.buttonContainer}>
                    <Button
                        title="Отправить заявки"
                        onPress={() => {
                            const requestIds = requests.map((request) => request.id);
                            sendRequests(requestIds)
                                .then(() => {
                                    setRequests([]);
                                    Alert.alert('Успех', 'Все заявки успешно отправлены!');
                                })
                                .catch((error) => {
                                    console.error('Ошибка при отправке заявок:', error);
                                    Alert.alert('Ошибка', 'Не удалось отправить заявки.');
                                });
                        }}
                        color="#6E473B"
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
    requestItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#BEB5A9',
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    requestTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6E473B',
        marginBottom: 10,
    },
    datesContainer: {
        paddingLeft: 10,
    },
    dateItem: {
        marginBottom: 15,
    },
    text: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    separator: {
        color: '#ccc',
        marginVertical: 5,
    },
    machineryListContainer: {
        marginTop: 10,
    },
    machineryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    machineryLabel: {
        fontSize: 16,
        marginRight: 10,
        color: '#6E473B',
    },
    machineryAssigned: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    machineryNumber: {
        fontSize: 16,
        marginRight: 10,
        color: '#6E473B',
    },
    removeButton: {
        backgroundColor: '#dc3545',
        padding: 8,
        borderRadius: 5,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
    buttonContainer: {
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
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