import NetInfo from "@react-native-community/netinfo";
import { createSale } from "./sale.service";
import {
    getPendingSales,
    savePendingSale,
    clearPendingSales,
} from "../utils/offlineSales";

export const syncPendingSales = async () => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) return;

    const pending = await getPendingSales();
    if (pending.length === 0) return;

    const successful = [];

    for (const sale of pending) {
        try {
            await createSale(sale);
            successful.push(sale);
        } catch {
            break; // stop if one fails
        }
    }

    if (successful.length === pending.length) {
        await clearPendingSales();
    }
};

export const submitSaleSafe = async (sale: any) => {
    const state = await NetInfo.fetch();

    if (!state.isConnected) {
        await savePendingSale(sale);
        return { offline: true };
    }

    return createSale(sale);
};
