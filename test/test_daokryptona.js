/**
 * @fileoverview
 * Tests for KryptonaDAO smart contract functionalities including member management
 * and voting power calculations. This suite ensures that the DAO operations such as adding and removing members,
 * and restricting actions to authorized roles, behave as expected.
 *
 * The tests also cover error handling to ensure that the system reacts appropriately to unauthorized actions.
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KryptonaDAO", function () {
    let KryptonaDAO, kryptonaDAO;
    let Kryptona, kryptona, kryptonaTokenAddress;
    let KryptonaTreasury, kryptonaTreasury, kryptonaTreasuryAddress;
    let owner, addr1, addr2;

    // Before each test, deploy the contracts and set up the environment.
    beforeEach(async function () {
        // Get signers from Hardhat's environment
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy the Kryptona token contract and set its initial supply.
        Kryptona = await ethers.getContractFactory("Kryptona");
        const initialSupply = 1000000000;
        kryptona = await Kryptona.deploy(initialSupply);
        await kryptona.deployed();
        kryptonaTokenAddress = kryptona.address;

        // Mint tokens to addresses to simulate initial token distribution.
        await kryptona.mint(addr1.address, 100);
        await kryptona.mint(addr2.address, 100);

        // Deploy the Kryptona Treasury contract linking it to the token contract.
        KryptonaTreasury = await ethers.getContractFactory("DAOKryptonaTreasury");
        kryptonaTreasury = await KryptonaTreasury.deploy(kryptonaTokenAddress);
        await kryptonaTreasury.deployed();
        kryptonaTreasuryAddress = kryptonaTreasury.address;

        // Deploy the KryptonaDAO contract with references to the token and treasury contracts.
        KryptonaDAO = await ethers.getContractFactory("DAOKryptona");
        kryptonaDAO = await KryptonaDAO.deploy(kryptonaTokenAddress, kryptonaTreasuryAddress);
        await kryptonaDAO.deployed();
    });

    // Test case to verify that a member can be added successfully.
    it("Should add a member successfully", async function () {
        await kryptonaDAO.addMember(addr1.address);
        const member = await kryptonaDAO.members(addr1.address);
        expect(member.isMember).to.equal(true); // Assert member status is true
    });

    // Test case to verify that a member can be removed successfully.
    it("Should remove a member successfully", async function () {
        await kryptonaDAO.addMember(addr1.address);
        let member = await kryptonaDAO.members(addr1.address);
        expect(member.isMember).to.equal(true);

        await kryptonaDAO.removeMember(addr1.address);
        member = await kryptonaDAO.members(addr1.address);
        expect(member.isMember).to.equal(false); // Assert member status is false after removal
    });

    // Test case to ensure that only authorized users (e.g., owner or proposal contract) can add members.
    it("Should not allow non-owner to add members", async function () {
        try {
            await kryptonaDAO.connect(addr1).addMember(addr2.address);
            expect.fail("Transaction did not revert with any error");
        } catch (error) {
            expect(error.message).to.include("Callable only by proposal contract or owner");
        }
    });

    // Test case to verify the voting power calculation based on the member's token balance.
    it("Verify voting power of added member", async function () {
        await kryptonaDAO.addMember(addr1.address);
        const member = await kryptonaDAO.members(addr1.address);
        const balance = await kryptona.balanceOf(addr1.address);
        expect(member.votingPower).to.equal(BigInt(balance) * 10n); // Assert voting power is calculated correctly
    });
});
