const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * @fileoverview
 * Tests for the AIModel smart contract to ensure that NFT minting processes function correctly,
 * particularly focusing on the assignment and retrieval of tokenURI values.
 * This test suite validates that the tokenURI associated with newly minted NFTs is accurately
 * recorded and retrievable, confirming that metadata handling is consistent with expected behaviors.
 */

describe("AIModel Contract", function () {
    let AIModel;
    let aiModel;
    let owner;
    let addr1;

    // Set up the AIModel contract environment before each test.
    beforeEach(async function () {
        // Retrieve the ContractFactory and Signers from Hardhat's environment.
        AIModel = await ethers.getContractFactory("AIModel");
        [owner, addr1] = await ethers.getSigners();

        // Deploy a new AIModel contract instance before each test to ensure isolation.
        aiModel = await AIModel.deploy();
    });

    it("Should mint an NFT with the correct tokenURI", async function () {
        // Read the tokenURI from the file specified to ensure it matches expected output.
        const tokenURIFilePath = path.join(__dirname, "../tokenURI/modelmetadatatokenuri.txt");
        const tokenURIData = fs.readFileSync(tokenURIFilePath, { encoding: "utf8" });
        const tokenURI = tokenURIData.split("\n")[0]; // Get the first line as the token URI

        // Log the token URI to assist in debugging and verification during test runs.
        console.log("Testing tokenURI:", tokenURI);

        // Mint a new NFT to the specified address with the token URI.
        const mintTx = await aiModel.connect(owner).mintNFT(addr1.address, tokenURI);

        // Confirm the transaction completes by waiting for it to be mined.
        await mintTx.wait();

        // Assume the token ID of the newly minted NFT is 1 (first minted item).
        const newItemId = 1;
        
        // Retrieve the token URI from the contract for the newly minted NFT.
        const mintedTokenURI = await aiModel.tokenURI(newItemId);

        // Validate that the token URI stored in the blockchain matches the expected URI.
        expect(mintedTokenURI).to.equal(tokenURI);
    });
});
