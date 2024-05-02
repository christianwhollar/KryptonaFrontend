const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * @fileoverview
 * Tests for the ProposalKryptonaChildMember contract within the Kryptona Child DAO.
 * This suite checks the functionality for creating and executing membership proposals,
 * including the proper handling of voting processes and the enforcement of proposal outcomes.
 * It validates the ability of the child DAO to manage membership dynamically through proposals,
 * ensuring the DAO's adaptability and governance integrity.
 */

describe("ProposalKryptonaChildMember", function () {
    let owner, addr1, addr2, addr3;
    let KryptonaDAO, kryptonaDAO;
    let Kryptona, kryptona, kryptonaTokenAddress;
    let KryptonaTreasury, kryptonaTreasury, kryptonaTreasuryAddress;
    let KryptonaChildDAO, kryptonaChildDAO, kryptonaChildDAOAddress;
    let ProposalKryptonaChildMember, proposalKryptonaChildMember, proposalKryptonaChildMemberAddress;

    // Set up the testing environment before each test.
    beforeEach(async function () {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Deploy the Kryptona token and set up the initial token supply.
        Kryptona = await ethers.getContractFactory("Kryptona");
        const initialSupply = 1000000; // Set the initial token supply.
        kryptona = await Kryptona.deploy(initialSupply);
        await kryptona.deployed();
        kryptonaTokenAddress = kryptona.address;

        // Mint tokens to multiple addresses for use in tests.
        await kryptona.mint(addr1.address, 1000);
        await kryptona.mint(addr2.address, 100);
        await kryptona.mint(addr3.address, 100);

        // Set up the Kryptona Treasury, essential for financial operations.
        KryptonaTreasury = await ethers.getContractFactory("DAOKryptonaTreasury");
        kryptonaTreasury = await KryptonaTreasury.deploy(kryptonaTokenAddress);
        await kryptonaTreasury.deployed();
        kryptonaTreasuryAddress = kryptonaTreasury.address;

        // Deploy the main KryptonaDAO and child DAO contracts.
        KryptonaDAO = await ethers.getContractFactory("DAOKryptona");
        kryptonaDAO = await KryptonaDAO.deploy(kryptonaTokenAddress, kryptonaTreasuryAddress);
        await kryptonaDAO.deployed();

        KryptonaChildDAO = await ethers.getContractFactory("DAOKryptonaChild");
        kryptonaChildDAO = await KryptonaChildDAO.deploy(kryptonaTokenAddress, kryptonaTreasuryAddress);
        await kryptonaChildDAO.deployed();
        kryptonaChildDAOAddress = kryptonaChildDAO.address;

        // Set up the ProposalKryptonaChildMember contract linked to the child DAO.
        ProposalKryptonaChildMember = await ethers.getContractFactory("ProposalKryptonaChildMember");
        proposalKryptonaChildMember = await ProposalKryptonaChildMember.deploy(kryptonaChildDAOAddress);
        await proposalKryptonaChildMember.deployed();
        proposalKryptonaChildMemberAddress = proposalKryptonaChildMember.address;

        // Allow the child DAO to interact with the proposal contract.
        await kryptonaChildDAO.setProposalContract(proposalKryptonaChildMemberAddress);
    });

    // Test the creation of a membership proposal.
    it("Should create a member proposal", async function () {
        // Adding an existing member to initiate a proposal.
        await kryptonaChildDAO.addMember(addr1.address);

        // Create a proposal for adding another member.
        await proposalKryptonaChildMember.connect(addr1).createMemberProposal(addr2.address, 0);
        
        // Retrieve the created proposal using its ID.
        const proposalId = await proposalKryptonaChildMember.nextProposalId() - 1;
        const proposal = await proposalKryptonaChildMember.proposals(proposalId);

        // Check the proposal's description matches the intended action.
        expect(proposal.description).to.equal("Add member");
    });

    // Test the execution of an 'add member' proposal.
    it("Should execute an add member proposal successfully", async function () {
        // Member creates a proposal for adding another member.
        await kryptonaChildDAO.addMember(addr1.address);
        await proposalKryptonaChildMember.connect(addr1).createMemberProposal(addr2.address, 0);
        const proposalId = await proposalKryptonaChildMember.nextProposalId() - 1;

        // Member votes in favor of their own proposal.
        await proposalKryptonaChildMember.connect(addr1).vote(proposalId, true);

        // Time travel to simulate passing the voting period.
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]); 
        await ethers.provider.send("evm_mine"); 
        
        // Execute the proposal after the voting period.
        await proposalKryptonaChildMember.connect(addr1).executeProposal(proposalId);
        
        // Verify the targeted address is now a member.
        const isMember = await kryptonaChildDAO.checkMembership(addr2.address);
        expect(isMember).to.equal(true);
    });

    // Test for removing a member through a proposal.
    it("Should execute a remove member proposal successfully", async function () {
        // Set up initial members.
        await kryptonaChildDAO.addMember(addr1.address);
        await kryptonaChildDAO.addMember(addr2.address);
    
        // Check initial membership status.
        let isMemberBeforeRemoval = await kryptonaChildDAO.checkMembership(addr2.address);
        expect(isMemberBeforeRemoval).to.equal(true);
    
        // Create and execute a removal proposal.
        await proposalKryptonaChildMember.connect(addr1).createMemberProposal(addr2.address, 1);
        const proposalId = await proposalKryptonaChildMember.nextProposalId() - 1;
    
        await proposalKryptonaChildMember.connect(addr1).vote(proposalId, true);
    
        // Time travel to allow for proposal execution.
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");
    
        await proposalKryptonaChildMember.connect(addr1).executeProposal(proposalId);
    
        // Verify the member has been removed.
        const isMemberAfterRemoval = await kryptonaChildDAO.checkMembership(addr2.address);
        expect(isMemberAfterRemoval).to.equal(false);
    });

    // Test for voting discrepancies and outcomes.
    it("Should handle votes correctly with addr1 voting for and addr2 voting against", async function () {
        // Prepare a proposal scenario.
        await kryptonaChildDAO.addMember(addr1.address);
    
        let isMemberBeforeProposal = await kryptonaChildDAO.checkMembership(addr3.address);
        expect(isMemberBeforeProposal).to.equal(false);
    
        await proposalKryptonaChildMember.connect(addr1).createMemberProposal(addr3.address, 0);
        const proposalId = await proposalKryptonaChildMember.nextProposalId() - 1;
    
        // Simulate conflicting votes.
        await proposalKryptonaChildMember.connect(addr1).vote(proposalId, true);
        await proposalKryptonaChildMember.connect(addr2).vote(proposalId, false); 
    
        // Proceed with proposal execution after time lapse.
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]); 
        await ethers.provider.send("evm_mine"); 

        await proposalKryptonaChildMember.connect(addr1).executeProposal(proposalId);
        
        // Check the final membership status of the proposed member.
        const isMemberAfterProposal = await kryptonaChildDAO.checkMembership(addr3.address);
        expect(isMemberAfterProposal).to.equal(true);
    });
});
