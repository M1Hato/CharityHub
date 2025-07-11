import './App.css'
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';

import AboutPage from './pages/AboutPage';
import DonatePage from './pages/DonatePage';
import AuthPage from './pages/AuthPage';
import CabinetPage from './pages/CabinetPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<DonatePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/cabinet" element={<CabinetPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
