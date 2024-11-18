import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Protected from './Protected';
import Dashboard from './Dashboard';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleSetToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <Router>
      <div>
        <h1>Auth System</h1>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setToken={handleSetToken} />} />
          <Route path="/protected" element={token ? <Protected token={token} /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={token ? <Dashboard token={token} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
