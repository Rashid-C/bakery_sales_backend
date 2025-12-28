// services/auth.service.ts
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const login = async (username: string, password: string) => {
    const res = await api.post("/auth/login", {
        username,
        password,
    });

    await AsyncStorage.setItem("token", res.data.token);
    await AsyncStorage.setItem("role", res.data.role);

    return res.data;
};


export const logout = async () => {
    await AsyncStorage.multiRemove([
        "token",
        "role",
    ]);

    router.replace("/login");
};
