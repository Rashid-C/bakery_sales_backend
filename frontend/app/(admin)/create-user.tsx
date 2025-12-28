import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { createUser } from "../../services/user.service";

export default function CreateUserScreen() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"EMPLOYEE" | "ADMIN">("EMPLOYEE");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!name || !username || !password) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        try {
            setLoading(true);

            await createUser({
                name,
                username,
                password,
                role,
            });

            Alert.alert("Success", "User created successfully");

            router.replace("/users");
            ; // 👈 go back to list
        } catch (err: any) {
            Alert.alert(
                "Error",
                err?.response?.data?.message || "Failed to create user"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Create User
            </Text>

            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <TextInput
                placeholder="Email or Mobile"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <View style={{ marginBottom: 10 }}>
                <Button
                    title={`Role: ${role}`}
                    onPress={() =>
                        setRole(role === "EMPLOYEE" ? "ADMIN" : "EMPLOYEE")
                    }
                />
            </View>

            <Button
                title={loading ? "Creating..." : "Create User"}
                onPress={submit}
                disabled={loading}
            />
        </View>
    );
}
