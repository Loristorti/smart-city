import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/welcome.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/map")}
      >
        <Text style={styles.buttonText}>Voir la carte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  image: {
    width: 400,
    height: 300,
    marginBottom: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
 
  button: {
    backgroundColor: "#418EA7",
    paddingVertical: 12,
    paddingHorizontal: 90,
    borderRadius: 8,
    marginBottom: 90,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
