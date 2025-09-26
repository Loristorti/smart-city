import { StyleSheet, View } from "react-native";
import MapView, { UrlTile } from "react-native-maps";

export default function App() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 46.6031,
          longitude: 1.8883,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,             // occupe tout l’écran
  },
  map: {
    flex: 1,             // occupe tout le container
  },
});
