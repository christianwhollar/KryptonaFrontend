const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProposalKryptonaMember", function () {
    let KryptonaDAO, kryptonaDAO, kryptonaDAOAddress;
    let ProposalKryptonaMember, proposalKryptonaMember, proposalKryptonaMemberAddress;
    let Kryptona, kryptona, kryptonaTokenAddress;
    let KryptonaTreasury, kryptonaTreasury, kryptonaTreasuryAddress;
    let owner, addr1, addr2, addr3;

    beforeEach(async function () {
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
        ProposalKryptonaMember = await ethers.getContractFactory("ProposalKryptonaMember");
        proposalKryptonaMember = await ProposalKryptonaMember.deploy(kryptonaDAOAddress);
        await proposalKryptonaMember.deployed();

        proposalKryptonaMemberAddress = await proposalKryptonaMember.address;

        // Assuming the DAO contract allows adding a proposal contract address
        await kryptonaDAO.setProposalContract(proposalKryptonaMemberAddress, "Kryptona Member Proposal");
    });

    it("Should create a member proposal", async function () {
        await kryptonaDAO.addMember(addr1.address);
        await proposalKryptonaMember.connect(addr1).createMemberProposal(addr2.address, 0);
        
        const proposalId = await proposalKryptonaMember.nextProposalId() - 1;
        const proposal = await proposalKryptonaMember.proposals(proposalId);

        expect(proposal.description).to.equal("Add member");
    });

    it("Should execute an add member proposal successfully", async function () {
        await kryptonaDAO.addMember(addr1.address);

        await proposalKryptonaMember.connect(addr1).createMemberProposal(addr2.address, 0);
        const proposalId = await proposalKryptonaMember.nextProposalId() - 1;
        await proposalKryptonaMember.connect(addr1).vote(proposalId, true);

        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]); 
        await ethers.provider.send("evm_mine"); 

        const proposalIndex = await kryptonaDAO.getProposalIndex();
        const proposalAddress = await kryptonaDAO.getProposalContract(proposalIndex - 1);
        const proposalType = await kryptonaDAO.getProposalType(proposalIndex - 1);

        await proposalKryptonaMember.connect(addr1).executeProposal(proposalId);

        const isMember = await kryptonaDAO.checkMembership(addr2.address);

        expect(proposalAddress).to.equal(proposalKryptonaMemberAddress);
        expect(proposalType).to.equal("Kryptona Member Proposal");
        expect(isMember).to.equal(true);
    });

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

    it("Should support admin add member for testing", async function () {
        const accountTenAddress = '0xBcd4042DE499D14e55001CcbB24a551F3b954096';
        await kryptona.mint(accountTenAddress, 100);
        await kryptonaDAO.adminAddMember(accountTenAddress);
        const isMember = await kryptonaDAO.checkMembership(accountTenAddress);
        expect(isMember).to.equal(true);
    });
});