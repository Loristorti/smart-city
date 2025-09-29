import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
 
export default function StationDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
 
useEffect(() => {
  if (!id) return;
 
fetch(`https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?where=recordid="${id}"`)
    .then((res) => res.json())
    .then((data) => {
      const f = data.results?.[0] || {};
      const lat = parseFloat(f.latitude) / 100000;
      const lon = parseFloat(f.longitude) / 100000;
 
      let prices = {};
      try {
        const parsedPrices = JSON.parse(f.prix || "[]");
        parsedPrices.forEach((p) => {
          prices[p["@nom"]] = p["@valeur"];
        });
      } catch (e) {
        prices = {};
      }
 
      const mockBrands = ["Total", "Shell", "BP", "Esso"];
      const brandIndex = parseInt(f.recordid || "0", 36) % mockBrands.length;
      const brand = f.enseigne || f.nom || mockBrands[brandIndex];
 
      let address = "";
      if (f.adresse && f.ville) {
        address = `${f.adresse}, ${f.ville}`;
      } else if (f.adresse) {
        address = f.adresse;
      } else if (f.ville) {
        address = f.ville;
      } else {
        address = "Adresse inconnue";
      }
 
      setStation({
        brand,
        address,
        prices: {
          diesel: prices["Gazole"] || "N/A",
          sp95: prices["SP95"] || "N/A",
          sp98: prices["SP98"] || "N/A",
        },
        lat,
        lon,
      });
      setLoading(false);
    })
    .catch((err) => {
      console.error("Details fetch error:", err);
      setLoading(false);
    });
}, [id]);
 
 
 
  if (loading || !station) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#2563eb" />;
  }
 
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{station.brand}</Text>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>{station.address}</Text>
 
      <Text>Diesel: {station.prices.diesel} €</Text>
      <Text>SP95: {station.prices.sp95} €</Text>
      <Text>SP98: {station.prices.sp98} €</Text>
 
      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: "#075F0F",
          padding: 12,
          borderRadius: 8,
        }}
        onPress={() => router.push("/map")}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Itinéraire</Text>
      </TouchableOpacity>
    </View>
  );
}