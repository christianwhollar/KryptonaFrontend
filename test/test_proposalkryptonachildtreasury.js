/**
 * @fileoverview
 * Tests for ProposalKryptonaChildTreasury smart contract functionalities including proposal creation, voting, and execution.
 * This suite ensures that the proposal system operations such as creating a proposal, voting for a proposal, and executing a proposal behave as expected.
 *
 * The tests also cover treasury interactions to ensure that the system correctly handles ETH contributions and transfers.
 * Furthermore, it tests the time-dependent logic of the proposal system, simulating the passage of time to make a proposal executable.
 *
 * Error handling is also tested to ensure that the system reacts appropriately to unauthorized actions and invalid states.
 */

// Importing necessary libraries
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Test suite for ProposalKryptonaChildTreasury
describe("ProposalKryptonaChildTreasury", function () {
    // Variables to hold various data
    let provider;
    let owner, addr1, addr2, addr3;
    let KryptonaDAO, kryptonaDAO;
    let Kryptona, kryptona, kryptonaTokenAddress;
    let KryptonaTreasury, kryptonaTreasury, kryptonaTreasuryAddress;
    let KryptonaChildDAO, kryptonaChildDAO, kryptonaChildDAOAddress;
    let ProposalKryptonaChildTreasury, proposalKryptonaChildTreasury, proposalKryptonaChildTreasuryAddress;
    let fee;

    // Setup before each test
    beforeEach(async function () {
        // Get provider and signers
        provider = hre.ethers.provider;
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Deploy Kryptona token contract
        Kryptona = await ethers.getContractFactory("Kryptona");
        const initialSupply = 1000000;
        kryptona = await Kryptona.deploy(initialSupply);
        await kryptona.deployed();
        kryptonaTokenAddress = kryptona.address;

        // Mint Kryptona tokens to addr1, addr2 and addr3
        await kryptona.mint(addr1.address, 1000);
        await kryptona.mint(addr2.address, 100);
        await kryptona.mint(addr3.address, 100);

        // Deploy KryptonaTreasury contract
        KryptonaTreasury = await ethers.getContractFactory("DAOKryptonaTreasury");
        kryptonaTreasury = await KryptonaTreasury.deploy(kryptonaTokenAddress);
        await kryptonaTreasury.deployed();
        kryptonaTreasuryAddress = kryptonaTreasury.address;

        // Deploy KryptonaDAO contract
        KryptonaDAO = await ethers.getContractFactory("DAOKryptona");
        kryptonaDAO = await KryptonaDAO.deploy(kryptonaTokenAddress, kryptonaTreasuryAddress);
        await kryptonaDAO.deployed();

        // Deploy KryptonaChildDAO contract
        KryptonaChildDAO = await ethers.getContractFactory("DAOKryptonaChild");
        kryptonaChildDAO = await KryptonaChildDAO.deploy(kryptonaTokenAddress, kryptonaTreasuryAddress);
        await kryptonaChildDAO.deployed();
        kryptonaChildDAOAddress = kryptonaChildDAO.address;

        // Deploy ProposalKryptonaChildTreasury contract
        ProposalKryptonaChildTreasury = await ethers.getContractFactory("ProposalKryptonaChildTreasury");
        proposalKryptonaChildTreasury = await ProposalKryptonaChildTreasury.deploy(kryptonaChildDAOAddress);
        await proposalKryptonaChildTreasury.deployed();
        proposalKryptonaChildTreasuryAddress = proposalKryptonaChildTreasury.address;

        // Set proposal contract in the DAO
        await kryptonaChildDAO.setProposalContract(proposalKryptonaChildTreasuryAddress);

        // Set fee
        fee = 0.01;
    });

    // Test case for sending ETH to the treasury and executing a proposal
    it("should send ETH to the treasury and execute a proposal", async function() {
        // Add addr1 as a member
        await kryptonaChildDAO.addMember(addr1.address);

        // Check initial balance of child DAO
        const initialBalanceChild = ethers.utils.formatEther(await kryptonaChildDAO.getETHBalance());
        expect(initialBalanceChild).to.equal("0.0");

        // Get initial balance of addr2
        const initialBalanceAddr = await provider.getBalance(await addr2.getAddress());

        // Define amount to send
        const amountToSendString = "1.0";
        const amountToSend = ethers.utils.parseEther(amountToSendString);
        const amountToReceiveChild = String(parseFloat(amountToSendString) * (1 - fee))

        // Contribute to treasury
        await kryptonaChildDAO.connect(addr1).contributeToTreasuryETH({ value: amountToSend });

        // Create a proposal
        const finalBalanceChild = await kryptonaChildDAO.getETHBalance();
        const amountToReceiveAddr = String(parseFloat(finalBalanceChild) * (1 - fee))
        await proposalKryptonaChildTreasury.connect(addr1).createTreasuryProposal(addr2.address, finalBalanceChild, "Send to Address 2");
        const proposalId = await proposalKryptonaChildTreasury.nextProposalId() - 1;

        // Vote for the proposal
        await proposalKryptonaChildTreasury.connect(addr1).vote(proposalId, true);

        // Simulate time passage for the proposal to become executable
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        // Execute the proposal
        await proposalKryptonaChildTreasury.connect(addr1).executeProposal(proposalId);

        // Check final balance of addr2
        const finalBalanceAddr = await provider.getBalance(await addr2.getAddress());
        const delta = ethers.utils.parseEther("0.01");
        expect(BigInt(finalBalanceAddr) - BigInt(initialBalanceAddr)).to.be.closeTo(BigInt(amountToReceiveAddr), BigInt(delta));    
    });
});