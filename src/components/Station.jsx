import { useStations } from "../hooks/useStations";

export default function StationList() {
  const { stations, loading } = useStations();

  if (loading) return <p>Chargement des stations...</p>;

  return (
    <div className="p-4">
      {stations.map((s) => (
        <div key={s.id} className="flex items-center border-b py-2">
          <img
            src={`/logos/${s.name.toLowerCase()}.png`}
            alt={s.name}
            className="w-10 h-10 mr-3"
          />
          <div>
            <h3 className="font-bold">{s.name}</h3>
            <p className="text-sm text-gray-600">
              {s.address}, {s.city}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
