import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");

      // 🔒 Not logged in
      if (!token) {
        router.replace("/login");
        return;
      }

      // 🧭 PLATFORM-AWARE ROUTING
      if (role === "ADMIN") {
        router.replace("/users");
      } else {
        router.replace("/shops");
      }

      setReady(true);
    };

    init();
  }, []);

  // ⛔ Prevent flash / auto-navigation
  if (!ready && Platform.OS !== "web") {
    return null;
  }

  return null;
}
