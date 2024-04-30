import React, { useState } from 'react';
import { ethers } from 'ethers';
import './Vote.css';

import kryptonaDAOAbi from '../contracts/daokryptona.json'; // Path to the contract ABI
import kryptonaDAOContractAddress from '../contracts/daokryptona-contract-address.json'; // Path to the contract address

import proposalKryptonaMemberAbi from '../contracts/proposalkryptonamember.json'; // Path to the contract ABI
import proposalKryptonaMemberContractAddress from '../contracts/proposalkryptonamember-contract-address.json'; // Path to the contract address

import { useWallet } from '../WalletContext';

const Vote = () => {
  const { walletAddress } = useWallet();
  const [walletConnected, setWalletConnected] = useState(false);
  const [proposalKrytonaMemberContractFetched, setProposalKrytonaMemberContractFetched] = useState(false);

  const [proposalKryptonaMemberContract, setProposalKrytonaMemberContract] = useState(false);

  const getProposalKryptonaMemberContract = async () => {
    if (walletAddress) {
      console.log('Fetching Kryptona Member Proposal contract...')
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        proposalKryptonaMemberContractAddress.proposalkryptonamember,
        proposalKryptonaMemberAbi.abi,
        provider.getSigner(0)
      );
      setProposalKrytonaMemberContract(contract);
      setProposalKrytonaMemberContractFetched(true);
      setWalletConnected(true);
      console.log('Contract Fetched')
    } else {
      console.error('Wallet not connected');
    }
  };

  const voteProposalKryptonaMember = async (voteBoolean) => {
    if (proposalKryptonaMemberContract && walletAddress) {
      console.log('Voting on proposal...')
      try {
        const proposalId = await proposalKryptonaMemberContract.nextProposalId();
        await proposalKryptonaMemberContract.vote(proposalId - 1, voteBoolean);
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

  return (
    <div style={{ textAlign: 'center' }}>
    <h2 className='vote-subtitle'>Vote on Proposal</h2>
    <div className='vote-container'>
      <div className='vote-content'>
      <button className='vote-button' onClick={getProposalKryptonaMemberContract}>Fetch Kryptona Member Proposal Contract</button>
      <button className='vote-button' onClick={() => voteProposalKryptonaMember(true)}>Vote Yes</button>
      <button className='vote-button' onClick={() => voteProposalKryptonaMember(false)}>Vote No</button>
      </div>
    </div>
  </div>
  );
};

export default Vote;