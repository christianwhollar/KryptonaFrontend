/**
 * @fileoverview
 * Tests for the DAOKryptonaChild smart contract, a subsidiary DAO under the main Kryptona DAO.
 * This test suite checks the functionality of member management, including adding and removing members,
 * and enforcing role-based access controls, within the child DAO context.
 * 
 * These tests also verify the correct calculation of voting power based on token holdings, which is critical
 * for ensuring the integrity of governance mechanisms within the child DAO.
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAOKryptonaChild", function () {
    let owner, addr1, addr2;
    let Kryptona, kryptona, kryptonaTokenAddress;
    let KryptonaDAO, kryptonaDAO;
    let KryptonaTreasury, kryptonaTreasury, kryptonaTreasuryAddress;
    let KryptonaChildDAO, kryptonaChildDAO;

    // Setup function runs before each test to deploy contracts and prepare the environment
    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy the Kryptona token contract with an initial supply
        Kryptona = await ethers.getContractFactory("Kryptona");
        const initialSupply = 1000000;  // Set the initial token supply
        kryptona = await Kryptona.deploy(initialSupply);
        await kryptona.deployed();
        kryptonaTokenAddress = kryptona.address;  // Store token contract address

        // Mint tokens to test addresses to simulate initial distribution
        await kryptona.mint(addr1.address, 100);
        await kryptona.mint(addr2.address, 100);

        // Deploy the treasury contract for the DAO
        KryptonaTreasury = await ethers.getContractFactory("DAOKryptonaTreasury");
        kryptonaTreasury = await KryptonaTreasury.deploy(kryptonaTokenAddress);
        await kryptonaTreasury.deployed();
        kryptonaTreasuryAddress = kryptonaTreasury.address;

        // Deploy the main Kryptona DAO using the token and treasury addresses
        KryptonaDAO = await ethers.getContractFactory("DAOKryptona");
        kryptonaDAO = await KryptonaDAO.deploy(kryptonaTokenAddress, kryptonaTreasuryAddress);
        await kryptonaDAO.deployed();

        // Deploy the child DAO contract, similar setup as the main DAO
        KryptonaChildDAO = await ethers.getContractFactory("DAOKryptonaChild");
        kryptonaChildDAO = await KryptonaChildDAO.deploy(kryptonaTokenAddress, kryptonaTreasuryAddress);
        await kryptonaChildDAO.deployed();
    });

    // Test to ensure members can be successfully added to the child DAO
    it("Should add a member successfully", async function () {
        await kryptonaChildDAO.addMember(addr1.address);
        const member = await kryptonaChildDAO.members(addr1.address);
        expect(member.isMember).to.equal(true);  // Verify the member status is true
    });

    // Test to ensure members can be successfully removed from the child DAO
    it("Should remove a member successfully", async function () {
        await kryptonaChildDAO.addMember(addr1.address);
        let member = await kryptonaChildDAO.members(addr1.address);
        expect(member.isMember).to.equal(true);  // Ensure the member is initially added

        await kryptonaChildDAO.removeMember(addr1.address);
        member = await kryptonaChildDAO.members(addr1.address);
        expect(member.isMember).to.equal(false);  // Verify the member status is false after removal
    });

    // Test to ensure only authorized roles (owner or designated proposal contract) can add members
    it("Should not allow non-owner to add members", async function () {
        try {
            await kryptonaChildDAO.connect(addr1).addMember(addr2.address);
            expect.fail("Transaction did not revert with any error");  // This line should not execute
        } catch (error) {
            expect(error.message).to.include("Callable only by proposal contract or owner");  // Check error message
        }
    });

    // Test to verify the calculation of voting power based on token balance
    it("Verify voting power of added member", async function () {
        await kryptonaChildDAO.addMember(addr1.address);
        const member = await kryptonaChildDAO.members(addr1.address);
        const balance = await kryptona.balanceOf(addr1.address);
        expect(member.votingPower).to.equal(balance * 10);  // Ensure voting power matches expected calculation
    });
});
