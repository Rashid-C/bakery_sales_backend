import { View, Text, Button, Alert, Linking } from "react-native";
import { useState } from "react";
import {
    getReportSummary,
    getReportPdfUrl,
    getReportExcelUrl,
} from "../../services/report.service";
import { downloadFile } from "../../utils/fileDownload";

export default function ReportsScreen() {
    const [type, setType] = useState<
        "daily" | "monthly" | "yearly"
    >("daily");
    const [total, setTotal] = useState<number | null>(null);

    const today = new Date().toISOString().split("T")[0];
    const month = today.slice(0, 7);
    const year = today.slice(0, 4);

    const value =
        type === "daily" ? today : type === "monthly" ? month : year;

    const loadReport = async () => {
        try {
            const data = await getReportSummary(type, value);
            setTotal(data.totalAmount);
        } catch {
            Alert.alert("Error", "Failed to load report");
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Admin Reports
            </Text>

            <Button title="Daily" onPress={() => setType("daily")} />
            <Button title="Monthly" onPress={() => setType("monthly")} />
            <Button title="Yearly" onPress={() => setType("yearly")} />

            <Button title="Load Report" onPress={loadReport} />

            {total !== null && (
                <Text style={{ marginTop: 20, fontSize: 16 }}>
                    Total Amount: ₹{total}
                </Text>
            )}

            <View style={{ marginTop: 20 }}>
                <Button
                    title="Download PDF"
                    onPress={() =>
                        downloadFile(
                            getReportPdfUrl(type, value),
                            `sales-${type}-${value}.pdf`
                        )
                    }
                />
                <Button
                    title="Download Excel"
                    onPress={() =>
                        downloadFile(
                            getReportExcelUrl(type, value),
                            `sales-${type}-${value}.xlsx`
                        )
                    }
                />
            </View>
        </View>
    );
}
