import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import './Propose.css';

import kryptonaDAOAbi from '../contracts/daokryptona.json'; // Path to the contract ABI
import kryptonaDAOContractAddress from '../contracts/daokryptona-contract-address.json'; // Path to the contract address

import kryptonaDAOTreasuryAbi from '../contracts/daokryptonatreasury.json'; // Path to the contract ABI
import kryptonaDAOTreasuryContractAddress from '../contracts/daokryptonatreasury-contract-address.json'; // Path to the contract address


import proposalKryptonaMemberAbi from '../contracts/proposalkryptonamember.json'; // Path to the contract ABI
import proposalKryptonaMemberContractAddress from '../contracts/proposalkryptonamember-contract-address.json'; // Path to the contract address

import proposalKryptonaTreasuryAbi from '../contracts/proposalkryptonatreasury.json'; // Path to the contract ABI
import proposalKryptonaTreasuryContractAddress from '../contracts/proposalkryptonatreasury-contract-address.json'; // Path to the contract address

import { useWallet } from '../WalletContext';

const Propose = () => {
  const { walletAddress } = useWallet();
  const [walletConnected, setWalletConnected] = useState(false);

  const [kryptonaDAOContract, setKryptonaDAOContract] = useState(null);
  const [proposalKryptonaMemberContract, setProposalKrytonaMemberContract] = useState(false);
  const [proposalKryptonaTreasuryContract, setProposalKrytonaTreasuryContract] = useState(false);

  const [kryptonaDAOContractFetched, setKryptonaDAOContractFetched] = useState(false);
  const [proposalKrytonaMemberContractFetched, setProposalKrytonaMemberContractFetched] = useState(false);
  const [proposalKrytonaTreasuryContractFetched, setProposalKrytonaTreasuryContractFetched] = useState(false);

  const [proposalKryptonaMemberProposalCreated, setKryptonaMemberProposalCreated] = useState(false);

  const [proposalKryptonaNewMemberAddress, setPropoosalKryptonaNewMemberAddress] = useState(localStorage.getItem('newMemberAddress') || ' Enter the address of the wallet to be added to the Kryptona DAO.');
  const [proposalKryptonaWithdrawalReceiverAddress, setProposalKryptonaWithdrawalReceiverAddress] = useState(localStorage.getItem('receiverAddress') || ' Enter receiver address.');
  const [proposalKryptonaWithdrawalAmount, setProposalKryptonaWithdrawalAmount] = useState(localStorage.getItem('proposalKryptonaWithdrawalAmount') || ' Enter withdrawal amount.');

  const [newAddressSet, setNewAddressSet] = useState(false);
  const [proposalKryptonaNewMemberExecuted, setProposalKryptonaNewMember] = useState(false);
  const [proposalKryptonaNewMemberSummary, setKryptonaNewMemberSummary] = useState('Press Button to Get Kryptona Member Proposal Vote Summary');
  const [proposalKryptonaWithdrawalSummary, setKryptonaWithdrawalSummary] = useState('Press Button to Get Kryptona Withdrawal Proposal Vote Summary');

  const [proposalKryptonaReceivedBalance, setProposalKryptonaReceivedBalance] = useState('Press Button to Check Balance');
  const [proposalKryptonaTreasuryBalance, setProposalKryptonaTreasuryBalance] = useState('Press Button to Check Balance');

  useEffect(() => {
    localStorage.setItem('receiverAddress', proposalKryptonaWithdrawalReceiverAddress);
  }, [proposalKryptonaWithdrawalReceiverAddress]);

  useEffect(() => {
    localStorage.setItem('proposalKryptonaWithdrawalAmount', proposalKryptonaWithdrawalAmount);
  }, [proposalKryptonaWithdrawalAmount]);

  useEffect(() => {
    localStorage.setItem('newMemberAddress', proposalKryptonaNewMemberAddress);
  }, [proposalKryptonaNewMemberAddress]);

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

  const getProposalKryptonaTreasuryContract = async () => {
    if (walletAddress) {
      console.log('Fetching Kryptona Treasury Proposal contract...')
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        proposalKryptonaTreasuryContractAddress.proposalkryptonatreasury,
        proposalKryptonaTreasuryAbi.abi,
        provider.getSigner(0)
      );
      setProposalKrytonaTreasuryContract(contract);
      setProposalKrytonaTreasuryContractFetched(true);
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
      // 0xBcd4042DE499D14e55001CcbB24a551F3b954096
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

  const createProposalKryptonaTreasury = async () => {
    if (proposalKryptonaTreasuryContract && walletAddress) {
      console.log('Creating Kryptona Withdrawal Proposal...')
      try {
        console.log(proposalKryptonaTreasuryContractAddress.proposalkryptonatreasury)
        const amountToSend = ethers.utils.parseUnits(proposalKryptonaWithdrawalAmount.toString(), "ether");
        await proposalKryptonaTreasuryContract.createTreasuryProposal(proposalKryptonaWithdrawalReceiverAddress, amountToSend, "Description of Proposal");
        await kryptonaDAOContract.setProposalContract(proposalKryptonaTreasuryContractAddress.proposalkryptonatreasury, "Kryptona Withdrawal Proposal");
        console.log('Withdrawal Proposal Created');
      } catch (error) {
        console.error('Error creating withdrawal proposal:', error);
      }
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!proposalKryptonaTreasuryContract) {
      console.error('Kryptona Treasury Proposal contract not fetched');
    }
  }

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

  const getMemberProposalVotes = async () => {
    if (proposalKryptonaMemberContract && walletAddress) {
      console.log('Getting proposal votes...')
      try {
        const proposalId = await proposalKryptonaMemberContract.nextProposalId();
        const votes = await proposalKryptonaMemberContract.getVoteCount(proposalId - 1);
        const yesVotes = (votes[0] / 10**18).toString();
        const noVotes = (votes[1] / 10**18).toString();
        console.log('Yes votes:', yesVotes);
        console.log('No votes:', noVotes);
        setKryptonaNewMemberSummary(`Yes Votes: ${yesVotes} No Votes: ${noVotes}`);
      } catch (error) {
        console.error('Error getting proposal votes:', error);
      }
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!proposalKryptonaMemberContract) {
      console.error('Kryptona Member Proposal contract not fetched');
    }
  }

  const getWithdrawalProposalVotes = async () => {
    if (proposalKryptonaTreasuryContract && walletAddress) {
      console.log('Getting proposal votes...')
      try {
        const proposalId = await proposalKryptonaTreasuryContract.nextProposalId();
        const votes = await proposalKryptonaTreasuryContract.getVoteCount(proposalId - 1);
        const yesVotes = (votes[0] / 10**18).toString();
        const noVotes = (votes[1] / 10**18).toString();
        console.log('Yes votes:', yesVotes);
        console.log('No votes:', noVotes);
        setKryptonaWithdrawalSummary(`Yes Votes: ${yesVotes} No Votes: ${noVotes}`);
      } catch (error) {
        console.error('Error getting proposal votes:', error);
      }
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!proposalKryptonaTreasuryContract) {
      console.error('Kryptona Withdrawal Proposal contract not fetched');
    }
  }

  const executeMemberProposal = async () => {
    if (proposalKryptonaMemberContract && walletAddress) {
      console.log('Executing proposal...')
      try {
        const proposalId = await proposalKryptonaMemberContract.nextProposalId();
        await proposalKryptonaMemberContract.executeProposal(proposalId - 1);
        console.log('Proposal Executed');
      } catch (error) {
        if (error.reason.toString().includes('Voting is still active')) {
          console.log('If testing locally, please run the evmAdvanceTimeWeek function in the test section. Voting is still active for this proposal.');
        } else {
          console.error('Error executing proposal:', error.reason);
        }
      }
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!proposalKryptonaMemberContract) {
      console.error('Kryptona Member Proposal contract not fetched');
    }
  }

  const executeWithdrawalProposal = async () => {
    if (proposalKryptonaTreasuryContract && walletAddress) {
      console.log('Executing proposal...')
      try {
        const proposalId = await proposalKryptonaTreasuryContract.nextProposalId();
        await proposalKryptonaTreasuryContract.executeProposal(proposalId - 1);
        console.log('Proposal Executed');
      } catch (error) {
        if (error.reason.toString().includes('Voting is still active')) {
          console.log('If testing locally, please run the evmAdvanceTimeWeek function in the test section. Voting is still active for this proposal.');
        } else {
          console.error('Error executing proposal:', error.reason);
        }
      }
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!proposalKryptonaTreasuryContract) {
      console.error('Kryptona Withdrawal Proposal contract not fetched');
    }
  }
  
  const checkProposalKryptonaMember = async () => {
    console.log(proposalKryptonaNewMemberExecuted)
    if (proposalKryptonaMemberContract && walletAddress) {
      const checkWalletAddress = proposalKryptonaNewMemberAddress;
      const memberStatus = await kryptonaDAOContract.checkMembership(checkWalletAddress);
      setProposalKryptonaNewMember(memberStatus);
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!proposalKryptonaMemberContract) {
      console.error('Kryptona Member Proposal contract not fetched');
    }
  }
    
  const checkProposalWithdrawalReceiverBalance = async () => {
    if (proposalKryptonaTreasuryContract && walletAddress) {
      const checkWalletAddress = proposalKryptonaWithdrawalReceiverAddress;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(checkWalletAddress);
      setProposalKryptonaReceivedBalance((balance / 10 ** 18).toString());
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!proposalKryptonaTreasuryContract) {
      console.error('Kryptona Withdrawal Proposal contract not fetched');
    }
  }

  const checkKryptonaTreasuryBalance = async () => {
    if (proposalKryptonaTreasuryContract && walletAddress) {
      console.log('Checking Treasury Balance...')
      const treasuryBalance = await kryptonaDAOContract.getTreasuryBalance();
      setProposalKryptonaTreasuryBalance((treasuryBalance / 10 ** 18).toString());
      console.log('Treasury Balance:', treasuryBalance);
    } else if (!walletAddress) {
      console.error('Wallet not connected');
    } else if (!proposalKryptonaTreasuryContract) {
      console.error('Kryptona Withdrawal Proposal contract not fetched');
    }
  }

  const handleNewMemberInputAddressChange = (event) => {
    setPropoosalKryptonaNewMemberAddress(event.target.value);
  };

  const handleNewWithdrawalInputAddressChange = (event) => {
    setProposalKryptonaWithdrawalReceiverAddress(event.target.value);
  };
  
  const handleNewWithdrawalAmountChange = (event) => {
    setProposalKryptonaWithdrawalAmount(event.target.value);
  };


  return (
    <div className="propose-container">
      <h2 className="propose-subtitle">Create a New Member Proposal</h2>
      <div className="propose-content">
        <div className="propose-button-container">
          <button className="propose-button" onClick={getProposalKryptonaMemberContract}>
            Fetch Kryptona Proposal Member Contract
          </button>
          <p className="propose-paragraph">
          { proposalKrytonaMemberContractFetched ? proposalKryptonaMemberContractAddress.proposalkryptonamember : 'Press Button to Fetch Kryptona Member Proposal Contract'}
          </p>
        </div>
        <div className="propose-button-container">
          <button className="propose-button" onClick={getKryptonaDAOContract}>
            Fetch Kryptona DAO Contract
          </button>
          <p className="propose-paragraph">
          { kryptonaDAOContractFetched ? kryptonaDAOContractAddress.daokryptona : 'Press Button to Fetch Kryptona DAO Contract'}
          </p>
        </div>
        <div className="propose-button-container">
          <button className="propose-button" onClick={createProposalKryptonaMember}>
            Create Kryptona Member Proposal
          </button>
          <input
            className="propose-input"
            value={proposalKryptonaNewMemberAddress}
            onChange={handleNewMemberInputAddressChange}
          />
        </div>
        <div className="propose-button-container">
          <button className="propose-button" onClick={getMemberProposalVotes}>
            Get Proposal Votes
          </button>
          <p className="propose-paragraph">
          { proposalKryptonaNewMemberSummary }
          </p>
        </div>
        <div className="propose-button-container">
          <button className="propose-button-two" onClick={executeMemberProposal}>
            Execute Proposal
          </button>
          <button className="propose-button-two" onClick={checkProposalKryptonaMember}>
            Check Member Status
          </button>
        </div>
        <div className="propose-button-container">
        <p className="propose-paragraph-two">
          { proposalKryptonaNewMemberExecuted ?  'Member added to DAO' : 'Member not added to DAO'}
        </p>
        </div>
      </div>
      <h2 className="propose-subtitle">Create a New Treasury Withdrawal Proposal</h2>
      <div className='propose-content'>
        <div className="propose-button-container">
          <button className="propose-button" onClick={getProposalKryptonaTreasuryContract}>
            Fetch Kryptona Treasury Withdrawal Contract
          </button>
          <p className="propose-paragraph">
          { proposalKrytonaTreasuryContractFetched ? proposalKryptonaTreasuryContractAddress.proposalkryptonatreasury : 'Press Button to Fetch Kryptona Treasury Proposal Contract'}
          </p>
        </div>
        <div className="propose-button-container">
          <button className="propose-button" onClick={getKryptonaDAOContract}>
            Fetch Kryptona DAO Contract
          </button>
          <p className="propose-paragraph">
          { kryptonaDAOContractFetched ? kryptonaDAOContractAddress.daokryptona : 'Press Button to Fetch Kryptona DAO Contract'}
          </p>
        </div>
        <div className="propose-button-container">
          <button className="propose-button" onClick={checkKryptonaTreasuryBalance}>
            Get Treasury Balance
          </button>
          <p className="propose-paragraph">
          { proposalKryptonaTreasuryBalance.includes('Check') ? proposalKryptonaTreasuryBalance : proposalKryptonaTreasuryBalance + ' ETH'}
          </p>
        </div>
        <div className="propose-button-container">
          <button className="propose-button" onClick={createProposalKryptonaTreasury}>
            Create Kryptona Withdrawal Proposal
          </button>
          <input
            className="propose-input-withdrawl-address"
            value={proposalKryptonaWithdrawalReceiverAddress}
            onChange={handleNewWithdrawalInputAddressChange}
          />
          <input
            className="propose-input-withdrawl-amount"
            value={proposalKryptonaWithdrawalAmount}
            onChange={handleNewWithdrawalAmountChange}
          />
        </div>
        <div className="propose-button-container">
          <button className="propose-button" onClick={getWithdrawalProposalVotes}>
            Get Proposal Votes
          </button>
          <p className="propose-paragraph">
          { proposalKryptonaWithdrawalSummary }
          </p>
        </div>
        <div className="propose-button-container">
          <button className="propose-button-two" onClick={executeWithdrawalProposal}>
            Execute Proposal
          </button>
          <button className="propose-button-two" onClick={checkProposalWithdrawalReceiverBalance}>
            Check Receiver Balance
          </button>
        </div>
        <div className="propose-button-container">
        <p className="propose-paragraph-two">
          { proposalKryptonaReceivedBalance.includes('Check') ? proposalKryptonaReceivedBalance : proposalKryptonaReceivedBalance + ' ETH'}
        </p>
        </div>
      </div>
    </div>
  );
};

export default Propose;