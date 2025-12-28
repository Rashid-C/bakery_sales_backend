import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { getShops } from "../../services/shop.service";
import { Button } from "react-native";
import { logout } from "../../services/auth.service";

export default function ShopsScreen() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const loadShops = async () => {
      try {
        const data = await getShops();
        console.log("SHOPS RESPONSE:", data);
        setShops(data);
      } catch (err) {
        console.log("SHOP API ERROR:", err);
      }
    };

    loadShops();
  }, []);


  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => router.push(`/sales/${item._id}`)}
      style={{
        padding: 10,
        borderWidth: 1,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri: `https://bakery-sales-backend.onrender.com${item.imageUrl}`,
        }}
        style={{ width: 60, height: 60, marginRight: 10 }}
      />
      <Text style={{ fontSize: 16 }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Select Shop
      </Text>
      <Button title="Logout" onPress={logout} />

      <FlatList
        data={shops}
        keyExtractor={(item: any) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}
