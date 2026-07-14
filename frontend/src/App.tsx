import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import VerifyPage from './pages/VerifyPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import { PREPROD_CONTRACT_ADDRESS } from './config';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>
            ScholarShield · Built on <a href="https://midnight.network" target="_blank" rel="noreferrer" className="text-accent">Midnight Network</a> · Zero-Knowledge Privacy
          </p>
          <p className="footer-contract mt-sm">
            Contract: <code>{PREPROD_CONTRACT_ADDRESS}</code>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export function AppWithProviders() {
  return (
    <WalletProvider>
      <App />
    </WalletProvider>
  );
}
