import { View, Text, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { login } from "../../services/auth.service";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(username, password);
      router.replace("/(app)"); // ✅ CORRECT
    } catch {
      Alert.alert("Login failed", "Invalid credentials");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Login</Text>

      <TextInput
        placeholder="Email or Mobile"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
