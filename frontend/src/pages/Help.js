import React, { useState } from 'react';
import { ethers } from 'ethers';
import kryptonaAbi from '../contracts/Kryptona.json'; // Path to the contract ABI
import contractAddress from '../contracts/kryptona-contract-address.json'; // Path to the contract address
import { useWallet } from '../WalletContext';
import './Help.css';

const Help = () => {
  const { walletAddress } = useWallet();
  const [kryptonaContract, setKryptonaContract] = useState(null);
  const [tokenData, setTokenData] = useState({ name: '', symbol: '' });
  const [kryptonaBalance, setKryptonaBalance] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [contractFetched, setContractFetched] = useState(false);
  const [tokenDataFetched, setTokenDataFetched] = useState(false);
  const [balanceFetched, setBalanceFetched] = useState(false);

  const getKryptonaContract = async () => {
    if (walletAddress) {
    console.log('Fetching contract...')
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress.Kryptona,
      kryptonaAbi.abi,
      provider.getSigner(0)
    );
    setKryptonaContract(contract);
    setWalletConnected(true);
    setContractFetched(true);
    console.log('Contract Fetched')
  } else {
    console.error('Wallet not connected');
  }
  };

  const getKryptonaTokenData = async () => {
    console.log('Getting token data...');
    if (kryptonaContract && walletConnected) {
      try {
        const name = await kryptonaContract.name.call();
        const symbol = await kryptonaContract.symbol.call();
        setTokenData({ name, symbol });
        setTokenDataFetched(true);
        console.log('Kryptona Token Data Retrieved');
      } catch (error) {
        console.error('Error getting token data:', error);
      }
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!kryptonaContract) {
      console.error('Kryptona contract not created');
    }
  };

  const getKryptonaTokenBalance = async () => {
    console.log('Getting token balance...');
    if (kryptonaContract && walletConnected) {
      try {
        console.log(walletAddress)
        const balance = await kryptonaContract.balanceOf(walletAddress) / 10**18;
        setKryptonaBalance(balance.toString());
        setBalanceFetched(true);
        console.log('Token Balanced Retrieved');
      } catch (error) {
        console.error('Error getting token balance:', error);
      }
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!kryptonaContract) {
      console.error('Kryptona contract not created');
    }
  };

  return (
  <div className="help-container">
    <h2 className="help-subtitle">Kryptona Token</h2>
    <div className="help-content">
      <div className="help-button-container">
        <button className="help-button" onClick={getKryptonaContract}>
          Fetch Kryptona Contract
        </button>
        {contractFetched ? (
          <span className="help-checkmark">✔️</span>
        ) : (
          <span className="help-cross">❌</span>
        )}
        <p
          className="help-paragraph"
          onClick={() => navigator.clipboard.writeText(contractAddress.Kryptona)}
        >
          Contract Address: {contractAddress.Kryptona}
        </p>
      </div>
      <div className="help-button-container">
        <button className="help-button" onClick={getKryptonaTokenData}>
          Get Token Data
        </button>
        {tokenDataFetched ? (
          <span className="help-checkmark">✔️</span>
        ) : (
          <span className="help-cross">❌</span>
        )}
        <p className="help-paragraph">
          {tokenData.name && tokenData.symbol ? `Name: ${tokenData.name} Symbol: ${tokenData.symbol}` : 'Awaiting Token Data Retrieval'}
        </p>
      </div>
      <div className="help-button-container">
        <button className="help-button" onClick={getKryptonaTokenBalance}>
          Get Token Balance
        </button>
        {balanceFetched ? (
          <span className="help-checkmark">✔️</span>
        ) : (
          <span className="help-cross">❌</span>
        )}
        <p className="help-paragraph">
          {kryptonaBalance === null ? 'Awaiting Balance Retrieval' : kryptonaBalance === '0' ? "Balance is 0. Kryptona Faucet 'npx hardhat --network localhost faucet'" : `Balance: ${kryptonaBalance} Kryptona`}
        </p>
      </div>
    </div>
    <h2 className="help-subtitle">Kryptona DAO</h2>
    <div className='help-content'>
      <div className='help-button-container'>
        <button className='help-button'>Fetch DAO Contract</button>
      </div>
      <div className='help-button-container'>
        <button className='help-button'>Elevate Status to Member</button>
      </div>
    </div>
  </div>
  );
};

export default Help;