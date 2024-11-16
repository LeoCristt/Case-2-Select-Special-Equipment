import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { fetchRequests } from '../services/api';

const RequestList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const data = await fetchRequests();
                setRequests(data);
            } catch (error) {
                console.error('Ошибка при загрузке заявок:', error);
            } finally {
                setLoading(false);
            }
        };

        loadRequests();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View>
            <FlatList
                data={requests}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.type}</Text>
                        <Text>{item.quantity}</Text>
                        <Text>{item.time}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

export default RequestList;