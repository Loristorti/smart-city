import React, { useEffect, useState } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function MapNative() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(
      "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?limit=100"
    )
      .then((res) => res.json())
      .then((data) => {
        const mockBrands = ["Total", "Shell", "BP", "Esso"];

        const parsedStations = (data.results || [])
          .map((station) => {
            const latRaw = parseFloat(station.latitude);
            const lonRaw = parseFloat(station.longitude);
            const lat = latRaw / 100000;
            const lon = lonRaw / 100000;

            if (!lat || !lon || isNaN(lat) || isNaN(lon)) return null;

            const brandIndex = parseInt(station.id) % mockBrands.length;
            const brand = station.enseigne || station.nom || mockBrands[brandIndex];

            return {
              id: station.id,
              lat,
              lon,
              name: brand,
              adresse: station.adresse || "",
              ville: station.ville || "",
            };
          })
          .filter(Boolean);

        setStations(parsedStations);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setStations([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 8 }}>Chargement des stations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {stations.map((s) => (
          <Marker
            key={s.id}
            coordinate={{ latitude: s.lat, longitude: s.lon }}
          >
            <Callout onPress={() => router.push(`/station?id=${s.id}`)}>
              <View style={{ width: 200 }}>
                <Text style={{ fontWeight: "bold" }}>{s.name}</Text>
                <Text>{s.adresse}, {s.ville}</Text>
                <Text style={{ color: "#2563eb", marginTop: 4 }}>Voir les détails</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
