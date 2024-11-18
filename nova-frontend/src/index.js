import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MessagesPage from './pages/MessagesPage';
import CurrentPlayback from './pages/CurrentPlayback';

// Main App rendering
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} /> {/* Route for Landing Page */}
        <Route path="/login" element={<Login />} /> {}
        <Route path="/dashboard" element={<Dashboard />} /> {}
        <Route path="/messages/:room_id" element={<MessagesPage />} /> {/* Ensure this route is defined */}
        <Route path="/station/:stationId" element={<CurrentPlayback />} />
      </Routes>
      <Footer />
    </Router>
  );
}
