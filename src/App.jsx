// import { useState } from 'react'
import WeatherDashboard from './dashboard.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import './WeatherDashboard.css';
import WeatherDetail from './WeatherDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeatherDashboard />} />
        <Route path="/city/:cityName" element={<WeatherDetail />} />
      </Routes>
    </Router>
  );
}

export default App
