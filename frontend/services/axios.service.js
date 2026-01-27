import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000"
});


export async function handleError(url, typeReq, error) {
    if (error.response) {
        console.error(`[${typeReq}] ${url} - Erreur serveur :`, error.response.data);
        throw error.response;
    }
    else if (error.request) {
        console.error(`[${typeReq}] ${url} - Aucune réponse du serveur`);
        throw { message: "Serveur injoignable" }
    }
    else {
        console.error(`[${typeReq}] ${url} - Erreur Axios :`, error.message); 
        throw error;
    }
}



export const getRequest = async (url) => {
    let response = null;
    try {
        response = await axiosInstance.get(url);
    } catch (error) {
        response = await handleError(url, 'get', error);
    }

    return response;
}

export const postRequest = async (url, data, config = {}) => {
    let response = null;
    try {
        response = await axiosInstance.post(url, data, config);
    } catch (error) {
        response = await handleError(url, 'post', error);
    }
    return response;

}

export const putRequest = async (url, data, config = {}) => {
    let response = null;
    try {
        response = await axiosInstance.put(url, data, config);
    } catch (error) {
        response = await handleError(url, 'put', error);
    }
    return response;
}

export const patchRequest = async (url, data, config = {}) => {
    let response = null;
    try {
        response = await axiosInstance.patch(url, data, config);
    } catch (error) {
        response = await handleError(url, 'patch', error);
    }
    return response;
}

export const deleteRequest = async (url, data, config = {}) => {
    let response = null;
    try {
        response = await axiosInstance.delete(url, data, config);
    } catch (error) {
        response = await handleError(url, 'delete', error);
    }
    return response;
}
