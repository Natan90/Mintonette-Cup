import axios from "axios";


const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000
});


const handleError = (error) => {
    if (error.response) {
        console.error("Erreur serveur :", error.response.data);
        throw error.response.data;
    }
    else if (error.request) {
        console.error("Aucune réponse du serveur");
        throw { message: "Serveur injoignable" }
    }
    else {
        console.error("Erreur interne Axios :", error.message);
        throw error;
    }
}



const get = async (url, config = {}) => {
    try {
        const response = await axiosInstance.get(url, config);
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

const post = async (url, data, config = {}) => {
    try {
        const response = await axiosInstance.post(url, data, config);
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

const put = async (url, data, config = {}) => {
    try {
        const response = await axiosInstance.put(url, data, config);
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

const patch = async (url, data, config = {}) => {
    try {
        const response = await axiosInstance.patch(url, data, config);
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

const del = async (url, data, config = {}) => {
    try {
        const response = await axiosInstance.delete(url, data, config);
        return response.data;
    } catch (error) {
        handleError(error)
    }
}

export default {
    get, 
    post, 
    put,
    patch,
    del
}