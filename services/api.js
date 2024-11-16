import axios from 'axios';

const API_URL = 'http://192.168.0.28:8000/api';  // где 192.168.x.x - это IP вашего ПК

export const fetchRequests = async () => {
    try {
        const response = await axios.get(`${API_URL}/requests/`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении заявок:', error);
        throw error;
    }
};

export const createRequest = async (requestData) => {
    try {
        const response = await axios.post(`${API_URL}/requests/`, requestData);
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании заявки:', error);
        throw error;
    }
};
