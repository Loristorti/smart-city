import { ImageBackground, Text, View, StyleSheet } from "react-native";

export default function Welcome() {
  return (
    <ImageBackground
      source={require("../assets/welcome.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
 
});
