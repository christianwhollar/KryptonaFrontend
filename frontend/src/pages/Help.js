import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import kryptonaAbi from '../contracts/Kryptona.json'; // Path to the contract ABI
import contractAddress from '../contracts/contract-address.json'; // Path to the contract address

const Help = () => {
  const [kryptonaContract, setKryptonaContract] = useState(null);
  const [tokenData, setTokenData] = useState({ name: '', symbol: '' });
  const [walletConnected, setWalletConnected] = useState(false);

  const initializeEthers = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress.Kryptona,
        kryptonaAbi.abi,
        provider.getSigner(0)
      );
      setKryptonaContract(contract);
      setWalletConnected(true);
    }
  };

  useEffect(() => {
    initializeEthers();
  }, []);

  useEffect(() => {
    async function getTokenData() {
      if (kryptonaContract && walletConnected) {
        const name = await kryptonaContract.name();
        const symbol = await kryptonaContract.symbol();
        setTokenData({ name, symbol });
      }
    }

    getTokenData();
  }, [kryptonaContract, walletConnected]);

  return (
    <div>
      <h1>This is Page 1</h1>
      <p>Name: {tokenData.name}</p>
      <p>Symbol: {tokenData.symbol}</p>
    </div>
  );
};

export default Help;