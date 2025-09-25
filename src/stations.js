const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();


const API_URL =
  "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?limit=100";

router.get("/", async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const stationsRaw = data.records || data.results || [];
    console.log("Nombre total de stations récupérées :", stationsRaw.length);

    const stations = stationsRaw.map((station) => {
      const fields = station.fields || station.record?.fields || {};


      let lat = null;
      let lon = null;

      if (station.geom?.lat && station.geom?.lon) {
        lat = station.geom.lat;
        lon = station.geom.lon;
      } else if (station.fields?.geom?.lat && station.fields?.geom?.lon) {
        lat = station.fields.geom.lat;
        lon = station.fields.geom.lon;
      } else if (station.fields?.latitude && station.fields?.longitude) {
        lat = station.fields.latitude;
        lon = station.fields.longitude;
      } else if (station.geometry?.coordinates) {
        lon = station.geometry.coordinates[0];
        lat = station.geometry.coordinates[1];
      } else if (station.record?.geometry?.coordinates) {
        lon = station.record.geometry.coordinates[0];
        lat = station.record.geometry.coordinates[1];
      }


      const prixGazole = fields.gazole_prix ?? "N/A";
      const prixSP95 = fields.sp95_prix ?? "N/A";
      const prixSP98 = fields.sp98_prix ?? "N/A";


      let services = [];
      try {
        if (typeof fields.services === "string") {
          services = JSON.parse(fields.services).service || [];
        } else if (Array.isArray(fields.services)) {
          services = fields.services;
        }
      } catch {
        services = [];
      }


      let horaires = "";
      let ouvert24 = "Non";
      try {
        const horairesObj = JSON.parse(fields.horaires || "{}");
        if (horairesObj["@automate-24-24"] === "1") ouvert24 = "Oui";
        horaires = horairesObj.jour
          ?.map((j) =>
            j.horaire
              ? `${j["@nom"]}: ${j.horaire["@ouverture"]}-${j.horaire["@fermeture"]}`
              : `${j["@nom"]}: fermé`
          )
          .join(", ") || "";
      } catch {
        horaires = "inconnu";
      }

      return {
        id: station.id || station.record?.id,
        cp: fields.cp,
        ville: fields.ville,
        adresse: fields.adresse,
        lat,
        lon,
        prix: { gazole: prixGazole, sp95: prixSP95, sp98: prixSP98 },
        services,
        horaires,
        ouvert24,
      };
    });


    const stationsValides = stations.filter((s) => s.lat && s.lon);
    console.log("Stations avec coordonnées valides :", stationsValides.length);

    res.json({ stations: stationsValides });
  } catch (err) {
    console.error("Erreur API stations :", err);
    res.status(500).json({ error: "Impossible de récupérer les stations" });
  }
});

module.exports = router;
