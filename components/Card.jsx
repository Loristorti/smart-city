// src/components/Card.jsx
import { View, Text } from "react-native";

export default function Card({ brand, address, prices }) {
  return (
    <View className="bg-white shadow rounded-lg p-4 mb-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">{brand}</Text>
        <Text className="text-sm text-gray-500">{address}</Text>
      </View>

      {/* Prices */}
      <View className="flex-col gap-1">
        <Text>
          Diesel: <Text className="font-medium">{prices.diesel ?? "N/A"} €</Text>
        </Text>
        <Text>
          SP95: <Text className="font-medium">{prices.sp95 ?? "N/A"} €</Text>
        </Text>
        <Text>
          SP98: <Text className="font-medium">{prices.sp98 ?? "N/A"} €</Text>
        </Text>
      </View>
    </View>
  );
}
