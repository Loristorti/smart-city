import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";

export default function StationDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || id === "undefined") {
      setLoading(false);
      return;
    }

    const url = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?refine=id:"${id}"&limit=1`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const raw = data.results?.[0] || {};
        const f = raw.fields || raw;

        
        let brand =
          f.enseigne ||
          f.nom ||
          f.marque ||
          f.nom_station ||
          f.ville ||
          f.adresse ||
          "Station";

        
        let address = "";
        if (f.adresse && f.ville) address = `${f.adresse}, ${f.ville}`;
        else if (f.adresse) address = f.adresse;
        else if (f.ville) address = f.ville;
        else address = "Adresse inconnue";

        
        const pricesMap = {};

        try {
          let parsedPrices = [];
          if (Array.isArray(f.prix)) {
            parsedPrices = f.prix;
          } else if (typeof f.prix === "string" && f.prix.trim().length) {
            parsedPrices = JSON.parse(f.prix);
          }

          parsedPrices.forEach((p) => {
            const name = p["@nom"] || p.nom;
            const value = p["@valeur"] || p.valeur;
            if (name) pricesMap[name] = value;
          });
        } catch (e) {}

        
        pricesMap["Gazole"] = pricesMap["Gazole"] ?? f.gazole_prix ?? null;
        pricesMap["SP95"] = pricesMap["SP95"] ?? f.sp95_prix ?? null;
        pricesMap["SP98"] = pricesMap["SP98"] ?? f.sp98_prix ?? null;
        pricesMap["E10"] = pricesMap["E10"] ?? f.e10_prix ?? null;
        pricesMap["E85"] = pricesMap["E85"] ?? f.e85_prix ?? null;
        pricesMap["GPLc"] = pricesMap["GPLc"] ?? f.gplc_prix ?? null;

        
        const ruptures = new Set();
        try {
          if (Array.isArray(f.rupture)) {
            f.rupture.forEach((r) => ruptures.add(r["@nom"]));
          } else if (typeof f.rupture === "string" && f.rupture.trim().length) {
            const parsed = JSON.parse(f.rupture);
            parsed.forEach((r) => ruptures.add(r["@nom"]));
          }
          if (f.carburants_rupture_definitive) {
            f.carburants_rupture_definitive.split(";").forEach((r) => ruptures.add(r.trim()));
          }
          if (f.carburants_rupture_temporaire) {
            f.carburants_rupture_temporaire.split(";").forEach((r) => ruptures.add(r.trim()));
          }
        } catch (e) {}

        setStation({ brand, address, prices: pricesMap, ruptures });
      })
      .catch((err) => {
        console.error("Details fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#2563eb" />;
  if (!station)
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text style={{ textAlign: "center" }}>Station introuvable.</Text>
      </View>
    );

  const fuels = ["Gazole", "SP95", "SP98", "E10", "E85", "GPLc"];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{station.brand}</Text>
      <Text style={{ fontSize: 16, marginBottom: 16 }}>{station.address}</Text>

      {fuels.map((fuel) => {
        const value = station.prices[fuel];
        const isRupture = station.ruptures?.has(fuel);

        return (
          <Text key={fuel}>
            {fuel} :{" "}
            {isRupture
              ? "En rupture"
              : value
              ? `${value} €`
              : "Non disponible"}
          </Text>
        );
      })}

      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: "#075F0F",
          padding: 12,
          borderRadius: 8,
        }}
        onPress={() => router.push("/map")}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Retour à la carte</Text>
      </TouchableOpacity>
    </View>
  );
}
