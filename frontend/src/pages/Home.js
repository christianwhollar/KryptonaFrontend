import React from 'react';
import { useWallet } from '../WalletContext';

const Home = () => {
    const { walletAddress, provider, handleConnectWallet, handleDisconnectWallet } = useWallet();

    return (
        <div>
            <h1>This is the home page.</h1>
            <p>Wallet Address: {walletAddress || 'Not connected'}</p>
        </div>
    );
};

export default Home;