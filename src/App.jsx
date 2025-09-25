// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Map from "./components/Map";
import Card from "./components/Card";
import Station from "./components/Station"

function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-gray-200 flex gap-4">
        <Link to="/">Map</Link>
        <Link to="/card">Card</Link>
        <Link to="/Station">Station</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/card" element={<Card />} />
        <Route path="/Station" element={<Station />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
