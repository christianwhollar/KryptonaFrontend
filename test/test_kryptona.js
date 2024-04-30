//test/test_kryptona.js

const { expect } = require("chai");

describe("Kryptona Contract", function () {

  let Kryptona;
  let kryptona;
  let owner;

  beforeEach(async function () {
    Kryptona = await ethers.getContractFactory("Kryptona");

    const initialSupply = 1000000000;

    kryptona = await Kryptona.deploy(initialSupply);
    await kryptona.deployed();
    [owner] = await ethers.getSigners();
  })

  it("Should assign the total supply of tokens to the owner", async function () {
    const ownerBalance = await kryptona.balanceOf(owner.address);
    expect(await kryptona.totalSupply()).to.equal(ownerBalance);
  });
})