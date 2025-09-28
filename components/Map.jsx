import { useState, useEffect } from "react";
import { Platform, View, Text, ActivityIndicator } from "react-native";
import MapWeb from "./Map.web";

export default function Map() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [MapNative, setMapNative] = useState(null);

  useEffect(() => {
    if (Platform.OS !== "web") {
      import("./Map.native").then((mod) => setMapNative(() => mod.default));
    }
  }, []);

  useEffect(() => {
    fetch("https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?limit=100")  
    .then((res) => res.json())
      .then((data) => {
        const stationsRaw = data.records || data.results || [];
        const parsedStations = stationsRaw.map((station) => {
          const fields = station.fields || {};
          const lat = fields.latitude || station.geometry?.coordinates?.[1];
          const lon = fields.longitude || station.geometry?.coordinates?.[0];
          return {
            id: station.recordid,
            lat,
            lon,
            name: fields.nom || fields.enseigne || "Station",
            adresse: fields.adresse || "",
            ville: fields.ville || "",
          };
        });
        setStations(parsedStations);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des stations :", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 8, color: "#666" }}>Chargement de la carte...</Text>
      </View>
    );
  }

  if (Platform.OS === "web") {
    return <MapWeb stations={stations} />;
  }

  if (!MapNative) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement du composant natif...</Text>
      </View>
    );
  }

  return <MapNative stations={stations} />;
}
