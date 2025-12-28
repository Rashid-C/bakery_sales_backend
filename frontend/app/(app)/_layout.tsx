import { useEffect } from "react";
import { Stack } from "expo-router";
import { syncPendingSales } from "../../services/sync.service";

export default function AppLayout() {
    useEffect(() => {
        syncPendingSales();
    }, []);

    return <Stack />;
}
