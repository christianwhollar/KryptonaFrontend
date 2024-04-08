import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dapp } from "./components/Dapp";
import Help from "./pages/Help";
import Apply from "./pages/Apply";
import Vote from "./pages/Vote";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

const Banner = ({ walletAddress, handleConnectWallet }) => {
  const displayAddress = walletAddress 
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-3)}` 
    : 'Connect Wallet';

  return (
    <div className="banner">
      <img src="/logo.png" alt="Logo" className="logo" />
      <span className="title">Kryptona</span>
      <div className="nav-links">
      <a href="/">Home</a>
      <a href="/apply">Apply</a>
      <a href="/vote">Vote</a>
      <a href="/help">Help</a>
      </div>
      <button onClick={handleConnectWallet} className="wallet-button">
        {walletAddress ? `Wallet Connected: ${displayAddress}` : 'Connect Wallet'}
      </button>
    </div>
  );
};

const App = () => {
  const [walletAddress, setWalletAddress] = useState(localStorage.getItem('walletAddress'));
  
  const handleConnectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      try {
        await provider.send('eth_requestAccounts', []);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          localStorage.setItem('walletAddress', accounts[0]);
          console.log('Wallet connected! Address:', accounts[0]);
        } else {
          console.error('No accounts found');
        }
      } catch (error) {
        console.error('User rejected connection', error);
      }
    } else {
      console.error('No Ethereum provider found');
    }
  };

  return (
    <Router>
      <Banner walletAddress={walletAddress} handleConnectWallet={handleConnectWallet} />
      <Routes>
        <Route path="/" element={<Dapp />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
};

const root = document.getElementById('root');
createRoot(root).render(<App />);