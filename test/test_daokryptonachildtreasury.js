const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TreasuryChild", function (){
    let provider;
    let owner, addr1, addr2;
    let KryptonaTreasury, kryptonaTreasury, kryptonaTreasuryAddress;
    let ChildTreasury, childTreasury, childTreasuryAddress;
    let fee;

    before(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        provider = hre.ethers.provider;

        // Deploy Kryptona token contract
        Kryptona = await ethers.getContractFactory("Kryptona");
        const initialSupply = 1000000;
        kryptona = await Kryptona.deploy(initialSupply); // Adjust parameters as needed
        await kryptona.deployed();

        // get token address
        kryptonaTokenAddress = kryptona.address;

        KryptonaTreasury = await ethers.getContractFactory("DAOKryptonaTreasury");
        kryptonaTreasury = await KryptonaTreasury.deploy(kryptonaTokenAddress);
        await kryptonaTreasury.deployed();

        kryptonaTreasuryAddress = kryptonaTreasury.address;

        ChildTreasury = await ethers.getContractFactory("DAOKryptonaChildTreasury");
        childTreasury = await ChildTreasury.deploy(kryptonaTokenAddress, kryptonaTreasuryAddress);
        await childTreasury.deployed();

        childTreasuryAddress = childTreasury.address;

        fee = 0.01;
    });

    it("should deposit tokens correctly and pay fee to parent treasury", async () => {
        const initialBalance = ethers.utils.formatEther(await childTreasury.getETHBalance());
        expect(initialBalance).to.equal("0.0");

        const amountToSendString = "1.0";
        const amountToSend = ethers.utils.parseEther(amountToSendString);

        const amountToReceive = String(parseFloat(amountToSendString) * (1 - fee))

        await addr1.sendTransaction({
            to: childTreasuryAddress,
            value: amountToSend
        });
        
        const finalBalance = ethers.utils.formatEther(await childTreasury.getETHBalance());
        expect(finalBalance).to.equal(amountToReceive);
    });

    it("should withdrawal tokens correctly and pay fee to parent treasury", async () => {
        // get initial balance of wallet receiving deposit
        const initialWalletBalance = ethers.utils.formatEther(await provider.getBalance(addr2.address));

        // declare amount to send
        const amountToSendString = "1.0";
        const amountToSend = ethers.utils.parseEther(amountToSendString);

        // send ETH to child treasury
        await addr1.sendTransaction({
            to: childTreasuryAddress,
            value: amountToSend
        });

        // get initial balance of child treasury
        let childTreasuryInitialBalance = await childTreasury.getETHBalance();

        // withdrawal ETH from child treasury
        await childTreasury.withdrawEther(addr2.address, childTreasuryInitialBalance)

        // format child treasury balance to Ether
        childTreasuryInitialBalance = ethers.utils.formatEther(childTreasuryInitialBalance)

        // get balance of child treasury after withdrawal
        let childTreasuryFinalBalance = await childTreasury.getETHBalance();
        childTreasuryFinalBalance = ethers.utils.formatEther(childTreasuryFinalBalance)

        // get final balance of wallet receiving deposit
        const finalWalletBalance = ethers.utils.formatEther(await provider.getBalance(addr2.address));

        // calculate expected balance using fee
        const expectedWalletBalance = parseFloat(childTreasuryInitialBalance) * (1 - fee);

        expect(finalWalletBalance - initialWalletBalance).to.closeTo(expectedWalletBalance, 0.01)
    });
});

