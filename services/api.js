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

export const fetchRequests_dispatcher = async () => {
    try {
        const response = await apiClient.get(`/request/`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении заявок:', error);
        throw error;
    }
};

export const fetchMachineries = async () => {
    try {
        const response = await apiClient.get(`/machinery/`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении заявок:', error);
        throw error;
    }
};

export const fetchRouteSheets = async () => {
    try {
        const response = await apiClient.get(`/waybill/`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении путевых листов:', error);
        throw error;
    }
};

export const fetchRouteSheets_subdivision = async (subdivision) => {
    try {
        const response = await apiClient.get(`/waybill/${subdivision}/`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении путевых листов:', error);
        throw error;
    }
};

export const deleteMachinery_fromRequest = async (request_id, dateItem_index, machinery_index) => {
    try {
        const response = await apiClient.delete(`/request/${request_id}/${dateItem_index}/${machinery_index}/`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при удалении машины:', error);
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

export const createWaybill = async (requestData) => {
    try {
        const response = await apiClient.post(`/waybill/`, requestData);
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

export const patchRequest_edit = async (requestData, request_id, dateItem_index) => {
    try {
        const { list_index, ...remainingRequestData } = requestData;
        const response = await apiClient.patch(`/request/${request_id}/${dateItem_index}/`, remainingRequestData);
        return response.data;
    } catch (error) {
        console.error('Ошибка при изменении заявки:', error);
        throw error;
    }
};

export const updateWaybill = async (requestData, waybill_id) => {
    try {
        const response = await apiClient.patch(`/waybill/${waybill_id}/`, requestData);
        return response.data;
    } catch (error) {
        console.error('Ошибка при изменении заявки:', error);
        throw error;
    }
};

export const sendRequests = async (requestIds) => {
    try {
        // Массив для хранения результатов запросов
        const results = [];

        // Проходим по каждому requestId
        for (const id of requestIds) {
            try {
                // Отправляем запрос для каждого id
                const response = await apiClient.patch(`/request/${id}/`);
                results.push(response.data);  // Добавляем результат в массив
            } catch (error) {
                console.error(`Ошибка при отправке заявки с id ${id}:`, error);
                // Можно сохранить ошибку в массив, если нужно обработать ее позже
                results.push({ error: `Ошибка при отправке заявки с id ${id}` });
            }
        }

        // Возвращаем все результаты
        return results;
    } catch (error) {
        console.error('Ошибка при обработке всех заявок:', error);
        throw error;
    }
};