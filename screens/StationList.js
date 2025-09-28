import { useEffect, useState } from "react";
import { ScrollView, Text, ActivityIndicator } from "react-native";
import Card from "../components/Card";

export default function StationList() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?limit=100")
      .then((res) => res.json())
      .then((data) => {
        const parsed = (data.results || [])
          .map((station) => {
            const mockBrands = ["Total", "Esso", "Shell", "BP"];
            const randomBrand = mockBrands[Math.floor(Math.random() * mockBrands.length)];
            const lat = parseFloat(station.latitude) / 100000;
            const lon = parseFloat(station.longitude) / 100000;
            if (!lat || !lon || isNaN(lat) || isNaN(lon)) return null;

            // Parse the prix field (it's a stringified array)
            let prices = {};
            try {
              const parsedPrices = JSON.parse(station.prix || "[]");
              parsedPrices.forEach((p) => {
                prices[p["@nom"]] = p["@valeur"];
              });
            } catch (e) {
              prices = {};
            }

            return {
              id: station.id,
              brand: station.enseigne || station.nom || randomBrand,
              address: `${station.adresse || ""}, ${station.ville || ""}`,
              prices: {
                diesel: prices["Gazole"] || "N/A",
                sp95: prices["SP95"] || "N/A",
                sp98: prices["SP98"] || "N/A",
              },
            };
          })
          .filter(Boolean);

        setStations(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("List fetch error:", err);
        setStations([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#2563eb" />;
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Stations disponibles
      </Text>
      {stations.map((s) => (
        <Card key={s.id} id={s.id} brand={s.brand} address={s.address} prices={s.prices} />
      ))}
    </ScrollView>
  );
}
