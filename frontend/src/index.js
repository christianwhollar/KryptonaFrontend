import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Apply from "./pages/Apply";
import Vote from "./pages/Vote";
import Propose from "./pages/Propose";
import Help from "./pages/Help";
import OrchestratorDemoDAO from "./pages/OrchestratorDemoDAO";
import "bootstrap/dist/css/bootstrap.css";
import './App.css';
import { WalletProvider, useWallet } from './WalletContext';
import Banner from './Banner';

const App = () => {
  const { walletAddress, handleConnectWallet } = useWallet();
  return (
    <Router>
      <Banner walletAddress={walletAddress} handleConnectWallet={handleConnectWallet} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/propose" element={<Propose />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/help" element={<Help />} />
        <Route path="/orchestrator-demo-dao" element={<OrchestratorDemoDAO />} />
      </Routes>
    </Router>
  );
};

const root = document.getElementById('root');
createRoot(root).render(
  <WalletProvider>
    <App />
  </WalletProvider>
);