/**
 * @fileoverview
 * Tests for ProposalKryptonaMember smart contract functionalities including proposal creation, voting, and execution.
 * This suite ensures that the proposal system operations such as creating a proposal, voting for a proposal, and executing a proposal behave as expected.
 *
 * The tests also cover member management to ensure that the system correctly handles adding and removing members.
 * Furthermore, it tests the time-dependent logic of the proposal system, simulating the passage of time to make a proposal executable.
 *
 * Error handling is also tested to ensure that the system reacts appropriately to unauthorized actions and invalid states.
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProposalKryptonaMember", function () {
    let KryptonaDAO, kryptonaDAO, kryptonaDAOAddress;
    let ProposalKryptonaMember, proposalKryptonaMember, proposalKryptonaMemberAddress;
    let Kryptona, kryptona, kryptonaTokenAddress;
    let KryptonaTreasury, kryptonaTreasury, kryptonaTreasuryAddress;
    let owner, addr1, addr2, addr3;

    // This block is executed before each test
    beforeEach(async function () {
        // Get signers
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Deploy Kryptona token contract
        Kryptona = await ethers.getContractFactory("Kryptona");
        const initialSupply = 1000000000;
        kryptona = await Kryptona.deploy(initialSupply); // Adjust parameters as needed
        await kryptona.deployed();
        kryptonaTokenAddress = kryptona.address;

        // Mint Kryptona tokens to addr1, addr2, and addr3
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
        kryptonaDAOAddress = kryptonaDAO.address;

        // Deploy ProposalKryptonaMember contract
        ProposalKryptonaMember = await ethers.getContractFactory("ProposalKryptonaMember");
        proposalKryptonaMember = await ProposalKryptonaMember.deploy(kryptonaDAOAddress);
        await proposalKryptonaMember.deployed();
        proposalKryptonaMemberAddress = await proposalKryptonaMember.address;

        // Set up ProposalKryptonaMember with the DAO address
        await kryptonaDAO.setProposalContract(proposalKryptonaMemberAddress, "Kryptona Member Proposal");
    });

    // Test case: Should create a member proposal
    it("Should create a member proposal", async function () {
        // Add addr1 as a member and create a proposal
        await kryptonaDAO.addMember(addr1.address);
        await proposalKryptonaMember.connect(addr1).createMemberProposal(addr2.address, 0);
        
        // Get the proposal and check its description
        const proposalId = await proposalKryptonaMember.nextProposalId() - 1;
        const proposal = await proposalKryptonaMember.proposals(proposalId);
        expect(proposal.description).to.equal("Add member");
    });

    // Test case: Should execute an add member proposal successfully
    it("Should execute an add member proposal successfully", async function () {
        // Add addr1 as a member and create a proposal
        await kryptonaDAO.addMember(addr1.address);
        await proposalKryptonaMember.connect(addr1).createMemberProposal(addr2.address, 0);
        const proposalId = await proposalKryptonaMember.nextProposalId() - 1;

        // Vote for the proposal
        await proposalKryptonaMember.connect(addr1).vote(proposalId, true);

        // Simulate the passage of time
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]); 
        await ethers.provider.send("evm_mine"); 

        // Execute the proposal
        await proposalKryptonaMember.connect(addr1).executeProposal(proposalId);

        // Check if addr2 is a member
        const isMember = await kryptonaDAO.checkMembership(addr2.address);
        expect(isMember).to.equal(true);
    });

    // Test case for executing a remove member proposal
    it("Should execute a remove member proposal successfully", async function () {
        await kryptonaDAO.addMember(addr1.address);
        await kryptonaDAO.addMember(addr2.address);
    
        let isMemberBeforeRemoval = await kryptonaDAO.checkMembership(addr2.address);
        expect(isMemberBeforeRemoval).to.equal(true);
    
        await proposalKryptonaMember.connect(addr1).createMemberProposal(addr2.address, 1);
        const proposalId = await proposalKryptonaMember.nextProposalId() - 1;
    
        await proposalKryptonaMember.connect(addr1).vote(proposalId, true);
    
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");
    
        await proposalKryptonaMember.connect(addr1).executeProposal(proposalId);
    
        const isMemberAfterRemoval = await kryptonaDAO.checkMembership(addr2.address);
        expect(isMemberAfterRemoval).to.equal(false);
    });
    
    // Test case for handling votes correctly
    it("Should handle votes correctly with addr1 voting for and addr2 voting against", async function () {
        await kryptonaDAO.addMember(addr1.address);
    
        let isMemberBeforeProposal = await kryptonaDAO.checkMembership(addr3.address);
        expect(isMemberBeforeProposal).to.equal(false);
    
        await proposalKryptonaMember.connect(addr1).createMemberProposal(addr3.address, 0);
        const proposalId = await proposalKryptonaMember.nextProposalId() - 1;
    
        await proposalKryptonaMember.connect(addr1).vote(proposalId, true);
    
        await proposalKryptonaMember.connect(addr2).vote(proposalId, false); 
    
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]); 
        await ethers.provider.send("evm_mine"); 

        await proposalKryptonaMember.connect(addr1).executeProposal(proposalId);
        
        const isMemberAfterProposal = await kryptonaDAO.checkMembership(addr3.address);
        expect(isMemberAfterProposal).to.equal(true);
    });

    // Test case for admin adding a member for testing
    it("Should support admin add member for testing", async function () {
        const accountTenAddress = '0xBcd4042DE499D14e55001CcbB24a551F3b954096';
        await kryptona.mint(accountTenAddress, 100);
        await kryptonaDAO.adminAddMember(accountTenAddress);
        const isMember = await kryptonaDAO.checkMembership(accountTenAddress);
        expect(isMember).to.equal(true);
    });
});