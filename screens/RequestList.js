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

    const navigateToSelect = (dateItem, item, dateItem_index, machinery_index) => {
        const request_id = item.id;
        navigation.navigate('SelectEquipment', { dateItem, request_id, dateItem_index, machinery_index }); 
    };

    const handleRemoveNumber = (dateItem, machinery_index) => {
        // Удаляем номер машины
        const updatedMachinery = { ...dateItem };
        updatedMachinery.machinery[machinery_index] = null;

        setRequests((prevRequests) => {
            return prevRequests.map((request) => {
                if (request.date_type_quantity_plannedWorkTime_machinery.includes(dateItem)) {
                    return {
                        ...request,
                        date_type_quantity_plannedWorkTime_machinery: request.date_type_quantity_plannedWorkTime_machinery.map((entry) =>
                            entry === dateItem ? updatedMachinery : entry
                        ),
                    };
                }
                return request;
            });
        });
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
                                                    onPress={() => handleRemoveNumber(dateItem, machinery_index)}
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
                        </View>
                    )}
                    keyExtractor={(dateItem, index) => index.toString()}
                />
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
        alignItems: 'center',
        marginBottom: 5,
    },
    machineryLabel: {
        fontSize: 16,
        marginRight: 10,
    },
    machineryAssigned: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    machineryNumber: {
        fontSize: 16,
        marginRight: 10,
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
    separator: {
        color: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default RequestList;
