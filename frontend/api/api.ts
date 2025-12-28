import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../services/auth.service";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// 🚨 AUTO LOGOUT ON 401
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error?.response?.status === 401) {
            await logout();
        }
        return Promise.reject(error);
    }
);

export default api;
