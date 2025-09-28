import polyline from "@mapbox/polyline";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, Polyline } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 

export default function MapNative() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const mapRef = useRef(null);
  const router = useRouter();

  
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        setLoading(false); 
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } catch (e) {
        console.error("Could not get location:", e);
        Alert.alert("Location Error", "Could not retrieve your current location.");
      }
    })();
  }, []);


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

            const brandIndex = parseInt(station.recordid, 36) % mockBrands.length;
            const brand = station.enseigne || station.nom || mockBrands[brandIndex];

            return {
              id: station.recordid,
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

  
  async function fetchRoute(station) {
    if (!location) {
      Alert.alert("Wait", "Your location isn’t ready yet");
      return;
    }
    
   
    setRouteCoords([]); 

    try {
      const start = `${location.longitude},${location.latitude}`;
      const end = `${station.lon},${station.lat}`;
      const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=polyline`;

      const res = await fetch(url);
      const data = await res.json();
      
      
      if (!data.routes || data.routes.length === 0) {
        Alert.alert(
          "Route Not Found",
          "Could not find a driving route to this station. The destination may be too far or unreachable."
        );
        return;
      }

      const encoded = data.routes[0].geometry;
      const points = polyline.decode(encoded);
      const coords = points.map(([lat, lon]) => ({ latitude: lat, longitude: lon }));
      setRouteCoords(coords);

      
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(coords, {
          edgePadding: { top: 80, right: 40, bottom: 160, left: 40 },
          animated: true,
        });
      }
    } catch (err) {
      console.error("Route error:", err);
      Alert.alert("Routing Error", "An error occurred while fetching the route.");
    }
  }

 
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
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true} 
        initialRegion={{
          latitude: location?.latitude || 48.8566,
          longitude: location?.longitude || 2.3522,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
      
        {stations.map((s) => (
          <Marker 
            key={s.id} 
            coordinate={{ latitude: s.lat, longitude: s.lon }}
          >
           
            <View style={styles.customMarker}>
              <MaterialCommunityIcons name="gas-station" size={20} color="white" />
            </View>
            
            <Callout> 
              <View style={styles.calloutContent}>
                <Text style={{ fontWeight: "bold" }}>{s.name}</Text>
                <Text>{s.adresse}, {s.ville}</Text>
                
             
                <View style={{ marginTop: 5, marginBottom: 5 }}>
                    <Button 
                        title="Détails" 
                        onPress={() => router.push(`/station?id=${s.id}`)} 
                        color="#4F46E5" 
                    />
                </View>

                
                <Button 
                    title="Itinéraire" 
                    onPress={() => fetchRoute(s)} 
                    color="#2563eb"
                />
              </View>
            </Callout>
          </Marker>
        ))}

      
        {routeCoords.length > 0 && (
          <Polyline 
            coordinates={routeCoords} 
            strokeWidth={5} 
            strokeColor="#1E90FF" 
          />
        )}
      </MapView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  map: { width: "100%", height: "100%" },
  calloutContent: { 
    width: 200, 
    padding: 5 
  },
  
  customMarker: {
    backgroundColor: '#3b82f6', 
    padding: 8,
    borderRadius: 20, 
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
});