import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MessagesPage from './pages/MessagesPage';

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar is included */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/messages" element={<MessagesPage />} /> {/* Ensure this route is defined */}
      </Routes>
    </Router>
  );
};

export default App;