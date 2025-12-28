import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "PENDING_SALES";

export const getPendingSales = async () => {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
};

export const savePendingSale = async (sale: any) => {
    const existing = await getPendingSales();
    await AsyncStorage.setItem(
        KEY,
        JSON.stringify([...existing, sale])
    );
};

export const clearPendingSales = async () => {
    await AsyncStorage.removeItem(KEY);
};
