/**
 * @fileoverview
 * Tests for the TreasuryChild smart contract of the DAOKryptona ecosystem.
 * This suite validates the deposit and withdrawal functionalities of the child treasury,
 * including the handling of fees paid to the parent treasury. It ensures that financial
 * transactions are accurately recorded and fees are correctly calculated and transferred.
 *
 * The tests simulate real-world financial interactions within the child treasury,
 * checking both the integrity of transaction processing and the enforcement of the fee structure.
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TreasuryChild", function (){
    let provider;
    let owner, addr1, addr2;
    let Kryptona, kryptona, kryptonaTokenAddress;
    let KryptonaTreasury, kryptonaTreasury, kryptonaTreasuryAddress;
    let ChildTreasury, childTreasury, childTreasuryAddress;
    let fee;

    // Setup environment before running tests
    before(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        provider = hre.ethers.provider;

        // Deploy the Kryptona token contract and set initial supply
        Kryptona = await ethers.getContractFactory("Kryptona");
        const initialSupply = 1000000;
        kryptona = await Kryptona.deploy(initialSupply);
        await kryptona.deployed();
        kryptonaTokenAddress = kryptona.address;

        // Setup the main Kryptona Treasury
        KryptonaTreasury = await ethers.getContractFactory("DAOKryptonaTreasury");
        kryptonaTreasury = await KryptonaTreasury.deploy(kryptonaTokenAddress);
        await kryptonaTreasury.deployed();
        kryptonaTreasuryAddress = kryptonaTreasury.address;

        // Deploy the Child Treasury linking to the Kryptona main treasury
        ChildTreasury = await ethers.getContractFactory("DAOKryptonaChildTreasury");
        childTreasury = await ChildTreasury.deploy(kryptonaTokenAddress, kryptonaTreasuryAddress);
        await childTreasury.deployed();
        childTreasuryAddress = childTreasury.address;

        // Define transaction fee percentage
        fee = 0.01; // 1% fee
    });

    // Test deposit functionality with fee handling
    it("should deposit tokens correctly and pay fee to parent treasury", async () => {
        const initialBalance = ethers.utils.formatEther(await childTreasury.getETHBalance());
        expect(initialBalance).to.equal("0.0");

        const amountToSendString = "1.0";
        const amountToSend = ethers.utils.parseEther(amountToSendString);
        const amountToReceive = String(parseFloat(amountToSendString) * (1 - fee));

        await addr1.sendTransaction({
            to: childTreasuryAddress,
            value: amountToSend
        });
        
        const finalBalance = ethers.utils.formatEther(await childTreasury.getETHBalance());
        expect(finalBalance).to.equal(amountToReceive);
    });

    // Test withdrawal functionality ensuring correct fee deductions
    it("should withdrawal tokens correctly and pay fee to parent treasury", async () => {
        const initialWalletBalance = ethers.utils.formatEther(await provider.getBalance(addr2.address));
        const amountToSendString = "1.0";
        const amountToSend = ethers.utils.parseEther(amountToSendString);

        await addr1.sendTransaction({
            to: childTreasuryAddress,
            value: amountToSend
        });

        let childTreasuryInitialBalance = await childTreasury.getETHBalance();
        await childTreasury.withdrawEther(addr2.address, childTreasuryInitialBalance);
        childTreasuryInitialBalance = ethers.utils.formatEther(childTreasuryInitialBalance);

        let childTreasuryFinalBalance = await childTreasury.getETHBalance();
        childTreasuryFinalBalance = ethers.utils.formatEther(childTreasuryFinalBalance);

        const finalWalletBalance = ethers.utils.formatEther(await provider.getBalance(addr2.address));
        const expectedWalletBalance = parseFloat(childTreasuryInitialBalance) * (1 - fee);

        expect(finalWalletBalance - initialWalletBalance).to.closeTo(expectedWalletBalance, 0.01);
    });
});
