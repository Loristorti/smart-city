import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useStations } from "../hooks/useStations";

export default function MapView() {
  const { stations, loading } = useStations();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY, // in .env
  });

  if (!isLoaded || loading) return <p>Loading map...</p>;

  return (
    <GoogleMap
      zoom={12}
      center={{ lat: 48.8566, lng: 2.3522 }} // Paris default
      mapContainerClassName="w-full h-screen"
    >
      {stations.map((s) =>
        s.lat && s.lon ? (
          <Marker
            key={s.id}
            position={{ lat: s.lat, lng: s.lon }}
            title={`${s.name} - ${s.city}`}
          />
        ) : null
      )}
    </GoogleMap>
  );
}
