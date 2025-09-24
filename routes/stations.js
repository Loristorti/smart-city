const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();


const API_URL = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?limit=20";


router.get('/', async (req, res) => {

  const response = await fetch(API_URL);
  const data = await response.json();


  const stations = data.results.map(station => {

    const lat = parseFloat(station.latitude) / 100000;
    const lon = parseFloat(station.longitude) / 100000;


    const nom = `${station.adresse}, ${station.ville}`;


    let prixSP95 = "non disponible";
    let prixGazole = "non disponible";

    const prixArray = JSON.parse(station.prix);
    prixArray.forEach(p => {
      if (p["@nom"] === "SP95") prixSP95 = p["@valeur"];
      if (p["@nom"] === "Gazole") prixGazole = p["@valeur"];
    });


    return { nom, lat, lon, prixSP95, prixGazole };
  });

  res.json({ stations });
});

module.exports = router;
