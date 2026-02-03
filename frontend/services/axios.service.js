import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});


export async function handleError(url, typeReq, error) {
    if (error?.response) {
        console.error(`[${typeReq}] ${url} - Erreur serveur :`, error.response.data);
        throw error.response;
    }
    else if (error?.request) {
        console.error(`[${typeReq}] ${url} - Aucune réponse du serveur`);
        throw { message: "Serveur injoignable" }
    }
    else {
        console.error(`[${typeReq}] ${url} - Erreur Axios :`, error.message); 
        throw error;
    }
}



export const getRequest = async (url, config) => {
    try {
        return await axiosInstance.get(url, config);
    } catch (error) {
        return handleError(url, 'get', error);
    }
}

export const postRequest = async (url, data, config = {}) => {
    try {
        return await axiosInstance.post(url, data, config);
    } catch (error) {
        return handleError(url, 'post', error);
    }
}

export const putRequest = async (url, data, config = {}) => {
    try {
        return await axiosInstance.put(url, data, config);
    } catch (error) {
        return handleError(url, 'put', error);
    }
}

export const patchRequest = async (url, data, config = {}) => {
    try {
        return await axiosInstance.patch(url, data, config);
    } catch (error) {
        return handleError(url, 'patch', error);
    }
}

export const deleteRequest = async (url, data, config = {}) => {
    try {
        return await axiosInstance.delete(url, data, config);
    } catch (error) {
        return handleError(url, 'delete', error);
    }
}
