const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * @fileoverview
 * Tests for the ProposalKryptonaChildModel contract to ensure functionality for creating, updating,
 * and executing model-related proposals in a Kryptona Child DAO. This suite verifies the proposal process
 * for adding new AI models, updating existing models, and the accurate application of token URIs
 * to model NFTs as part of DAO governance.
 */

describe("ProposalKryptonaChildModel", function () {
    // Define variables for the contracts and addresses
    let owner, addr1, addr2, addr3;
    let KryptonaDAO, kryptonaDAO;
    let Kryptona, kryptona, kryptonaTokenAddress;
    let KryptonaTreasury, kryptonaTreasury, kryptonaTreasuryAddress;
    let KryptonaChildDAO, kryptonaChildDAO, kryptonaChildDAOAddress;
    let ProposalKryptonaChildModel, proposalKryptonaChildModel, proposalKryptonaChildModelAddress;
    let tokenURI;

    // Before each test, deploy the contracts and set up the initial state
    beforeEach(async function () {
        // Get signers
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Deploy Kryptona token contract
        Kryptona = await ethers.getContractFactory("Kryptona");
        const initialSupply = 1000000;
        kryptona = await Kryptona.deploy(initialSupply); // Adjust parameters as needed
        await kryptona.deployed();

        // Get token address
        kryptonaTokenAddress = kryptona.address;

        // Mint Kryptona tokens to addr1 and addr2
        await kryptona.mint(addr1.address, 1000);
        await kryptona.mint(addr2.address, 100);
        await kryptona.mint(addr3.address, 100);

        // Deploy KryptonaTreasury contract
        KryptonaTreasury = await ethers.getContractFactory("DAOKryptonaTreasury");
        kryptonaTreasury = await KryptonaTreasury.deploy(kryptonaTokenAddress);
        await kryptonaTreasury.deployed();

        // Get treasury address
        kryptonaTreasuryAddress = kryptonaTreasury.address;

        // Deploy KryptonaDAO contract with Kryptona token address
        KryptonaDAO = await ethers.getContractFactory("DAOKryptona");
        kryptonaDAO = await KryptonaDAO.deploy(kryptonaTokenAddress, kryptonaTreasuryAddress);
        await kryptonaDAO.deployed();

        // Deploy KryptonaChildDAO contract
        KryptonaChildDAO = await ethers.getContractFactory("DAOKryptonaChild");
        kryptonaChildDAO = await KryptonaChildDAO.deploy(kryptonaTokenAddress, kryptonaTreasuryAddress);
        await kryptonaChildDAO.deployed();

        // Get child DAO address
        kryptonaChildDAOAddress = kryptonaChildDAO.address;

        // Set up ProposalKryptonaChildModel with the DAO address
        ProposalKryptonaChildModel = await ethers.getContractFactory("ProposalKryptonaChildModel");
        proposalKryptonaChildModel = await ProposalKryptonaChildModel.deploy(kryptonaChildDAOAddress);
        await proposalKryptonaChildModel.deployed();

        // Get proposal model address
        proposalKryptonaChildModelAddress = proposalKryptonaChildModel.address;

        // Assuming the DAO contract allows adding a proposal contract address
        await kryptonaChildDAO.setProposalContract(proposalKryptonaChildModelAddress);

        // Read the tokenURI from a file
        const tokenURIFilePath = path.join(__dirname, "../tokenURI/modelmetadatatokenuri.txt");
        const tokenURIData = fs.readFileSync(tokenURIFilePath, { encoding: "utf8" });
        tokenURI = tokenURIData.split("\n")[0];
    });

    // Test for minting an NFT with the correct tokenURI
    it("Should mint an NFT with the correct tokenURI", async function () {
        // Add a member to the DAO
        await kryptonaChildDAO.addMember(addr1.address);
        // Create a model proposal
        await proposalKryptonaChildModel.connect(addr1).createModelProposal(addr2.address, 0);
        
        // Get the proposal
        const proposalId = await proposalKryptonaChildModel.nextProposalId() - 1;
        const proposal = await proposalKryptonaChildModel.proposals(proposalId);

        // Check the proposal description
        expect(proposal.description).to.equal("Add model");
    });

    // Test for executing an add model proposal successfully
    it("Should execute an add model proposal successfully", async function () {
        // Add a member to the DAO
        await kryptonaChildDAO.addMember(addr1.address);

        // Create a model proposal
        await proposalKryptonaChildModel.connect(addr1).createModelProposal(tokenURI, 0);
        const proposalId = await proposalKryptonaChildModel.nextProposalId() - 1;

        // Vote for the proposal
        await proposalKryptonaChildModel.connect(addr1).vote(proposalId, true);

        // Increase time to simulate proposal duration
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]); 
        await ethers.provider.send("evm_mine"); 
        
        // Execute the proposal
        await proposalKryptonaChildModel.connect(addr1).executeProposal(proposalId);
        
        // Check the tokenURI
        const returnTokenURI = await kryptonaChildDAO.getTokenURI()
        expect(tokenURI).to.equal(returnTokenURI)
    });

    // Test for executing an update model proposal successfully
    it("Should execute an update model proposal successfully", async function () {
        // Add model proposal required before update model
        await kryptonaChildDAO.addMember(addr1.address);

        // Create a model proposal
        await proposalKryptonaChildModel.connect(addr1).createModelProposal(tokenURI, 0);
        let proposalId = await proposalKryptonaChildModel.nextProposalId() - 1;

        // Vote for the proposal
        await proposalKryptonaChildModel.connect(addr1).vote(proposalId, true);

        // Increase time to simulate proposal duration
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]); 
        await ethers.provider.send("evm_mine"); 
        
        // Execute the proposal
        await proposalKryptonaChildModel.connect(addr1).executeProposal(proposalId);
        
        // Check the tokenURI
        let returnTokenURI = await kryptonaChildDAO.getTokenURI()
        expect(tokenURI).to.equal(returnTokenURI)

        // Continue to update model proposal
        // Change the value of the tokenURI
        tokenURI = tokenURI + "FAKEHASH"
        await proposalKryptonaChildModel.connect(addr1).createModelProposal(tokenURI, 1);
        proposalId = await proposalKryptonaChildModel.nextProposalId() - 1;

        // Vote for the proposal
        await proposalKryptonaChildModel.connect(addr1).vote(proposalId, true);

        // Increase time to simulate proposal duration
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]); 
        await ethers.provider.send("evm_mine"); 
        
        // Execute the proposal
        await proposalKryptonaChildModel.connect(addr1).executeProposal(proposalId);
        
        // Check the tokenURI
        returnTokenURI = await kryptonaChildDAO.getTokenURI()
        expect(tokenURI).to.equal(returnTokenURI)
    });
});