import { useStations } from '../hooks/useStations';

export default function Station() {
  const { stations, loading, error } = useStations();

  if (loading) return <p>Loading stations...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {stations.map((s) => (
        <li key={s.id}>
          {s.ville} – {s.adresse}
        </li>
      ))}
    </ul>
  );
}
