const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

/**
 * @fileoverview
 * Tests for the ProposalBase contract to ensure the functionality for creating, voting on,
 * and executing proposals works correctly. This suite aims to validate the proposal lifecycle
 * management within the DAO framework, ensuring that proposals can be made, voted on, and
 * executed as expected, including time-dependent execution.
 */

describe("ProposalBase", function () {
    let proposalBase;
    let owner, addr1, addr2;

    // Setup function runs before each test to deploy the contract and prepare the environment
    beforeEach(async function () {
        const ProposalBase = await ethers.getContractFactory("ProposalBase");
        proposalBase = await ProposalBase.deploy();
        await proposalBase.deployed();
        [owner, addr1, addr2] = await ethers.getSigners();
    });

    it("create a proposal", async function () {
        // Define the proposal description
        const description = "Test Proposal";
        const proposalID = 0;

        // Act: Create a new proposal
        await proposalBase.createProposal(description);

        // Fetch the newly created proposal from the contract
        const proposal = await proposalBase.proposals(proposalID);

        // Assert: Verify the description matches what was submitted
        expect(proposal.description).to.equal(description);
    });

    it("vote on a proposal", async function () {
        // Arrange: Create a proposal to vote on
        const description = "Test Proposal";
        const proposalID = 0;
        await proposalBase.createProposal(description);

        // Act: Cast a vote for the proposal
        const vote = true;
        await proposalBase.vote(proposalID, vote);

        // Fetch the voting results for the proposal
        const [, , , forVotes] = await proposalBase.getProposal(proposalID);

        // Assert: Verify the vote was counted correctly
        expect(forVotes).to.equal(1);
    });

    it("execute a proposal", async function () {
        // Arrange: Create a proposal and vote in favor
        const description = "Test Proposal";
        const proposalID = 0;
        await proposalBase.createProposal(description);
        
        // Act: Cast a vote for the proposal
        const vote = true;
        await proposalBase.vote(proposalID, vote);

        // Fetch the proposal and simulate time passing to reach the voting deadline
        const proposal = await proposalBase.proposals(proposalID);
        const deadline = proposal.deadline;
        await time.increaseTo(deadline);

        // Execute the proposal after the deadline
        await proposalBase.executeProposal(proposalID);
        const proposalAfterExecution = await proposalBase.proposals(proposalID);

        // Assert: Check the proposal is marked as executed
        expect(proposalAfterExecution.executed).to.equal(true);
    });
});
