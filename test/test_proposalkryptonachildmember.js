const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProposalKryptonaChildMember", function () {
    let owner, addr1, addr2, addr3;
    let KryptonaDAO, kryptonaDAO;
    let Kryptona, kryptona, kryptonaTokenAddress;
    let KryptonaTreasury, kryptonaTreasury, kryptonaTreasuryAddress;
    let KryptonaChildDAO, kryptonaChildDAO, kryptonaChildDAOAddress;
    let ProposalKryptonaChildMember, proposalKryptonaChildMember, proposalKryptonaChildMemberAddress;

    beforeEach(async function () {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Deploy Kryptona token contract
        Kryptona = await ethers.getContractFactory("Kryptona");
        const initialSupply = 1000000;
        kryptona = await Kryptona.deploy(initialSupply); // Adjust parameters as needed
        await kryptona.deployed();

        // get token address
        kryptonaTokenAddress = kryptona.address;

        // Mint Kryptona tokens to addr1 and addr2
        await kryptona.mint(addr1.address, 1000);
        await kryptona.mint(addr2.address, 100);
        await kryptona.mint(addr3.address, 100);

        //
        KryptonaTreasury = await ethers.getContractFactory("DAOKryptonaTreasury");
        kryptonaTreasury = await KryptonaTreasury.deploy(kryptonaTokenAddress);
        await kryptonaTreasury.deployed();

        kryptonaTreasuryAddress = kryptonaTreasury.address;

        // Deploy KryptonaDAO contract with Kryptona token address
        KryptonaDAO = await ethers.getContractFactory("DAOKryptona");
        kryptonaDAO = await KryptonaDAO.deploy(kryptonaTokenAddress, kryptonaTreasuryAddress);
        await kryptonaDAO.deployed();

        //
        KryptonaChildDAO = await ethers.getContractFactory("DAOKryptonaChild");
        kryptonaChildDAO = await KryptonaChildDAO.deploy(kryptonaTokenAddress, kryptonaTreasuryAddress);
        await kryptonaChildDAO.deployed();

        kryptonaChildDAOAddress = kryptonaChildDAO.address

        // Set up ProposalKryptonaMember with the DAO address
        ProposalKryptonaChildMember = await ethers.getContractFactory("ProposalKryptonaChildMember");
        proposalKryptonaChildMember = await ProposalKryptonaChildMember.deploy(kryptonaChildDAOAddress);
        await proposalKryptonaChildMember.deployed();

        proposalKryptonaChildMemberAddress = proposalKryptonaChildMember.address

        // Assuming the DAO contract allows adding a proposal contract address
        await kryptonaChildDAO.setProposalContract(proposalKryptonaChildMemberAddress);
    });

    it("Should create a member proposal", async function () {
        await kryptonaChildDAO.addMember(addr1.address);
        await proposalKryptonaChildMember.connect(addr1).createMemberProposal(addr2.address, 0);
        
        const proposalId = await proposalKryptonaChildMember.nextProposalId() - 1;
        const proposal = await proposalKryptonaChildMember.proposals(proposalId);

        expect(proposal.description).to.equal("Add member");
    });

    it("Should execute an add member proposal successfully", async function () {
        await kryptonaChildDAO.addMember(addr1.address);

        await proposalKryptonaChildMember.connect(addr1).createMemberProposal(addr2.address, 0);
        const proposalId = await proposalKryptonaChildMember.nextProposalId() - 1;

        await proposalKryptonaChildMember.connect(addr1).vote(proposalId, true);

        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]); 
        await ethers.provider.send("evm_mine"); 
        
        await proposalKryptonaChildMember.connect(addr1).executeProposal(proposalId);
        
        const isMember = await kryptonaChildDAO.checkMembership(addr2.address);
        expect(isMember).to.equal(true);
    });

    it("Should execute a remove member proposal successfully", async function () {
        await kryptonaChildDAO.addMember(addr1.address);
        await kryptonaChildDAO.addMember(addr2.address);
    
        let isMemberBeforeRemoval = await kryptonaChildDAO.checkMembership(addr2.address);
        expect(isMemberBeforeRemoval).to.equal(true);
    
        await proposalKryptonaChildMember.connect(addr1).createMemberProposal(addr2.address, 1);
        const proposalId = await proposalKryptonaChildMember.nextProposalId() - 1;
    
        await proposalKryptonaChildMember.connect(addr1).vote(proposalId, true);
    
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");
    
        await proposalKryptonaChildMember.connect(addr1).executeProposal(proposalId);
    
        const isMemberAfterRemoval = await kryptonaChildDAO.checkMembership(addr2.address);
        expect(isMemberAfterRemoval).to.equal(false);
    });

    it("Should handle votes correctly with addr1 voting for and addr2 voting against", async function () {
        await kryptonaChildDAO.addMember(addr1.address);
    
        let isMemberBeforeProposal = await kryptonaChildDAO.checkMembership(addr3.address);
        expect(isMemberBeforeProposal).to.equal(false);
    
        await proposalKryptonaChildMember.connect(addr1).createMemberProposal(addr3.address, 0);
        const proposalId = await proposalKryptonaChildMember.nextProposalId() - 1;
    
        await proposalKryptonaChildMember.connect(addr1).vote(proposalId, true);
    
        await proposalKryptonaChildMember.connect(addr2).vote(proposalId, false); 
    
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]); 
        await ethers.provider.send("evm_mine"); 

        await proposalKryptonaChildMember.connect(addr1).executeProposal(proposalId);
        
        const isMemberAfterProposal = await kryptonaChildDAO.checkMembership(addr3.address);
        expect(isMemberAfterProposal).to.equal(true);
    });
});
