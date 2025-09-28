import { TouchableOpacity, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function Card({ brand, address, prices, id }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/station?id=${id}`)}
      style={{
        padding: 12,
        marginBottom: 12,
        backgroundColor: "#f3f4f6",
        borderRadius: 8,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{brand}</Text>
      <Text style={{ marginBottom: 4 }}>{address}</Text>
      <Text>Diesel: {prices.diesel ?? "N/A"} €</Text>
      <Text>SP95: {prices.sp95 ?? "N/A"} €</Text>
      <Text>SP98: {prices.sp98 ?? "N/A"} €</Text>
    </TouchableOpacity>
  );
}
