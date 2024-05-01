import React, { useState } from 'react';
import { ethers } from 'ethers';

import kryptonaAbi from '../contracts/kryptona.json'; // Path to the contract ABI
import kryptonaContractAddress from '../contracts/kryptona-contract-address.json'; // Path to the contract address

import kryptonaDAOAbi from '../contracts/daokryptona.json'; // Path to the contract ABI
import kryptonaDAOContractAddress from '../contracts/daokryptona-contract-address.json'; // Path to the contract address

import proposalKryptonaMemberAbi from '../contracts/proposalkryptonamember.json'; // Path to the contract ABI
import proposalKryptonaMemberContractAddress from '../contracts/proposalkryptonamember-contract-address.json'; // Path to the contract address

import { useWallet } from '../WalletContext';
import './Help.css';

const Help = () => {
  const { walletAddress } = useWallet();
  const [walletConnected, setWalletConnected] = useState(false);

  const [kryptonaContract, setKryptonaContract] = useState(null);
  const [kryptonaDAOContract, setKryptonaDAOContract] = useState(null);
  const [proposalKryptonaMemberContract, setProposalKrytonaMemberContract] = useState(false);

  const [kryptonaContractFetched, setKryptonaContractFetched] = useState(false);
  const [kryptonaDAOContractFetched, setKryptonaDAOContractFetched] = useState(false);
  const [proposalKrytonaMemberContractFetched, setProposalKrytonaMemberContractFetched] = useState(false);

  const [tokenDataFetched, setTokenDataFetched] = useState(false);
  const [tokenData, setTokenData] = useState({ name: '', symbol: '' });

  const [balanceFetched, setBalanceFetched] = useState(false);
  const [kryptonaBalance, setKryptonaBalance] = useState(null);

  const [statusElevated, setStatusElevated] = useState(false);
  const [memberStatus, setKryptonaMemberStatus] = useState(false);

  const [proposalKryptonaNewMemberAddress, setPropoosalKryptonaNewMemberAddress] = useState(' Enter the address of the wallet to be added to the Kryptona DAO.');
  const [newAddressSet, setNewAddressSet] = useState(false);

  const handleNewMemberInputAddressChange = (event) => {
    setPropoosalKryptonaNewMemberAddress(event.target.value);
    setNewAddressSet(true);
  };

  const [proposalKryptonaMemberExecuted, setProposalKryptonaMemberExecuted] = useState(false);

  const [proposalKryptonaMemberProposalCreated, setKryptonaMemberProposalCreated] = useState(false);
  
  const getKryptonaContract = async () => {
    if (walletAddress) {
    console.log('Fetching contract...')
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      kryptonaContractAddress.kryptona,
      kryptonaAbi.abi,
      provider.getSigner(0)
    );
    setKryptonaContract(contract);
    setWalletConnected(true);
    setKryptonaContractFetched(true);
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
      console.error('Kryptona contract not fetched');
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
      console.error('Kryptona contract not fetched');
    }
  };

  const getKryptonaDAOContract = async () => {
    if (walletAddress) {
      console.log('Fetching contract...')
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        kryptonaDAOContractAddress.daokryptona,
        kryptonaDAOAbi.abi,
        provider.getSigner(0)
      );
      setKryptonaDAOContract(contract);
      setKryptonaDAOContractFetched(true);
      console.log('Contract Fetched')
  } else {
    console.error('Wallet not connected');
  }
  };

  const elevateStatusToMember = async () => {
    if (kryptonaDAOContract && walletAddress) {
      try {
        console.log('Elevating status...')
        const memberStatusInitial = await kryptonaDAOContract.checkMembership(walletAddress);
        if (memberStatusInitial === true) {
          console.log('Address is already a member');
          setKryptonaMemberStatus(memberStatusInitial.toString());
          setStatusElevated(true);
        } else {
          try {
            await kryptonaDAOContract.adminAddMember(walletAddress);
          } catch (error) {
            console.log('Error elevating member:', error);
          }
          const memberStatusFinal = await kryptonaDAOContract.checkMembership(walletAddress);
          setKryptonaMemberStatus(memberStatusFinal.toString());
          setStatusElevated(true);
          console.log('Status Elevated');
        }
      } catch (error) {
        console.error('Error elevating member:', error);
      }
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!kryptonaDAOContract) {
      console.error('Kryptona DAO contract not fetched');
    }
  }

  const getProposalKryptonaMemberContract = async () => {
    if (walletAddress) {
      console.log('Fetching contract...')
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        proposalKryptonaMemberContractAddress.proposalkryptonamember,
        proposalKryptonaMemberAbi.abi,
        provider.getSigner(0)
      );
      setProposalKrytonaMemberContract(contract);
      setProposalKrytonaMemberContractFetched(true);
      console.log('Contract Fetched')
  } else {
    console.error('Wallet not connected');
  }
  };

  const createProposalKryptonaMember = async () => {
    if (proposalKryptonaMemberContract && walletAddress) {
      console.log('Voting on proposal...')
      try {
        await proposalKryptonaMemberContract.createMemberProposal(proposalKryptonaNewMemberAddress, 0);
        setKryptonaMemberProposalCreated(true);
        console.log('Member Proposal Created');
      } catch (error) {
        console.error('Error creating member proposal:', error);
      }
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!proposalKryptonaMemberContract) {
      console.error('Kryptona Member Proposal contract not fetched');
    }
  };

  const voteProposalKryptonaMember = async (voteBoolean) => {
    if (proposalKryptonaMemberContract && walletAddress) {
      console.log('Voting on proposal...')
      try {
        const proposalId = await proposalKryptonaMemberContract.nextProposalId();
        await proposalKryptonaMemberContract.vote(proposalId, voteBoolean);
        console.log('Proposal Voted');
      } catch (error) {
        console.error('Error voting on proposal:', error);
      }
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!proposalKryptonaMemberContract) {
      console.error('Kryptona Member Proposal contract not fetched');
    }
  };

  const executeProposalKryptonaMember = async () => {
    if (proposalKryptonaMemberContract && walletAddress) {
      console.log('Executing proposal...')
      try {
        const proposalId = await proposalKryptonaMemberContract.nextProposalId() ;
        await proposalKryptonaMemberContract.connect(walletAddress).executeProposal(proposalId);
        setProposalKryptonaMemberExecuted(true);
        console.log('Proposal Executed');
      } catch (error) {
        console.error('Error executing on proposal:', error);
      }
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!proposalKryptonaMemberContract) {
      console.error('Kryptona Member Proposal contract not fetched');
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
        {kryptonaContractFetched ? (
          <span className="help-checkmark">✔️</span>
        ) : (
          <span className="help-cross">❌</span>
        )}
        <p
          className="help-paragraph"
          onClick={() => navigator.clipboard.writeText(kryptonaContractAddress.kryptona)}
        >
          Contract Address: {kryptonaContractAddress.kryptona}
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
    <div className="help-button-container">
        <button className="help-button" onClick={getKryptonaDAOContract}>
          Fetch Kryptona DAO Contract
        </button>
        {kryptonaDAOContractFetched ? (
          <span className="help-checkmark">✔️</span>
        ) : (
          <span className="help-cross">❌</span>
        )}
        <p
          className="help-paragraph"
          onClick={() => navigator.clipboard.writeText(kryptonaDAOContractAddress.daokryptona)}
        >
          Contract Address: {kryptonaDAOContractAddress.daokryptona}
        </p>
      </div>
      <div className="help-button-container">
        <button className="help-button" onClick={elevateStatusToMember}>
          Elevate Status to Member
        </button>
        {statusElevated ? (
          <span className="help-checkmark">✔️</span>
        ) : (
          <span className="help-cross">❌</span>
        )}
        <p className="help-paragraph">
          {memberStatus === 'false' ? 'Awaiting Status Elevation' : memberStatus === 'true' ? 'Status Elevated' : 'Error Elevating Status'}
        </p>
      </div>
    </div>
  </div>
  );
};

export default Help;