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
import { submitSaleSafe } from "../../../services/sync.service";

export default function SalesScreen() {
    // 🔐 SAFE PARAM HANDLING
    const params = useLocalSearchParams();
    const shopId = Array.isArray(params.shopId)
        ? params.shopId[0]
        : params.shopId;

    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);

    // -------------------------------
    // LOAD PRODUCTS
    // -------------------------------
    useEffect(() => {
        getProducts()
            .then(setProducts)
            .catch(() =>
                Alert.alert("Error", "Failed to load products")
            );
    }, []);

    // -------------------------------
    // INCREASE QUANTITY
    // -------------------------------
    const increase = (id: string) => {
        setCart((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }));
    };

    // -------------------------------
    // DECREASE QUANTITY
    // -------------------------------
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

    // -------------------------------
    // SUBMIT SALE (ONLINE + OFFLINE)
    // -------------------------------
    const submitSale = async () => {
        if (!shopId) {
            Alert.alert("Error", "Invalid shop selected");
            return;
        }

        const items = Object.entries(cart).map(
            ([productId, quantity]) => ({
                productId,
                quantity,
            })
        );

        if (items.length === 0) {
            Alert.alert("No items", "Please add products");
            return;
        }

        const payload = {
            shopId,
            saleDate: new Date().toISOString().split("T")[0],
            items,
        };

        try {
            setLoading(true);

            const res = await submitSaleSafe(payload);

            if (res?.offline) {
                Alert.alert(
                    "Saved Offline",
                    "Sale saved locally and will sync automatically"
                );
            } else {
                const total =
                    res?.totalAmount ??
                    res?.data?.totalAmount ??
                    0;

                Alert.alert(
                    "Sale Added ✅",
                    `Total Amount: ₹${total}`
                );
            }

            setCart({});
        } catch (error) {
            Alert.alert("Error", "Sale failed");
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------
    // UI
    // -------------------------------
    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Add Sale
            </Text>

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

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => decrease(item._id)}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        marginHorizontal: 10,
                                    }}
                                >
                                    −
                                </Text>
                            </TouchableOpacity>

                            <Text>{cart[item._id] || 0}</Text>

                            <TouchableOpacity
                                onPress={() => increase(item._id)}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        marginHorizontal: 10,
                                    }}
                                >
                                    +
                                </Text>
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
