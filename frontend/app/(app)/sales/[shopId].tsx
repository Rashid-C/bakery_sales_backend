import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Button,
    Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getProducts } from "../../../services/product.service";
import { createSale } from "../../../services/sale.service";

export default function SalesScreen() {
    const { shopId } = useLocalSearchParams<{ shopId: string }>();

    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);

    // Load products
    useEffect(() => {
        getProducts()
            .then(setProducts)
            .catch(() => Alert.alert("Error", "Failed to load products"));
    }, []);

    // Increase quantity
    const increase = (id: string) => {
        setCart((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }));
    };

    // Decrease quantity
    const decrease = (id: string) => {
        setCart((prev) => {
            const qty = (prev[id] || 0) - 1;
            if (qty <= 0) {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            }
            return { ...prev, [id]: qty };
        });
    };

    // Submit sale
    const submitSale = async () => {
        const items = Object.entries(cart).map(([productId, quantity]) => ({
            productId,
            quantity,
        }));

        if (items.length === 0) {
            Alert.alert("No items", "Please add at least one product");
            return;
        }

        try {
            setLoading(true);

            const saleDate = new Date().toISOString().split("T")[0];

            const res = await createSale({
                shopId,
                saleDate,
                items,
            });

            Alert.alert(
                "Sale Added ✅",
                `Total Amount: ₹${res.totalAmount}`
            );

            setCart({});
        } catch (err: any) {
            Alert.alert(
                "Error",
                err?.response?.data?.message || "Failed to add sale"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Add Sale</Text>

            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 12,
                            alignItems: "center",
                        }}
                    >
                        <Text>
                            {item.name} ({item.priceType})
                        </Text>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity onPress={() => decrease(item._id)}>
                                <Text style={{ fontSize: 20, marginHorizontal: 10 }}>−</Text>
                            </TouchableOpacity>

                            <Text>{cart[item._id] || 0}</Text>

                            <TouchableOpacity onPress={() => increase(item._id)}>
                                <Text style={{ fontSize: 20, marginHorizontal: 10 }}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <Button
                title={loading ? "Submitting..." : "Submit Sale"}
                onPress={submitSale}
                disabled={loading}
            />
        </View>
    );
}
