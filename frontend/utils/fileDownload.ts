import AsyncStorage from "@react-native-async-storage/async-storage";

export const downloadFile = async (
    url: string,
    filename: string
) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("No token");

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Download failed");
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(blobUrl);
};
