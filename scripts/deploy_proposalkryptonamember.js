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

  const ProposalKryptonaMember = await ethers.getContractFactory("ProposalKryptonaMember");
  const proposalKryptonaMember = await ProposalKryptonaMember.deploy(daoKryptonaAddress);

  await proposalKryptonaMember.deployed();

  console.log("Kryptona Member Proposal Address:", proposalKryptonaMember.address);

  // Save the contract address and ABI for the frontend
  saveFrontendFiles(proposalKryptonaMember, "ProposalKryptonaMember");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });