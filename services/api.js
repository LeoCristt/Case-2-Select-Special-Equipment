import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL;

console.log(API_URL)

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

export const patchRequest = async (requestData) => {
    try {
        const { id, ...remainingRequestData } = requestData;
        console.log(requestData)
        const response = await axios.patch(`${API_URL}/requests/${requestData.id}/`, remainingRequestData);
        return response.data;
    } catch (error) {
        console.error('Ошибка при изменении заявки:', error);
        throw error;
    }
};