const { saveFrontendFiles, getDAOKryptonaContractAddress } = require('./utilities');

async function main() {
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which " +
      "gets automatically created and destroyed every time. Use the Hardhat " +
      "option '--network localhost'"
    );
  }

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  const daoKryptonaAddress = getDAOKryptonaContractAddress();

  const ProposalKryptonaTreasury = await ethers.getContractFactory("ProposalKryptonaTreasury");
  const proposalKryptonaTreasury = await ProposalKryptonaTreasury.deploy(daoKryptonaAddress);

  await proposalKryptonaTreasury.deployed();

  console.log("Kryptona Treasury Proposal Address:", proposalKryptonaTreasury.address);

  // Save the contract address and ABI for the frontend
  saveFrontendFiles(proposalKryptonaTreasury, "ProposalKryptonaTreasury");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  module.exports = main;
