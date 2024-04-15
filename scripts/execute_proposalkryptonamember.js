const { saveFrontendFiles, getProposalKryptonaMemberContractAddress } = require('./utilities');
const { ethers } = require('hardhat');

const proposalKryptonaMemberAbi = require('../frontend/src/contracts/proposalkryptonamember.json'); // Path to the contract ABI

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

  const proposalKryptonaMemberAddress = getProposalKryptonaMemberContractAddress();

  const contract = new ethers.Contract(
    proposalKryptonaMemberAddress,
    proposalKryptonaMemberAbi.abi,
    deployer
  );
  
  const proposalId = await contract.nextProposalId() - 1;
  try {
    console.log("Executing proposal");
    await contract.executeProposal(proposalId);
    console.log("Proposal executed");
  } catch (error) {
    console.log(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });