import './App.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapView } from './MapView';

interface Point {
  lat: number;
  lng: number;
}



function App() {

  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [points, setPoints] = useState<Point[]>([]);

  const fetchPoints = async () => {
    const res = await axios.get<Point[]>('http://localhost:3001/api/points');
    setPoints(res.data);
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:3001/api/points', {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    });
    setLat('');
    setLng('');
    fetchPoints();
  };

  return (
    <>

      <div>
        <h1>HERE Map Marker Demo</h1>
        <form onSubmit={handleSubmit}>
          <input type="number" step="any" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
          <input type="number" step="any" placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} />
          <button type="submit">Add Marker</button>
        </form>
        <MapView markers={points} />
      </div>


    </>
  )
}

export default App
