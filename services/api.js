import apiClient from './apiClient'; // Подключаем настроенный axios

const API_URL = "";

export const fetchRequests = async (subdivision) => {

    try {
        const response = await apiClient.get(`/requests/${subdivision}/`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении заявок:', error);
        throw error;
    }
};

export const createRequest = async (requestData) => {
    try {
        const response = await apiClient.post(`/requests/`, requestData);
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
        const response = await apiClient.patch(`/requests/${requestData.id}/`, remainingRequestData);
        return response.data;
    } catch (error) {
        console.error('Ошибка при изменении заявки:', error);
        throw error;
    }
};