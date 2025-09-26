import { View, Text } from "react-native";

export default function Map() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 16, textAlign: "center" }}>
        La carte n’est pas disponible sur le web avec react-native-maps.
        Utilise l’application mobile via Expo Go pour la visualiser.
      </Text>
    </View>
  );
}
