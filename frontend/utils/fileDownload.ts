import { Platform, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const downloadFile = async (
  url: string,
  filename: string
) => {
  try {
    // 🌐 WEB
    if (Platform.OS === "web") {
      window.open(url, "_blank");
      return;
    }

    // 📱 MOBILE
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "Not authenticated");
      return;
    }

    // ✅ SAFE DIRECTORY
    const directory = FileSystem.cacheDirectory;
    if (!directory) {
      Alert.alert("Error", "File system unavailable");
      return;
    }

    const fileUri = directory + filename;

    const downloadResult = await FileSystem.downloadAsync(
      url,
      fileUri,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert(
        "Downloaded",
        `File saved at:\n${downloadResult.uri}`
      );
      return;
    }

    await Sharing.shareAsync(downloadResult.uri);
  } catch (error) {
    console.error("DOWNLOAD ERROR:", error);
    Alert.alert("Error", "Download failed");
  }
};
