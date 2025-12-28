import { View, Text, Button, FlatList, Alert } from "react-native";
import { useEffect, useState } from "react";
import {
    getUsers,
    toggleUserStatus,
} from "../../services/user.service";
import { router } from "expo-router";


export default function AdminUsersScreen() {
    const [users, setUsers] = useState<any[]>([]);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch {
            Alert.alert("Error", "Failed to load users");
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const toggleStatus = async (id: string) => {
        try {
            await toggleUserStatus(id);
            loadUsers();
        } catch {
            Alert.alert("Error", "Action failed");
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Manage Users
            </Text>

            <Button
                title="➕ Create User"
                onPress={() => router.push("/create-user")
                }
            />



            <FlatList
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            padding: 10,
                            borderBottomWidth: 1,
                            borderColor: "#ddd",
                        }}
                    >
                        <Text>{item.name}</Text>
                        <Text>{item.username}</Text>
                        <Text>Role: {item.role}</Text>
                        <Text>Status: {item.isActive ? "Active" : "Blocked"}</Text>

                        <Button
                            title={item.isActive ? "Block" : "Unblock"}
                            onPress={() => toggleStatus(item._id)}
                        />
                    </View>
                )}
            />
        </View>
    );
}
