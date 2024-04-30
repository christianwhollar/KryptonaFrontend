const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KryptonaTreasury:", function (){
    let provider;
    let Kryptona, kryptona, kryptonaTokenAddress;
    let KryptonaTreasury, kryptonaTreasury, kryptonaTreasuryAddress;
    let owner, addr1;

    this.beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        provider = hre.ethers.provider;

        // Deploy Kryptona token contract
        Kryptona = await ethers.getContractFactory("Kryptona");

        const initialSupply = 1000000000;

        kryptona = await Kryptona.deploy(initialSupply);
        await kryptona.deployed();

        // get token address
        kryptonaTokenAddress = kryptona.address;

        KryptonaTreasury = await ethers.getContractFactory("DAOKryptonaTreasury");
        kryptonaTreasury = await KryptonaTreasury.deploy(kryptonaTokenAddress);
        await kryptonaTreasury.deployed();

        kryptonaTreasuryAddress = kryptonaTreasury.address;
    });
    
    it("Should receive ETH deposit", async function () {
        //
        expect(await kryptonaTreasury.getETHBalance()).to.equal(0);
        const amountToSend = ethers.utils.parseUnits("1.0", "ether");

        await addr1.sendTransaction({
            to: kryptonaTreasuryAddress,
            value: amountToSend
        });

        const finalBalance = await kryptonaTreasury.getETHBalance();
        expect(finalBalance).to.equal(amountToSend);
    });

});