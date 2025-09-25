import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";

export default function Map() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  useEffect(() => {
    fetch("/api/stations")
      .then((res) => res.json())
      .then((data) => {
        setStations(data.stations);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stations:", err);
        setLoading(false);
      });
  }, []);

  if (!isLoaded || loading) return <p>Loading map...</p>;

  return (
    <GoogleMap
      zoom={6}
      center={{ lat: 46.6031, lng: 1.8883 }} // Center of France
      mapContainerClassName="w-full h-screen"
    >
      {stations.map((s) =>
        s.lat && s.lon ? (
          <Marker
            key={s.id}
            position={{ lat: s.lat, lng: s.lon }}
            title={`${s.adresse} - ${s.ville}`}
          />
        ) : null
      )}
    </GoogleMap>
  );
}
