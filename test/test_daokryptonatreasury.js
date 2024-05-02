/**
 * @fileoverview
 * Tests for the KryptonaTreasury contract to ensure it properly handles Ethereum deposits.
 * This suite checks that the treasury can correctly receive and report balances of ETH,
 * which are critical operations for managing the financial assets of the DAO.
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KryptonaTreasury:", function () {
    let provider;
    let Kryptona, kryptona, kryptonaTokenAddress;
    let KryptonaTreasury, kryptonaTreasury, kryptonaTreasuryAddress;
    let owner, addr1;

    // Setup function runs before each test to deploy contracts and prepare the environment
    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        provider = hre.ethers.provider;

        // Deploy the Kryptona token contract with a large initial supply
        Kryptona = await ethers.getContractFactory("Kryptona");
        const initialSupply = 1000000000;
        kryptona = await Kryptona.deploy(initialSupply);
        await kryptona.deployed();
        kryptonaTokenAddress = kryptona.address;

        // Setup the Kryptona Treasury using the token contract address
        KryptonaTreasury = await ethers.getContractFactory("DAOKryptonaTreasury");
        kryptonaTreasury = await KryptonaTreasury.deploy(kryptonaTokenAddress);
        await kryptonaTreasury.deployed();
        kryptonaTreasuryAddress = kryptonaTreasury.address;
    });

    // Test to ensure the treasury can receive and accurately report Ethereum deposits
    it("Should receive ETH deposit", async function () {
        // Initially, the treasury should have zero balance
        expect(await kryptonaTreasury.getETHBalance()).to.equal(0);

        // Define the amount of Ether to send
        const amountToSend = ethers.utils.parseUnits("1.0", "ether");

        // Perform the transaction from addr1 to the treasury
        await addr1.sendTransaction({
            to: kryptonaTreasuryAddress,
            value: amountToSend
        });

        // Check the final balance in the treasury to ensure it reflects the deposit
        const finalBalance = await kryptonaTreasury.getETHBalance();
        expect(finalBalance).to.equal(amountToSend);
    });
});
