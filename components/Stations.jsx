
import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import { useStations } from "../hooks/useStations";

export default function Station() {
  const { stations, loading, error } = useStations();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-2 text-gray-600">Loading stations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  const renderStation = ({ item }) => (
    <View className="flex-row items-center p-4 bg-white rounded-2xl shadow mb-4">
      
      <Image
        source={{ uri: item.logo }}
        className="w-12 h-12 mr-4 rounded-full"
        resizeMode="contain"
      />
     
      <View>
        <Text className="font-semibold text-lg">{item.name}</Text>
        <Text className="text-sm text-gray-600">
          {item.ville} – {item.adresse}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={stations}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderStation}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}
