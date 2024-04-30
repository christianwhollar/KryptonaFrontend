import React from 'react';
import { useWallet } from './WalletContext';

const Banner = () => {
    const { walletAddress, handleConnectWallet, handleDisconnectWallet } = useWallet();
    const displayAddress = walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-3)}` : 'Connect Wallet';

    const handleClick = () => {
        if (walletAddress) {
            handleDisconnectWallet();
        } else {
            handleConnectWallet();
        }
    };

    return (
        <div className="banner">
            <img src="/logo.png" alt="Logo" className="logo" />
            <span className="title">Kryptona</span>
            <div className="nav-links">
                <a href="/">Home</a>
                <a href="/apply">Apply</a>
                <a href="/vote">Vote</a>
                <a href="/propose">Propose</a>
                <a href="/explore">Explore</a>
                <a href="/help">Help</a>
            </div>
            <button onClick={handleClick} className="wallet-button">
                {walletAddress ? `Wallet Connected: ${displayAddress}` : 'Connect Wallet'}
            </button>
        </div>
    );
};

export default Banner;