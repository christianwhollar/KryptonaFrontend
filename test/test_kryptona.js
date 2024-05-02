/**
 * @fileoverview
 * Tests for the Kryptona smart contract to ensure correct token distribution and functionality.
 * This suite primarily focuses on verifying that the total supply of tokens is correctly assigned
 * to the owner's account upon deployment, which is fundamental for the initial distribution of the
 * governance tokens in the Kryptona DAO ecosystem.
 */

const { expect } = require("chai");

describe("Kryptona Contract", function () {
    let Kryptona;
    let kryptona;
    let owner;

    // Setup the contract for testing
    beforeEach(async function () {
        // Retrieve the contract factory for Kryptona
        Kryptona = await ethers.getContractFactory("Kryptona");

        // Define the initial supply for the token deployment
        const initialSupply = 1000000000;

        // Deploy the contract and store the instance
        kryptona = await Kryptona.deploy(initialSupply);
        await kryptona.deployed();

        // Retrieve the first signer from Hardhat's environment to simulate the owner
        [owner] = await ethers.getSigners();
    });

    // Test case to verify that all initial tokens are assigned to the owner's address
    it("Should assign the total supply of tokens to the owner", async function () {
        // Retrieve the balance of tokens held by the owner
        const ownerBalance = await kryptona.balanceOf(owner.address);

        // Ensure that this balance equals the total supply created upon deployment
        expect(await kryptona.totalSupply()).to.equal(ownerBalance);
    });
});
