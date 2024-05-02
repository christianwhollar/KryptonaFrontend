/**
 * This is a test suite for the ProposalKryptonaTreasury contract.
 * 
 * The ProposalKryptonaTreasury contract is part of a DAO system, which allows members to propose and vote on proposals related to the treasury.
 * 
 * The test suite first sets up the necessary contracts and initial state in the beforeEach hook. This includes deploying the Kryptona token contract, minting some tokens, deploying the KryptonaTreasury contract, deploying the KryptonaDAO contract, and deploying the ProposalKryptonaTreasury contract.
 * 
 * The test suite then has a single test case that checks the functionality of sending ETH to the treasury and executing a proposal. The test case goes through the process of a member contributing ETH to the treasury, creating a proposal to send the ETH to another address, voting on the proposal, and then executing the proposal. The test case checks that the ETH was correctly transferred from the treasury to the specified address.
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProposalKryptonaTreasury", function () {
    let KryptonaDAO, kryptonaDAO, kryptonaDAOAddress;
    let ProposalKryptonaTreasury, proposalKryptonaTreasury, proposalKryptonaTreasuryAddress;
    let Kryptona, kryptona, kryptonaTokenAddress;
    let KryptonaTreasury, kryptonaTreasury, kryptonaTreasuryAddress;
    let owner, addr1, addr2, addr3;
    let provider;
    beforeEach(async function () {
        provider = hre.ethers.provider;
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Deploy Kryptona token contract
        Kryptona = await ethers.getContractFactory("Kryptona");
        const initialSupply = 1000000000;
        kryptona = await Kryptona.deploy(initialSupply); // Adjust parameters as needed
        await kryptona.deployed();

        // get token address
        kryptonaTokenAddress = kryptona.address;

        // Mint Kryptona tokens to addr1 and addr2
        await kryptona.mint(addr1.address, 1000);
        await kryptona.mint(addr2.address, 100);
        await kryptona.mint(addr3.address, 100);

        // deploy kryptona treasury
        KryptonaTreasury = await ethers.getContractFactory("DAOKryptonaTreasury");
        kryptonaTreasury = await KryptonaTreasury.deploy(kryptonaTokenAddress);
        await kryptonaTreasury.deployed();

        kryptonaTreasuryAddress = kryptonaTreasury.address;

        // Deploy KryptonaDAO contract with Kryptona token address
        KryptonaDAO = await ethers.getContractFactory("DAOKryptona");
        kryptonaDAO = await KryptonaDAO.deploy(kryptonaTokenAddress, kryptonaTreasuryAddress);
        await kryptonaDAO.deployed();

        kryptonaDAOAddress = kryptonaDAO.address;

        // Set up ProposalKryptonaMember with the DAO address
        ProposalKryptonaTreasury = await ethers.getContractFactory("ProposalKryptonaTreasury");
        proposalKryptonaTreasury = await ProposalKryptonaTreasury.deploy(kryptonaDAOAddress);
        await proposalKryptonaTreasury.deployed();

        proposalKryptonaTreasuryAddress = proposalKryptonaTreasury.address;

        // Assuming the DAO contract allows adding a proposal contract address
        await kryptonaDAO.setProposalContract(proposalKryptonaTreasuryAddress, "Kryptona Treasury Proposal");
    });

    it("should send ETH to the treasury and execute a proposal", async function() {
        expect(await kryptonaTreasury.getETHBalance()).to.equal(0);

        await kryptonaDAO.addMember(addr1.address);
        const amountToSend = ethers.utils.parseUnits("1.0", "ether");
        const initialEthBalance = await provider.getBalance(addr2.address);

        // Send ETH to the treasury
        await kryptonaDAO.connect(addr1).contributeToTreasuryETH({ value: amountToSend });

        // Check initial balance of the treasury in ETH
        await proposalKryptonaTreasury.connect(addr1).createTreasuryProposal(addr2.address, amountToSend, "Send to Address 2");
        const proposalId = await proposalKryptonaTreasury.nextProposalId() - 1;
        // Vote on the proposal (assuming addr1 can vote)
        await proposalKryptonaTreasury.connect(addr1).vote(proposalId, true);

        // Simulate time passage for the proposal to become executable
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        // Execute the proposal
        await proposalKryptonaTreasury.connect(addr1).executeProposal(proposalId);

        const finalEthBalance = await provider.getBalance(addr2.address);
        
        const ethReceived = ethers.utils.formatUnits(finalEthBalance.sub(initialEthBalance), "ether");
        expect(ethReceived).to.equal(ethers.utils.formatUnits(amountToSend, "ether"));
    });
});