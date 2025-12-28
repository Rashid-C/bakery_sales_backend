import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
    useEffect(() => {
        const redirectByRole = async () => {
            const role = await AsyncStorage.getItem("role");

            if (role === "ADMIN") {
                router.replace("/reports"); // 👈 ADMIN dashboard
            } else {
                router.replace("/shops");   // 👈 EMPLOYEE flow
            }
        };

        redirectByRole();
    }, []);

    return null;
}
