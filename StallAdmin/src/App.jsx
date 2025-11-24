import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Orders from './components/Orders/Orders';
import Menu from './components/Menu/Menu';
import Navbar from './components/Navbar/Navbar';
import './App.css';

const App = () => {
  const [token, setToken] = useState('');
  const [stallOwner, setStallOwner] = useState(null);
  const navigate = useNavigate();
  const url = "http://localhost:4000";

  useEffect(() => {
    const storedToken = localStorage.getItem('stallOwnerToken');
    const storedStallOwner = localStorage.getItem('stallOwner');
    if (storedToken && storedStallOwner) {
      setToken(storedToken);
      setStallOwner(JSON.parse(storedStallOwner));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('stallOwnerToken');
    localStorage.removeItem('stallOwner');
    setToken('');
    setStallOwner(null);
    navigate('/login');
  };

  return (
    <div className="stall-admin-app">
      {token && <Navbar stallOwner={stallOwner} onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} setStallOwner={setStallOwner} url={url} />} />
        <Route path="/dashboard" element={<Dashboard token={token} stallOwner={stallOwner} url={url} />} />
        <Route path="/orders" element={<Orders token={token} stallOwner={stallOwner} url={url} />} />
        <Route path="/menu" element={<Menu token={token} stallOwner={stallOwner} url={url} />} />
        <Route path="/" element={token ? <Dashboard token={token} stallOwner={stallOwner} url={url} /> : <Login setToken={setToken} setStallOwner={setStallOwner} url={url} />} />
      </Routes>
    </div>
  );
};

export default App;

