import apiClient from './apiClient'; // Подключаем настроенный axios

export const fetchRequests = async (subdivision) => {

    try {
        const response = await apiClient.get(`/request/${subdivision}/`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении заявок:', error);
        throw error;
    }
};

export const createRequest = async (requestData) => {
    try {
        const response = await apiClient.post(`/request/`, requestData);
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании заявки:', error);
        throw error;
    }
};

export const patchRequest = async (requestData) => {
    try {
        const { id, ...remainingRequestData } = requestData;
        const response = await apiClient.patch(`/request/${requestData.id}/`, remainingRequestData);
        return response.data;
    } catch (error) {
        console.error('Ошибка при изменении заявки:', error);
        throw error;
    }
};

export const patchRequest_edit = async (requestData, request_id) => {
    try {
        const { list_index, ...remainingRequestData } = requestData;
        const response = await apiClient.patch(`/request/${request_id}/${requestData.list_index}/`, remainingRequestData);
        return response.data;
    } catch (error) {
        console.error('Ошибка при изменении заявки:', error);
        throw error;
    }
};