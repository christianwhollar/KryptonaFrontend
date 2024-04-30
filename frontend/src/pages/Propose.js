import React, { useState } from 'react';
import { ethers } from 'ethers';

import './Propose.css';

import kryptonaDAOAbi from '../contracts/daokryptona.json'; // Path to the contract ABI
import kryptonaDAOContractAddress from '../contracts/daokryptona-contract-address.json'; // Path to the contract address

import proposalKryptonaMemberAbi from '../contracts/proposalkryptonamember.json'; // Path to the contract ABI
import proposalKryptonaMemberContractAddress from '../contracts/proposalkryptonamember-contract-address.json'; // Path to the contract address

import { useWallet } from '../WalletContext';


const Propose = () => {
  const { walletAddress } = useWallet();
  const [walletConnected, setWalletConnected] = useState(false);

  const [kryptonaDAOContract, setKryptonaDAOContract] = useState(null);
  const [proposalKryptonaMemberContract, setProposalKrytonaMemberContract] = useState(false);

  const [kryptonaDAOContractFetched, setKryptonaDAOContractFetched] = useState(false);
  const [proposalKrytonaMemberContractFetched, setProposalKrytonaMemberContractFetched] = useState(false);

  const [proposalKryptonaMemberProposalCreated, setKryptonaMemberProposalCreated] = useState(false);

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
      setWalletConnected(true);
      console.log('Contract Fetched')
    } else {
      console.error('Wallet not connected');
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

  const createProposalKryptonaMember = async () => {
    if (proposalKryptonaMemberContract && walletAddress) {
      console.log('Voting on proposal...')
      let proposalKryptonaNewMemberAddress = '0xBcd4042DE499D14e55001CcbB24a551F3b954096'
      try {
        console.log(proposalKryptonaMemberContractAddress.proposalkryptonamember)
        await proposalKryptonaMemberContract.createMemberProposal(proposalKryptonaNewMemberAddress, 0);
        await kryptonaDAOContract.setProposalContract(proposalKryptonaMemberContractAddress.proposalkryptonamember, "Kryptona Member Proposal");
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

  const getActiveProposalType = async () => {
    if (kryptonaDAOContract && walletAddress) {
      console.log('Getting proposal type...')
      try {
        const proposalIndex = await kryptonaDAOContract.getProposalIndex();
        const proposalType = await kryptonaDAOContract.getProposalType(proposalIndex - 1);
        console.log('Proposal type fetched:', proposalType);
      } catch (error) {
        console.error('Error getting proposal type:', error);
      }
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!kryptonaDAOContract) {
      console.error('Kryptona DAO contract not fetched');
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

  const getProposalVotes = async () => {
    if (proposalKryptonaMemberContract && walletAddress) {
      console.log('Getting proposal votes...')
      try {
        const proposalId = await proposalKryptonaMemberContract.nextProposalId();
        const votes = await proposalKryptonaMemberContract.getVoteCount(proposalId - 1);
        const yesVotes = (votes[0] / 10**18).toString();
        const noVotes = (votes[1] / 10**18).toString();
        console.log('Yes votes:', yesVotes);
        console.log('No votes:', noVotes);
      } catch (error) {
        console.error('Error getting proposal votes:', error);
      }
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!proposalKryptonaMemberContract) {
      console.error('Kryptona Member Proposal contract not fetched');
    }
  }

  // const getProposalKryptonaTreasuryContract = async () => {
  // }
    

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 className='propose-subtitle'>Create a New Proposal</h2>
      <p>
        { proposalKryptonaMemberContractAddress.proposalkryptonamember }
      </p>
      <button onClick={getProposalKryptonaMemberContract}>
        Get Kryptona Member Contract
      </button>
      <button onClick={getKryptonaDAOContract}>
        Get Kryptona DAO Contract
      </button>
      <button onClick={createProposalKryptonaMember}>
        Create Kryptona Member Proposal
      </button>
      <button onClick={getActiveProposalType}>
        Get Proposal Type
      </button>
      <button onClick={() => voteProposalKryptonaMember(true)}>
        Vote Yes
      </button>
      <button onClick={() => voteProposalKryptonaMember(false)}>
        Vote No
      </button>
      <button onClick={() => getProposalVotes()}>
        Get Proposal Votes
      </button>
      <div>

    </div>
    </div>
  );
};

export default Propose;