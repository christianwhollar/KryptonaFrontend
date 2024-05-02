const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProposalKryptonaChildTreasury", function () {
    let provider;
    let owner, addr1, addr2, addr3;
    let KryptonaDAO, kryptonaDAO;
    let Kryptona, kryptona, kryptonaTokenAddress;
    let KryptonaTreasury, kryptonaTreasury, kryptonaTreasuryAddress;
    let KryptonaChildDAO, kryptonaChildDAO, kryptonaChildDAOAddress;
    let ProposalKryptonaChildTreasury, proposalKryptonaChildTreasury, proposalKryptonaChildTreasuryAddress;
    let fee;

    beforeEach(async function () {
        provider = hre.ethers.provider;
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

        kryptonaChildDAOAddress = kryptonaChildDAO.address;

        // Set up ProposalKryptonaMember with the DAO address
        ProposalKryptonaChildTreasury = await ethers.getContractFactory("ProposalKryptonaChildTreasury");
        proposalKryptonaChildTreasury = await ProposalKryptonaChildTreasury.deploy(kryptonaChildDAOAddress);
        await proposalKryptonaChildTreasury.deployed();

        proposalKryptonaChildTreasuryAddress = proposalKryptonaChildTreasury.address;

        // Assuming the DAO contract allows adding a proposal contract address
        await kryptonaChildDAO.setProposalContract(proposalKryptonaChildTreasuryAddress);

        fee = 0.01;
    });

    it("should send ETH to the treasury and execute a proposal", async function() {

        await kryptonaChildDAO.addMember(addr1.address);

        const initialBalanceChild = ethers.utils.formatEther(await kryptonaChildDAO.getETHBalance());
        expect(initialBalanceChild).to.equal("0.0");

        const initialBalanceAddr = await provider.getBalance(await addr2.getAddress());

        const amountToSendString = "1.0";
        const amountToSend = ethers.utils.parseEther(amountToSendString);

        const amountToReceiveChild = String(parseFloat(amountToSendString) * (1 - fee))

        await kryptonaChildDAO.connect(addr1).contributeToTreasuryETH({ value: amountToSend });
        
        const finalBalanceChild = await kryptonaChildDAO.getETHBalance();
        const amountToReceiveAddr = String(parseFloat(finalBalanceChild) * (1 - fee))

        await proposalKryptonaChildTreasury.connect(addr1).createTreasuryProposal(addr2.address, finalBalanceChild, "Send to Address 2");
        const proposalId = await proposalKryptonaChildTreasury.nextProposalId() - 1;

        await proposalKryptonaChildTreasury.connect(addr1).vote(proposalId, true);

        // Simulate time passage for the proposal to become executable
        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
        await ethers.provider.send("evm_mine");

        await proposalKryptonaChildTreasury.connect(addr1).executeProposal(proposalId);

        const finalBalanceAddr = await provider.getBalance(await addr2.getAddress());
        
        const delta = ethers.utils.parseEther("0.01");
        expect(BigInt(finalBalanceAddr) - BigInt(initialBalanceAddr)).to.be.closeTo(BigInt(amountToReceiveAddr), BigInt(delta));    
    });
});
