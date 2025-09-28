import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";


export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo + Tagline */}
      <View style={styles.center}>
        {/* Replace with your actual logo if you have one */}
        <Text style={styles.logo}>⛽</Text>
        <Text style={styles.title}>SMART FUEL</Text>
        <Text style={styles.subtitle}>SMARTER CHOICES</Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/map")}>
        <Text style={styles.buttonText}>Voir la carte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 60,
  },
  center: {
    alignItems: "center",
    marginTop: 120,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2563eb",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    letterSpacing: 1,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
